import type { Request, Response } from 'express';

// Route pour découvrir des profils
export const getDiscoverUsers = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const [rows] = await req.app.locals.pool.execute(
      `
      SELECT u.id, u.nom_utilisateur, u.photo_profil, u.role, u.city, u.country, u.genres_musicaux, u.biography
      FROM users u
      WHERE u.id != ?
        AND u.id NOT IN (
          SELECT viewed_id FROM swipe_queue WHERE viewer_id = ?
        )
      LIMIT 20
      `,
      [userId, userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erreur getDiscoverUsers:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Route pour liker
export const likeUser = async (req: Request, res: Response) => {
  const likerId = req.user?.userId;
  const { likedId } = req.body;

  try {
    // Insérer le like (ignore si déjà existant)
    await req.app.locals.pool.execute(
      'INSERT IGNORE INTO likes (liker_id, liked_id) VALUES (?, ?)',
      [likerId, likedId]
    );

    // Ajouter dans swipe_queue que le profil a été vu
    await req.app.locals.pool.execute(
      'INSERT IGNORE INTO swipe_queue (viewer_id, viewed_id, seen) VALUES (?, ?, TRUE)',
      [likerId, likedId]
    );

    // Vérifier si l'autre a déjà liké (match)
    const [rows] = await req.app.locals.pool.execute(
      'SELECT * FROM likes WHERE liker_id = ? AND liked_id = ? AND is_match = TRUE',
      [likedId, likerId]
    );

    if (rows.length > 0) {
      // Match déjà enregistré, rien à faire
      return res.json({ match: true });
    }

    // Vérifier si l'autre a liké (sans match)
    const [reciprocal] = await req.app.locals.pool.execute(
      'SELECT * FROM likes WHERE liker_id = ? AND liked_id = ?',
      [likedId, likerId]
    );

    if (reciprocal.length > 0) {
      // Mettre à jour les deux en match
      await req.app.locals.pool.execute(
        'UPDATE likes SET is_match = TRUE WHERE (liker_id = ? AND liked_id = ?) OR (liker_id = ? AND liked_id = ?)',
        [likerId, likedId, likedId, likerId]
      );
      return res.json({ match: true });
    }

    // Pas de match
    res.json({ match: false });
  } catch (error) {
    console.error('Erreur likeUser:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Route pour récupérer ses matchs
export const getMatches = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const [rows] = await req.app.locals.pool.execute(
      `
      SELECT u.id, u.nom_utilisateur, u.photo_profil, u.role, u.city, u.country, u.genres_musicaux, u.biography
      FROM users u
      WHERE u.id IN (
        SELECT liked_id FROM likes WHERE liker_id = ? AND is_match = TRUE
      )
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erreur getMatches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

//  Supprimer un match
export const deleteMatch = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const matchId = Number.parseInt(req.params.matchId, 10);

  try {
    // Supprimer les deux entrées like (dans les deux sens) pour "casser" le match
    await req.app.locals.pool.execute(
      'DELETE FROM likes WHERE (liker_id = ? AND liked_id = ?) OR (liker_id = ? AND liked_id = ?)',
      [userId, matchId, matchId, userId]
    );

    res.json({ message: 'Match supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteMatch:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
