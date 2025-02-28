import type { Request, Response } from 'express';
import express from 'express';
import { auth } from '../middleware/auth';
import type { JwtPayload } from 'jsonwebtoken';
import { socialLinksSchema, genresSchema, biographySchema } from '../utils/validation';
import { ZodError } from 'zod';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        userId: number;
      };
    }
  }
}

const router = express.Router();

const updatePhoto = async (req: Request, res: Response) => {
  try {
    const { photo_profil } = req.body;
    const userId = req.user?.userId;

    const [_result] = await req.app.locals.pool.execute(
      'UPDATE Utilisateur SET photo_profil = ? WHERE id_utilisateur = ?',
      [photo_profil, userId]
    );

    res.json({ message: 'Photo de profil mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la photo de profil' });
    console.error(error);
  }
};

const updateSocialLinks = async (req: Request, res: Response) => {
  try {
    const { platform, link } = socialLinksSchema.parse(req.body);
    const userId = req.user?.userId;

    const columnName = `${platform}_link`;
    const [_result] = await req.app.locals.pool.execute(
      `UPDATE Utilisateur SET ${columnName} = ? WHERE id_utilisateur = ?`,
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
    res.status(500).json({ error: 'Erreur lors de la mise à jour du lien social' });
    console.error(error);
  }
};

const updateGenres = async (req: Request, res: Response) => {
  try {
    const { genres } = genresSchema.parse(req.body);
    const userId = req.user?.userId;

    // Convertir le tableau en chaîne
    const genresString = genres.join(',');

    const [_result] = await req.app.locals.pool.execute(
      'UPDATE Utilisateur SET genres_musicaux = ? WHERE id_utilisateur = ?',
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
    res.status(500).json({ error: 'Erreur lors de la mise à jour des genres musicaux' });
    console.error(error);
  }
};

const updateBiography = async (req: Request, res: Response) => {
  try {
    const { biography } = biographySchema.parse(req.body);
    const userId = req.user?.userId;

    const [_result] = await req.app.locals.pool.execute(
      'UPDATE Utilisateur SET biographie = ? WHERE id_utilisateur = ?',
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
    res.status(500).json({ error: 'Erreur lors de la mise à jour du lien social' });
    console.error(error);
  }
};

router.put('/photo', auth, updatePhoto);
router.put('/social-links', auth, updateSocialLinks);
router.put('/genres', auth, updateGenres);
router.put('/biography', auth, updateBiography);

export default router;
