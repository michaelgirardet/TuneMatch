import express from 'express';
import { auth } from '../middleware/auth';
import { z } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';

const router = express.Router();

const searchSchema = z.object({
  role: z.enum(['musicien', 'chanteur']).optional(),
  genres: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  instruments: z.string().optional(),
  page: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .optional(),
  limit: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .optional(),
});

interface SearchParams {
  role?: 'musicien' | 'chanteur';
  genres?: string;
  city?: string;
  country?: string;
  instruments?: string;
  page?: string;
  limit?: string;
}

interface SearchResponse {
  artists: Array<{
    id: number;
    nom_utilisateur: string;
    photo_profil: string | null;
    role: string;
    city: string;
    country: string;
    genres_musicaux: string;
    biography: string;
    instruments_pratiques: string | null;
    tracks_count: number;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type SqlParams = (string | number)[];

type AuthRequestHandler = RequestHandler<
  Record<string, never>,
  SearchResponse | { error: string },
  Record<string, never>,
  SearchParams,
  { user?: AuthRequest['user'] }
>;

const searchArtists: AuthRequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const filters = searchSchema.parse(req.query);
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        u.id,
        u.nom_utilisateur,
        u.photo_profil,
        u.role,
        u.city,
        u.country,
        u.genres_musicaux,
        u.biography,
        pa.instruments_pratiques,
        (
          SELECT COUNT(*) 
          FROM tracks t 
          WHERE t.user_id = u.id
        ) as tracks_count
      FROM users u
      LEFT JOIN profil_artiste pa ON u.id = pa.user_id
      WHERE u.role IN ('musicien', 'chanteur')
      AND u.id != ?
    `;

    const queryParams: SqlParams = [userId];

    if (filters.role) {
      query += ' AND u.role = ?';
      queryParams.push(filters.role);
    }

    if (filters.genres) {
      query += ' AND u.genres_musicaux LIKE ?';
      queryParams.push(`%${filters.genres}%`);
    }

    if (filters.city) {
      query += ' AND u.city LIKE ?';
      queryParams.push(`%${filters.city}%`);
    }

    if (filters.country) {
      query += ' AND u.country LIKE ?';
      queryParams.push(`%${filters.country}%`);
    }

    if (filters.instruments) {
      query += ' AND pa.instruments_pratiques LIKE ?';
      queryParams.push(`%${filters.instruments}%`);
    }

    // Ajouter le comptage total
    const [countRows] = await req.app.locals.pool.execute(
      `SELECT COUNT(*) as total FROM (${query}) as subquery`,
      queryParams
    );
    const total = (countRows as { total: number }[])[0].total;

    // Ajouter la pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await req.app.locals.pool.execute(query, queryParams);

    res.json({
      artists: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche des artistes' });
  }
};

router.get('/', auth, searchArtists);

export default router;
