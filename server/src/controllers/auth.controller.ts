import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validation';
import { ZodError } from 'zod';
import { sendResetPasswordEmail } from '../utils/email';

const JWT_SECRET = process.env.JWT_SECRET || 'tunematch_secret_key_2024';
const TOKEN_EXPIRATION = '24h';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { nom_utilisateur, email, mot_de_passe, role } = registerSchema.parse(req.body);

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      // Vérifier si l'email existe déjà
      const [existingUsers] = await req.app.locals.pool.execute(
        'SELECT * FROM Utilisateur WHERE email = ?',
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Insérer le nouvel utilisateur
      const [result] = await req.app.locals.pool.execute(
        'INSERT INTO Utilisateur (nom_utilisateur, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
        [nom_utilisateur, email, hashedPassword, role]
      );

      const userId = (result as any).insertId;

      // Générer le token JWT
      const token = jwt.sign(
        { userId, email, role },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        token,
        user: {
          id_utilisateur: userId,
          nom_utilisateur,
          email,
          role
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors
        });
      }
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, mot_de_passe } = loginSchema.parse(req.body);

      // Rechercher l'utilisateur
      const [rows] = await req.app.locals.pool.execute(
        'SELECT * FROM Utilisateur WHERE email = ?',
        [email]
      );

      const users = rows as any[];
      if (users.length === 0) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const user = users[0];

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      if (!validPassword) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign(
        {
          userId: user.id_utilisateur,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      res.json({
        token,
        user: {
          id_utilisateur: user.id_utilisateur,
          nom_utilisateur: user.nom_utilisateur,
          email: user.email,
          role: user.role,
          photo_profil: user.photo_profil
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors
        });
      }
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);

      // Vérifier si l'utilisateur existe
      const [rows] = await req.app.locals.pool.execute(
        'SELECT id_utilisateur FROM Utilisateur WHERE email = ?',
        [email]
      );

      const users = rows as any[];
      if (users.length === 0) {
        return res.status(404).json({ message: 'Aucun compte associé à cet email' });
      }

      const user = users[0];

      // Générer un token de réinitialisation
      const resetToken = jwt.sign(
        { userId: user.id_utilisateur },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Stocker le token et sa date d'expiration
      const tokenExpires = new Date(Date.now() + 3600000); // 1 heure
      await req.app.locals.pool.execute(
        'UPDATE Utilisateur SET reset_token = ?, reset_token_expires = ? WHERE id_utilisateur = ?',
        [resetToken, tokenExpires, user.id_utilisateur]
      );

      // Envoyer l'email
      await sendResetPasswordEmail(email, resetToken);

      res.json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors
        });
      }
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, email, newPassword } = resetPasswordSchema.parse(req.body);

      // Vérifier si l'utilisateur existe et si le token est valide
      const [rows] = await req.app.locals.pool.execute(
        'SELECT id_utilisateur, reset_token, reset_token_expires FROM Utilisateur WHERE email = ?',
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
        'UPDATE Utilisateur SET mot_de_passe = ?, reset_token = NULL, reset_token_expires = NULL WHERE id_utilisateur = ?',
        [hashedPassword, user.id_utilisateur]
      );

      res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors
        });
      }
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  }
}
