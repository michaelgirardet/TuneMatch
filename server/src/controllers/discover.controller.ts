import type { Request, Response } from 'express';

// Route pour découvrir des profils
export const getDiscoverUsers = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  // Exclure soi-même et les déjà likés ou passés
  const [rows] = await req.app.locals.pool.execute(
    `
    SELECT u.id, u.nom_utilisateur, u.photo_profil, u.role, u.city, u.country, u.musical_style, u.bio
    FROM users u
    WHERE u.id != ?
      AND u.id NOT IN (
        SELECT liked_id FROM user_likes WHERE liker_id = ?
      )
  `,
    [userId, userId]
  );
  res.json(rows);
};

// Route pour liker
export const likeUser = async (req: Request, res: Response) => {
  const likerId = req.user?.userId;
  const { likedId } = req.body;
  // 1. Insère le like
  await req.app.locals.pool.execute(
    'INSERT IGNORE INTO user_likes (liker_id, liked_id) VALUES (?, ?)',
    [likerId, likedId]
  );
  // 2. Vérifie si l'autre a déjà liké
  const [rows] = await req.app.locals.pool.execute(
    'SELECT * FROM user_likes WHERE liker_id = ? AND liked_id = ?',
    [likedId, likerId]
  );
  if (rows.length > 0) {
    // MATCH !
    return res.json({ match: true });
  }
  res.json({ match: false });
};

// Route pour récupérer ses matchs
export const getMatches = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const [rows] = await req.app.locals.pool.execute(
    `
    SELECT u.id, u.nom_utilisateur, u.photo_profil, u.role, u.city, u.country, u.musical_style, u.bio
    FROM users u
    WHERE u.id IN (
      SELECT l1.liked_id
      FROM user_likes l1
      JOIN user_likes l2 ON l1.liked_id = l2.liker_id
      WHERE l1.liker_id = ? AND l2.liked_id = ?
    )
  `,
    [userId, userId]
  );
  res.json(rows);
};
