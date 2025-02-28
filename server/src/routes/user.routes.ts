import type { Response } from 'express';
import express from 'express';
import { auth } from '../middleware/auth';
import { socialLinksSchema, genresSchema, biographySchema, locationSchema } from '../utils/validation';
import { ZodError } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';

const router = express.Router();

type AuthRequestHandler = RequestHandler<{}, any, any, any, { user?: AuthRequest['user'] }>;

const updatePhoto: AuthRequestHandler = async (req, res) => {
  try {
    const { photo_profil } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [_result] = await req.app.locals.pool.execute(
      'UPDATE users SET photo_profil = ? WHERE id = ?',
      [photo_profil, userId]
    );

    res.json({ message: 'Photo de profil mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo de profil:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la photo de profil' });
  }
};

const updateSocialLinks: AuthRequestHandler = async (req, res) => {
  try {
    const { platform, link } = socialLinksSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const columnName = `${platform}_link`;
    const [_result] = await req.app.locals.pool.execute(
      `UPDATE users SET ${columnName} = ? WHERE id = ?`,
      [link, userId]
    );

    res.json({ message: 'Lien social mis à jour avec succès' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors,
      });
    }
    console.error('Erreur lors de la mise à jour du lien social:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du lien social' });
  }
};

const updateGenres: AuthRequestHandler = async (req, res) => {
  try {
    const { genres } = genresSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const genresString = genres.join(',');

    const [_result] = await req.app.locals.pool.execute(
      'UPDATE users SET genres_musicaux = ? WHERE id = ?',
      [genresString, userId]
    );

    res.json({
      message: 'Genres musicaux mis à jour avec succès',
      genres: genres,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors,
      });
    }
    console.error('Erreur lors de la mise à jour des genres musicaux:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des genres musicaux' });
  }
};

const updateBiography: AuthRequestHandler = async (req, res) => {
  try {
    const { biography } = biographySchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [_result] = await req.app.locals.pool.execute(
      'UPDATE users SET biography = ? WHERE id = ?',
      [biography, userId]
    );

    res.json({ message: 'Biographie mise à jour avec succès' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors,
      });
    }
    console.error('Erreur lors de la mise à jour de la biographie:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la biographie' });
  }
};

const updateLocation: AuthRequestHandler = async (req, res) => {
  try {
    const { city, country } = locationSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const [_result] = await req.app.locals.pool.execute(
      'UPDATE users SET city = ?, country = ? WHERE id = ?',
      [city, country, userId]
    );

    res.json({ 
      message: 'Localisation mise à jour avec succès',
      location: { city, country }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.errors,
      });
    }
    console.error('Erreur lors de la mise à jour de la localisation:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la localisation' });
  }
};

router.put('/photo', auth, updatePhoto);
router.put('/social-links', auth, updateSocialLinks);
router.put('/genres', auth, updateGenres);
router.put('/biography', auth, updateBiography);
router.put('/location', auth, updateLocation);

export default router;
