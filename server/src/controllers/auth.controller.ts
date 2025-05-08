import bcrypt from 'bcrypt';
// controllers/auth.controller.ts
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { sendResetPasswordEmail } from '../utils/email';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../utils/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'tunematch_secret_key_2024';
const TOKEN_EXPIRATION = '15m';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { nom_utilisateur, email, password, role } = registerSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(password, 10);

      const [existingUsers] = await req.app.locals.pool.execute(
        'SELECT id FROM users WHERE email = ? OR nom_utilisateur = ?',
        [email, nom_utilisateur]
      );
      if ((existingUsers as { id: number }[]).length > 0) {
        return res.status(409).json({ message: 'Utilisateur déjà existant' });
      }

      const [result] = await req.app.locals.pool.execute(
        'INSERT INTO users (nom_utilisateur, email, password, role) VALUES (?, ?, ?, ?)',
        [nom_utilisateur, email, hashedPassword, role]
      );

      interface InsertResult {
        insertId: number;
      }
      const userId = (result as InsertResult).insertId;
      const token = jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        token,
        user: { id: userId, nom_utilisateur, email, role },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur inscription:', error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const [rows] = await req.app.locals.pool.execute('SELECT * FROM users WHERE email = ?', [
        email,
      ]);

      interface User {
        id: number;
        email: string;
        password: string;
        role: string;
      }
      const users = rows as User[];
      if (users.length === 0) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer access token (15 min)
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      // Générer refresh token (30 jours)
      const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

      // (Optionnel mais recommandé) Stocker le refreshToken en base pour pouvoir l'invalider plus tard
      await req.app.locals.pool.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [
        refreshToken,
        user.id,
      ]);

      // Supprimer le mot de passe avant de renvoyer l'utilisateur
      const { password: _, ...userWithoutPassword } = user;

      // Envoyer le refresh token dans un cookie httpOnly sécurisé
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // OBLIGATOIRE EN LOCAL
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // Envoyer access token et infos utilisateur dans la réponse JSON
      res.json({ accessToken, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur login:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // Récupère le refresh token depuis le cookie
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        return res.status(200).clearCookie('refreshToken').json({ message: 'Déjà déconnecté.' });

      // Décoder le refresh token pour trouver l'utilisateur
      let decoded: { userId: number } | null;
      try {
        const result = jwt.verify(refreshToken, JWT_SECRET);
        decoded =
          typeof result === 'object' && result !== null && 'userId' in result
            ? (result as { userId: number })
            : null;
      } catch {
        return res
          .status(200)
          .clearCookie('refreshToken')
          .json({ message: 'Token déjà invalide.' });
      }

      // Supprime le refresh token en base
      await req.app.locals.pool.execute('UPDATE users SET refresh_token = NULL WHERE id = ?', [
        decoded?.userId ??
          (() => {
            throw new Error('Decoded token is null');
          })(),
      ]);

      // Supprime le cookie côté client
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.json({ message: 'Déconnexion réussie.' });
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
      console.error(err);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const [rows] = await req.app.locals.pool.execute('SELECT id FROM users WHERE email = ?', [
        email,
      ]);
      interface User {
        id: number;
        reset_token: string | null;
        reset_token_expires: Date | null;
      }
      const users = rows as User[];
      if (users.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });

      const resetToken = jwt.sign({ userId: users[0].id }, JWT_SECRET, { expiresIn: '1h' });
      const tokenExpires = new Date(Date.now() + 3600000);
      await req.app.locals.pool.execute(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
        [resetToken, tokenExpires, users[0].id]
      );

      await sendResetPasswordEmail(email, resetToken);
      res.json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur forgotPassword:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, email, newPassword } = resetPasswordSchema.parse(req.body);
      const [rows] = await req.app.locals.pool.execute(
        'SELECT id, reset_token, reset_token_expires FROM users WHERE email = ?',
        [email]
      );
      interface User {
        id: number;
        email: string;
        role: string;
        reset_token: string | null;
        reset_token_expires: Date | null;
      }
      const users = rows as User[];
      if (users.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });

      const user = users[0];
      if (
        user.reset_token !== token ||
        !user.reset_token_expires ||
        new Date() > new Date(user.reset_token_expires)
      ) {
        return res.status(400).json({ message: 'Token invalide ou expiré' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await req.app.locals.pool.execute(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [hashedPassword, user.id]
      );

      res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur resetPassword:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token manquant' });
      }

      // Vérifie le refresh token
      let decoded: { userId: number } | null;
      try {
        const result = jwt.verify(refreshToken, JWT_SECRET);
        decoded =
          typeof result === 'object' && result !== null && 'userId' in result
            ? (result as { userId: number })
            : null;
      } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Refresh token invalide ou expiré' });
      }

      // Vérifie que le refresh token correspond à celui stocké en base
      const [rows] = await req.app.locals.pool.execute(
        'SELECT id, email, role, refresh_token FROM users WHERE id = ?',
        [decoded?.userId]
      );
      interface User {
        id: number;
        email: string;
        role: string;
        refresh_token: string | null;
      }
      const users = rows as User[];
      if (users.length === 0 || users[0].refresh_token !== refreshToken) {
        return res.status(401).json({ message: 'Refresh token non reconnu' });
      }

      // Génère un nouveau access token
      const newAccessToken = jwt.sign(
        { userId: users[0].id, email: users[0].email, role: users[0].role },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      // (Optionnel) Rotation du refresh token :
      // const newRefreshToken = jwt.sign({ userId: users[0].id }, JWT_SECRET, { expiresIn: '30d' });
      // await req.app.locals.pool.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, users[0].id]);
      // res.cookie('refreshToken', newRefreshToken, { ... });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Erreur refreshToken:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}
