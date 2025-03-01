import express from 'express';
import { auth } from '../middleware/auth';
import { z } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';

const router = express.Router();

const applicationSchema = z.object({
  message: z.string().min(1, "Le message est requis"),
  selected_tracks: z.string().optional()
});

type AuthRequestHandler = RequestHandler<{ id?: string }, any, any, any, { user?: AuthRequest['user'] }>;

// Postuler à une annonce
const applyToAnnouncement: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const announcementId = req.params.id;

    if (!userId || !announcementId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié ou annonce non spécifiée' });
    }

    // Vérifier si l'utilisateur est un artiste (musicien ou chanteur)
    const [userRows] = await req.app.locals.pool.execute(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );
    const user = userRows[0];

    if (!user || (user.role !== 'musicien' && user.role !== 'chanteur')) {
      return res.status(403).json({ error: 'Seuls les musiciens et chanteurs peuvent postuler aux annonces' });
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
      application: { ...application, id: result.insertId }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors
      });
    }
    console.error('Erreur lors de l\'envoi de la candidature:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la candidature' });
  }
};

// Obtenir les candidatures pour une annonce (pour le producteur)
const getAnnouncementApplications: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const announcementId = req.params.id;

    if (!userId || !announcementId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié ou annonce non spécifiée' });
    }

    // Vérifier que l'annonce appartient au producteur
    const [announcementRows] = await req.app.locals.pool.execute(
      'SELECT user_id FROM announcements WHERE id = ?',
      [announcementId]
    );

    if (!announcementRows[0] || announcementRows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Non autorisé à voir ces candidatures' });
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
    console.error('Erreur lors de la récupération des candidatures:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des candidatures' });
  }
};

// Mettre à jour le statut d'une candidature
const updateApplicationStatus: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const applicationId = req.params.id;
    const { status } = req.body;

    if (!userId || !applicationId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié ou candidature non spécifiée' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    // Vérifier que l'annonce appartient au producteur
    const [applicationRows] = await req.app.locals.pool.execute(
      `SELECT a.id FROM applications a 
       JOIN announcements an ON a.announcement_id = an.id 
       WHERE a.id = ? AND an.user_id = ?`,
      [applicationId, userId]
    );

    if (!applicationRows[0]) {
      return res.status(403).json({ error: 'Non autorisé à modifier cette candidature' });
    }

    await req.app.locals.pool.execute(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, applicationId]
    );

    res.json({ message: 'Statut de la candidature mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
};

router.post('/announcements/:id/apply', auth, applyToAnnouncement);
router.get('/announcements/:id/applications', auth, getAnnouncementApplications);
router.put('/:id/status', auth, updateApplicationStatus);

export default router; 