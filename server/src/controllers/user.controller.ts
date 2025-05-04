import express from 'express';
import type { RequestHandler } from 'express';
import { ZodError } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import {
  biographySchema,
  genresSchema,
  locationSchema,
  socialLinksSchema,
} from '../utils/validation';

type AuthRequestHandler = RequestHandler<
  { id?: string },
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, string>,
  { user?: AuthRequest['user'] }
>;

export const updatePhoto: AuthRequestHandler = async (req, res) => {
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

export const updateSocialLinks: AuthRequestHandler = async (req, res) => {
  try {
    const { platform, link } = socialLinksSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const columnName = `${platform}_link`;
    const [_result] = await req.app.locals.pool.execute(
      `UPDATE users SET ${columnName} = ? WHEREcom id = ?`,
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

export const updateGenres: AuthRequestHandler = async (req, res) => {
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

export const updateBiography: AuthRequestHandler = async (req, res) => {
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

export const updateLocation: AuthRequestHandler = async (req, res) => {
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
      location: { city, country },
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

// Récupérer le profil d'un utilisateur par son ID
export const getUserProfile: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur non spécifié' });
    }

    const [rows] = await req.app.locals.pool.execute(
      `SELECT id, nom_utilisateur, role, photo_profil, biography, genres_musicaux,
       youtube_link, instagram_link, soundcloud_link, city, country
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
};

export const updateProfile: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Récupère tous les champs du body
    const {
      instruments,
      genres_musicaux,
      biography,
      youtube_link,
      instagram_link,
      soundcloud_link,
    } = req.body;

    // Ici tu peux ajouter des validations si tu veux (Zod, etc.)

    await req.app.locals.pool.execute(
      'UPDATE users SET instruments = ?, genres_musicaux = ?, biography = ?, youtube_link = ?, instagram_link = ?, soundcloud_link = ? WHERE id = ?',
      [
        instruments || null,
        genres_musicaux || null,
        biography || null,
        youtube_link || null,
        instagram_link || null,
        soundcloud_link || null,
        userId,
      ]
    );

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
};
