// controllers/auth.controller.ts
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation';
import { sendResetPasswordEmail } from '../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'tunematch_secret_key_2024';
const TOKEN_EXPIRATION = '24h';

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

      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Données invalides', details: error.errors });
      }
      console.error('Erreur login:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
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
      const { token } = req.body;
      if (!token) return res.status(401).json({ message: 'Token manquant' });

      const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as {
        userId: number;
        email: string;
        role: string;
      };

      const [rows] = await req.app.locals.pool.execute(
        'SELECT id, email, role FROM users WHERE id = ?',
        [decoded.userId]
      );
      interface User {
        id: number;
        email: string;
        role: string;
      }
      const users = rows as User[];
      if (users.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });

      const newToken = jwt.sign(
        { userId: users[0].id, email: users[0].email, role: users[0].role },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.json({ token: newToken });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Token invalide' });
      }
      console.error('Erreur refreshToken:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}
