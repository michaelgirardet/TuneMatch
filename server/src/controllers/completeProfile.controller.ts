import { z } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';

const profileSchema = z.object({
  instruments: z.string().optional(),
  genres_musicaux: z.string().optional(),
  biography: z.string().optional(),
  youtube_link: z.string().url().optional().or(z.literal('')),
  instagram_link: z.string().url().optional().or(z.literal('')),
  soundcloud_link: z.string().url().optional().or(z.literal('')),
});

type AuthRequestHandler<Body = unknown> = RequestHandler<
  unknown,
  unknown,
  Body,
  unknown,
  { user?: AuthRequest['user'] }
>;

export const completeProfile: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides', details: parsed.error.errors });
    }

    const {
      instruments,
      genres_musicaux,
      biography,
      youtube_link,
      instagram_link,
      soundcloud_link,
    } = parsed.data;

    await req.app.locals.pool.execute(
      `UPDATE users SET instruments = ?, genres_musicaux = ?, biography = ?, youtube_link = ?, instagram_link = ?, soundcloud_link = ? 
       WHERE id = ?`,
      [
        instruments,
        genres_musicaux,
        biography,
        youtube_link,
        instagram_link,
        soundcloud_link,
        userId,
      ]
    );

    res.status(200).json({ message: 'Profil complété avec succès' });
  } catch (error) {
    console.error('Erreur lors de la complétion du profil:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la complétion du profil' });
  }
};
