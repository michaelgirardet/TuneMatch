import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation';
import { ZodError } from 'zod';
import { sendResetPasswordEmail } from '../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'tunematch_secret_key_2024';
const TOKEN_EXPIRATION = '24h';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { nom_utilisateur, email, password, role } = registerSchema.parse(req.body);

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Vérifier si l'email existe déjà
      const [existingUsers] = await req.app.locals.pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Insérer le nouvel utilisateur
      const [result] = await req.app.locals.pool.execute(
        'INSERT INTO users (nom_utilisateur, email, password, role) VALUES (?, ?, ?, ?)',
        [nom_utilisateur, email, hashedPassword, role]
      );

      const userId = (result as any).insertId;
      console.log('Nouvel utilisateur créé avec ID:', userId);

      // Générer le token JWT
      const token = jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        token,
        user: {
          id: userId,
          nom_utilisateur,
          email,
          role,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors,
        });
      }
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      console.log('Tentative de connexion pour:', email);

      // Rechercher l'utilisateur avec toutes ses informations
      const [rows] = await req.app.locals.pool.execute(
        `SELECT id, nom_utilisateur, email, password, role, photo_profil, biography, 
         genres_musicaux, youtube_link, instagram_link, soundcloud_link, city, country 
         FROM users WHERE email = ?`,
        [email]
      );

      const users = rows as any[];
      if (users.length === 0) {
        console.log('Utilisateur non trouvé:', email);
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const user = users[0];
      console.log('Utilisateur trouvé:', { id: user.id, email: user.email, role: user.role });

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log('Mot de passe invalide pour:', email);
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      console.log('Token généré pour:', email);

      // Supprimer le mot de passe des informations renvoyées
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors,
        });
      }
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      // Vérifier si l'utilisateur existe
      const [rows] = await req.app.locals.pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      const users = rows as any[];
      if (users.length === 0) {
        return res.status(404).json({ message: 'Aucun compte associé à cet email' });
      }

      const user = users[0];

      // Générer un token de réinitialisation
      const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

      // Stocker le token et sa date d'expiration
      const tokenExpires = new Date(Date.now() + 3600000); // 1 heure
      await req.app.locals.pool.execute(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
        [resetToken, tokenExpires, user.id]
      );

      // Envoyer l'email
      await sendResetPasswordEmail(email, resetToken);

      res.json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors,
        });
      }
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      res.status(500).json({ message: "Erreur lors de l'envoi de l'email de réinitialisation" });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, email, newPassword } = resetPasswordSchema.parse(req.body);

      // Vérifier si l'utilisateur existe et si le token est valide
      const [rows] = await req.app.locals.pool.execute(
        'SELECT id, reset_token, reset_token_expires FROM users WHERE email = ?',
        [email]
      );

      const users = rows as any[];
      if (users.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const user = users[0];

      if (!user.reset_token || user.reset_token !== token) {
        return res.status(400).json({ message: 'Token invalide' });
      }

      if (new Date() > new Date(user.reset_token_expires)) {
        return res.status(400).json({ message: 'Token expiré' });
      }

      // Hash du nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe et réinitialiser le token
      await req.app.locals.pool.execute(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [hashedPassword, user.id]
      );

      res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors,
        });
      }
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  }
}
