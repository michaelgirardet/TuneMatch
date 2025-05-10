import type { RequestHandler } from 'express';
import type { AuthRequest } from '../types/auth.types';

type AuthRequestHandler<Body = unknown> = RequestHandler<
  { id?: string },
  unknown,
  Body,
  unknown,
  { user?: AuthRequest['user'] }
>;

// Récupérer les notifications d'un utilisateur
export const getUserNotifications: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [notifications] = await req.app.locals.pool.execute(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
};

// Marquer une notification comme lue
export const markNotificationAsRead: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const notificationId = req.params.id;

    if (!userId || !notificationId) {
      return res
        .status(401)
        .json({ error: 'Utilisateur non authentifié ou notification non spécifiée' });
    }

    await req.app.locals.pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('🔄 Mise à jour impossible. Essaie encore une fois.:', error);
    res.status(500).json({ error: '🔄 Mise à jour impossible. Essaie encore une fois.' });
  }
};
