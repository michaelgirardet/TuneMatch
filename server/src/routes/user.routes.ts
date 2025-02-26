import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { JwtPayload } from 'jsonwebtoken';

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

router.put('/photo', auth, updatePhoto);

export default router;
