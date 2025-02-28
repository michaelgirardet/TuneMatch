import { Router } from 'express';
import type { Response } from 'express';
import type { ResultSetHeader } from 'mysql2/promise';
import { pool } from '../db/db';
import { auth } from '../middleware/auth';
import type { AuthRequest } from '../types/auth.types';

const router = Router();

// Récupérer tous les tracks d'un utilisateur
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [tracks] = await pool.execute(
      'SELECT * FROM tracks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(tracks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tracks:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des tracks' });
  }
});

// Ajouter un nouveau track
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, artist, url } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO tracks (title, artist, url, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [title, artist, url, userId]
    );

    res.status(201).json({
      message: 'Track ajouté avec succès',
      track: {
        id: result.insertId,
        title,
        artist,
        url,
        user_id: userId
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du track:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du track' });
  }
});

// Supprimer un track
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const trackId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier que le track appartient bien à l'utilisateur
    const [tracks] = await pool.execute(
      'SELECT * FROM tracks WHERE id = ? AND user_id = ?',
      [trackId, userId]
    );

    if (!Array.isArray(tracks) || tracks.length === 0) {
      return res.status(404).json({ error: 'Track non trouvé ou non autorisé' });
    }

    await pool.execute(
      'DELETE FROM tracks WHERE id = ? AND user_id = ?',
      [trackId, userId]
    );

    res.json({ message: 'Track supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du track:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du track' });
  }
});

export default router;
