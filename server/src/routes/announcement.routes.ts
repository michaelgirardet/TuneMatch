import express from 'express';
import { auth } from '../middleware/auth';
import { z } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';

const router = express.Router();

const announcementSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  musical_style: z.string().min(1, 'Le style musical est requis'),
  voice_type: z.string().optional(),
  instrument: z.string().optional(),
  other_criteria: z.string().optional(),
});

type AuthRequestHandler = RequestHandler<
  { id: string },
  any,
  any,
  any,
  { user?: AuthRequest['user'] }
>;

// Créer une nouvelle annonce
const createAnnouncement: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier si l'utilisateur est un producteur
    const [userRows] = await req.app.locals.pool.execute('SELECT role FROM users WHERE id = ?', [
      userId,
    ]);
    const user = userRows[0];

    if (!user || user.role !== 'producteur') {
      return res.status(403).json({ error: 'Seuls les producteurs peuvent créer des annonces' });
    }

    const announcement = announcementSchema.parse(req.body);

    const [result] = await req.app.locals.pool.execute(
      'INSERT INTO announcements (title, description, musical_style, voice_type, instrument, other_criteria, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        announcement.title,
        announcement.description,
        announcement.musical_style,
        announcement.voice_type || null,
        announcement.instrument || null,
        announcement.other_criteria || null,
        userId,
      ]
    );

    res.status(201).json({
      message: 'Annonce créée avec succès',
      announcement: { ...announcement, id: result.insertId },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors,
      });
    }
    console.error("Erreur lors de la création de l'annonce:", error);
    res.status(500).json({ error: "Erreur lors de la création de l'annonce" });
  }
};

// Récupérer toutes les annonces actives
const getAnnouncements: AuthRequestHandler = async (req, res) => {
  try {
    const [rows] = await req.app.locals.pool.execute(
      `SELECT a.*, u.nom_utilisateur, u.photo_profil 
       FROM announcements a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.status = 'active' 
       ORDER BY a.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
};

// Récupérer les annonces d'un utilisateur
const getUserAnnouncements: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [rows] = await req.app.locals.pool.execute(
      'SELECT * FROM announcements WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
};

// Mettre à jour une annonce
const updateAnnouncement: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const announcementId = req.params.id;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const announcement = announcementSchema.parse(req.body);

    // Vérifier que l'annonce appartient à l'utilisateur
    const [rows] = await req.app.locals.pool.execute(
      'SELECT user_id FROM announcements WHERE id = ?',
      [announcementId]
    );

    if (!rows[0] || rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Non autorisé à modifier cette annonce' });
    }

    await req.app.locals.pool.execute(
      'UPDATE announcements SET title = ?, description = ?, musical_style = ?, voice_type = ?, instrument = ?, other_criteria = ? WHERE id = ?',
      [
        announcement.title,
        announcement.description,
        announcement.musical_style,
        announcement.voice_type || null,
        announcement.instrument || null,
        announcement.other_criteria || null,
        announcementId,
      ]
    );

    res.json({ message: 'Annonce mise à jour avec succès' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors,
      });
    }
    console.error("Erreur lors de la mise à jour de l'annonce:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'annonce" });
  }
};

// Supprimer une annonce
const deleteAnnouncement: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const announcementId = req.params.id;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier que l'annonce appartient à l'utilisateur
    const [rows] = await req.app.locals.pool.execute(
      'SELECT user_id FROM announcements WHERE id = ?',
      [announcementId]
    );

    if (!rows[0] || rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Non autorisé à supprimer cette annonce' });
    }

    await req.app.locals.pool.execute('DELETE FROM announcements WHERE id = ?', [announcementId]);

    res.json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce:", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'annonce" });
  }
};

router.post('/', auth, createAnnouncement);
router.get('/', auth, getAnnouncements);
router.get('/user', auth, getUserAnnouncements);
router.put('/:id', auth, updateAnnouncement);
router.delete('/:id', auth, deleteAnnouncement);

export default router;
