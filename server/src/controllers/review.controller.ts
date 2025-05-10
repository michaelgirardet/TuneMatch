import type { Request, Response } from 'express';

// Middleware d'authentification qui ajoute req.user.userId
interface AuthUser {
  userId: number;
  email: string;
  role: string;
  nom_utilisateur: string;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Crée ou met à jour un avis d'un utilisateur sur un artiste
 * POST /api/reviews
 * Body: { reviewedId: number, rating: number, comment?: string }
 */
export const createOrUpdateReview = async (req: AuthRequest, res: Response) => {
  try {
    const reviewerId = req.user?.userId;
    const { reviewedId, rating, comment } = req.body;

    if (!reviewerId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (
      !reviewedId ||
      typeof reviewedId !== 'number' ||
      !rating ||
      typeof rating !== 'number' ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({ error: 'Données invalides' });
    }

    // Upsert : insérer ou mettre à jour si déjà existant
    await req.app.locals.pool.execute(
      `
      INSERT INTO reviews (reviewer_id, reviewed_id, rating, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), created_at = CURRENT_TIMESTAMP
      `,
      [reviewerId, reviewedId, rating, comment || null]
    );

    res.json({ message: 'Avis enregistré avec succès' });
  } catch (error) {
    console.error('Erreur createOrUpdateReview:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Récupère les avis et la note moyenne d'un utilisateur
 * GET /api/reviews/:userId
 */
export const getReviewsByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number.parseInt(req.params.userId, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'ID utilisateur invalide' });
    }

    // Récupérer les avis détaillés
    const [reviews] = await req.app.locals.pool.execute(
      `
      SELECT r.id, r.rating, r.comment, r.created_at,
             u.nom_utilisateur AS reviewer_name,
             u.photo_profil AS reviewer_photo
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewed_id = ?
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    // Calculer la note moyenne et le nombre d'avis
    const [avgResult] = await req.app.locals.pool.execute(
      `
      SELECT AVG(rating) AS average_rating, COUNT(*) AS review_count
      FROM reviews
      WHERE reviewed_id = ?
      `,
      [userId]
    );

    res.json({
      averageRating: avgResult[0]?.average_rating || 0,
      reviewCount: avgResult[0]?.review_count || 0,
      reviews,
    });
  } catch (error) {
    console.error('Erreur getReviewsByUser:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
