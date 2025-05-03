import express from 'express';
import { auth } from '../middleware/auth';
import { z } from 'zod';
import type { AuthRequest } from '../types/auth.types';
import type { RequestHandler } from 'express';
import { DatabaseService } from '../services/database';
import { pool } from '../database/connection';

const router = express.Router();
const db = new DatabaseService(pool);

const searchSchema = z.object({
  role: z.enum(['musicien', 'chanteur', 'producteur']).optional(),
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
  role?: 'artiste' | 'producteur';
  genres?: string;
  city?: string;
  country?: string;
  instruments?: string;
  page?: string;
  limit?: string;
}

interface Artist {
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

interface ErrorResponse {
  error: string;
  details?: string;
}

type SqlParams = (string | number)[];

type AuthRequestHandler = RequestHandler<
  Record<string, never>,
  SearchResponse | ErrorResponse,
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

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const offset = Number((page - 1) * limit);

    let baseQuery = `
      SELECT 
        u.id as id,
        u.nom_utilisateur,
        u.photo_profil,
        u.role,
        u.city,
        u.country,
        u.genres_musicaux,
        u.biography,
        pa.instruments_pratiques,
        COALESCE(
          (
            SELECT COUNT(*) 
            FROM tracks t 
            WHERE t.user_id = u.id
          ), 0
        ) as tracks_count
      FROM users u
      LEFT JOIN profil_artiste pa ON u.id = pa.user_id
      WHERE u.id != ?
    `;

    const baseParams: SqlParams = [userId];

    if (filters.role) {
      baseQuery += ' AND u.role = ?';
      baseParams.push(filters.role);
    }

    if (filters.genres) {
      baseQuery += ' AND u.genres_musicaux LIKE ?';
      baseParams.push(`%${filters.genres}%`);
    }

    if (filters.city) {
      baseQuery += ' AND u.city LIKE ?';
      baseParams.push(`%${filters.city}%`);
    }

    if (filters.country) {
      baseQuery += ' AND u.country LIKE ?';
      baseParams.push(`%${filters.country}%`);
    }

    if (filters.instruments) {
      baseQuery += ' AND pa.instruments_pratiques LIKE ?';
      baseParams.push(`%${filters.instruments}%`);
    }

    // Faire la requête de comptage
    const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) as subquery`;

    const countRows = await db.query<{ total: number }>(countQuery, baseParams);
    const total = countRows[0]?.total || 0;

    // Requête principale avec pagination
    const mainQuery = `${baseQuery} ORDER BY u.id LIMIT ${limit} OFFSET ${offset}`;

    const rows = await db.query<Artist>(mainQuery, baseParams);

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
    console.error('Erreur détaillée lors de la recherche:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    res.status(500).json({
      error: 'Erreur lors de la recherche des artistes',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

router.get('/', auth, searchArtists);
console.log('Route de recherche enregistrée');

export default router;
