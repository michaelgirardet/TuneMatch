import express from 'express';
import { auth } from '../middleware/auth';
import { z } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';

const router = express.Router();

const applicationSchema = z.object({
  message: z.string().min(1, 'Le message est requis'),
  selected_tracks: z.string().optional(),
});

type AuthRequestHandler<Body = unknown> = RequestHandler<
  { id?: string },
  unknown,
  Body,
  unknown,
  { user?: AuthRequest['user'] }
>;

// Postuler à une annonce
const applyToAnnouncement: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const announcementId = req.params.id;

    if (!userId || !announcementId) {
      return res
        .status(401)
        .json({ error: 'Utilisateur non authentifié ou annonce non spécifiée' });
    }

    // Vérifier si l'utilisateur est un artiste (musicien ou chanteur)
    const [userRows] = await req.app.locals.pool.execute('SELECT role FROM users WHERE id = ?', [
      userId,
    ]);
    const user = userRows[0];

    if (!user || (user.role !== 'musicien' && user.role !== 'chanteur')) {
      return res
        .status(403)
        .json({ error: 'Seuls les musiciens et chanteurs peuvent postuler aux annonces' });
    }

    const application = applicationSchema.parse(req.body);

    // Vérifier si l'utilisateur a déjà postulé
    const [existingRows] = await req.app.locals.pool.execute(
      'SELECT id FROM applications WHERE announcement_id = ? AND artist_id = ?',
      [announcementId, userId]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ error: 'Vous avez déjà postulé à cette annonce' });
    }
    const [result] = await req.app.locals.pool.execute(
      'INSERT INTO applications (announcement_id, artist_id, message, selected_tracks) VALUES (?, ?, ?, ?)',
      [announcementId, userId, application.message, application.selected_tracks || null]
    );

    res.status(201).json({
      message: 'Candidature envoyée avec succès',
      application: { ...application, id: result.insertId },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors,
      });
    }
    console.error("Erreur lors de l'envoi de la candidature:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de la candidature" });
  }
};

// Obtenir les Collabs pour une annonce (pour le producteur)
const getAnnouncementApplications: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const announcementId = req.params.id;

    if (!userId || !announcementId) {
      return res
        .status(401)
        .json({ error: 'Utilisateur non authentifié ou annonce non spécifiée' });
    }

    // Vérifier que l'annonce appartient au producteur
    const [announcementRows] = await req.app.locals.pool.execute(
      'SELECT user_id FROM announcements WHERE id = ?',
      [announcementId]
    );

    if (!announcementRows[0] || announcementRows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Non autorisé à voir ces Collabs' });
    }

    const [applications] = await req.app.locals.pool.execute(
      `SELECT a.*, u.nom_utilisateur, u.photo_profil, u.genres_musicaux 
       FROM applications a 
       JOIN users u ON a.artist_id = u.id 
       WHERE a.announcement_id = ?`,
      [announcementId]
    );

    res.json(applications);
  } catch (error) {
    console.error('Erreur lors de la récupération des Collabs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des Collabs' });
  }
};

// Mettre à jour le statut d'une candidature
const updateApplicationStatus: AuthRequestHandler<{ status: string }> = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const applicationId = req.params.id;
    const { status } = req.body;

    if (!userId || !applicationId) {
      return res
        .status(401)
        .json({ error: 'Utilisateur non authentifié ou candidature non spécifiée' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    // Vérifier que l'annonce appartient au producteur et récupérer les informations nécessaires
    const [applicationRows] = await req.app.locals.pool.execute(
      `SELECT a.id, a.artist_id, an.title, u.nom_utilisateur 
       FROM applications a 
       JOIN announcements an ON a.announcement_id = an.id 
       JOIN users u ON an.user_id = u.id
       WHERE a.id = ? AND an.user_id = ?`,
      [applicationId, userId]
    );

    if (!applicationRows[0]) {
      return res.status(403).json({ error: 'Non autorisé à modifier cette candidature' });
    }

    const application = applicationRows[0];

    // Mettre à jour le statut de la candidature
    await req.app.locals.pool.execute('UPDATE applications SET status = ? WHERE id = ?', [
      status,
      applicationId,
    ]);

    // Créer une notification pour l'artiste
    const notificationContent =
      status === 'accepted'
        ? `Votre candidature pour l'annonce "${application.title}" a été acceptée par ${application.nom_utilisateur}`
        : `Votre candidature pour l'annonce "${application.title}" a été refusée par ${application.nom_utilisateur}`;

    await req.app.locals.pool.execute(
      'INSERT INTO notifications (user_id, type, content, related_id) VALUES (?, ?, ?, ?)',
      [application.artist_id, 'application_status', notificationContent, applicationId]
    );

    res.json({ message: 'Statut de la candidature mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
};

// Récupérer les notifications d'un utilisateur
const getUserNotifications: AuthRequestHandler = async (req, res) => {
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
const markNotificationAsRead: AuthRequestHandler = async (req, res) => {
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

router.post('/announcements/:id/apply', auth, applyToAnnouncement);
router.get('/announcements/:id/applications', auth, getAnnouncementApplications);
router.put('/:id/status', auth, updateApplicationStatus);
router.get('/notifications', auth, getUserNotifications);
router.put('/notifications/:id/read', auth, markNotificationAsRead);

export default router;
