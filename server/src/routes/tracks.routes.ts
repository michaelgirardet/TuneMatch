import express from 'express';
import { auth } from '../middleware/auth';
import { z } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';

const router = express.Router();

const trackSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  url: z.string().min(1, "L'URL est requise")
});

type AuthRequestHandler = RequestHandler<{ id?: string }, any, any, any, { user?: AuthRequest['user'] }>;

// Récupérer les morceaux d'un utilisateur spécifique
const getUserTracks: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur non spécifié' });
    }

    const [rows] = await req.app.locals.pool.execute(
      'SELECT * FROM tracks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des morceaux:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des morceaux' });
  }
};

// Récupérer tous les morceaux de l'utilisateur connecté
const getCurrentUserTracks: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [rows] = await req.app.locals.pool.execute(
      'SELECT * FROM tracks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des morceaux:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des morceaux' });
  }
};

// Ajouter un nouveau morceau
const addTrack: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const track = trackSchema.parse(req.body);

    const [userRows] = await req.app.locals.pool.execute(
      'SELECT nom_utilisateur FROM users WHERE id = ?',
      [userId]
    );
    const user = (userRows as any[])[0];

    const [result] = await req.app.locals.pool.execute(
      'INSERT INTO tracks (title, url, artist, user_id) VALUES (?, ?, ?, ?)',
      [track.title, track.url, user.nom_utilisateur, userId]
    );

    res.status(201).json({
      message: 'Morceau ajouté avec succès',
      track: { ...track, id: (result as any).insertId }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors
      });
    }
    console.error('Erreur lors de l\'ajout du morceau:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du morceau' });
  }
};

// Supprimer un morceau
const deleteTrack: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const trackId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier que le morceau appartient à l'utilisateur
    const [rows] = await req.app.locals.pool.execute(
      'SELECT id FROM tracks WHERE id = ? AND user_id = ?',
      [trackId, userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(403).json({ error: 'Non autorisé à supprimer ce morceau' });
    }

    await req.app.locals.pool.execute(
      'DELETE FROM tracks WHERE id = ?',
      [trackId]
    );

    res.json({ message: 'Morceau supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du morceau:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du morceau' });
  }
};

router.get('/user/:id', auth, getUserTracks);
router.get('/', auth, getCurrentUserTracks);
router.post('/', auth, addTrack);
router.delete('/:id', auth, deleteTrack);

export default router;
