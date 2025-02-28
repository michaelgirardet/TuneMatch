import type { Request, Response } from 'express';
import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import jwt from 'jsonwebtoken';

const router = express.Router();
const authController = new AuthController();
const JWT_SECRET = process.env.JWT_SECRET || 'tunematch_secret_key_2024';
const TOKEN_EXPIRATION = '24h';

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    try {
      // Vérifier le token même s'il est expiré
      const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as {
        userId: number;
        email: string;
        role: string;
      };

      // Récupérer les informations de l'utilisateur
      const [rows] = await req.app.locals.pool.execute(
        'SELECT id_utilisateur, email, role FROM Utilisateur WHERE id_utilisateur = ?',
        [decoded.userId]
      );

      const users = rows as { id_utilisateur: number; email: string; role: string }[];
      if (users.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const user = users[0];

      // Générer un nouveau token
      const newToken = jwt.sign(
        {
          userId: user.id_utilisateur,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.json({ token: newToken });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Token invalide' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

router.post('/refresh', refreshToken);

export default router;
