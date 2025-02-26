import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validation';
import { ZodError } from 'zod';
import { pool } from '../database/connection';
import { EmailService } from '../services/email.service';

export class AuthController {
  private authService = new AuthService(pool);
  private emailService = new EmailService();

  async register(req: Request, res: Response) {
    try {
      console.log('Données reçues:', req.body); // Pour débugger

      // Validation des données
      const validatedData = registerSchema.parse(req.body);

      // Inscription de l'utilisateur
      const user = await this.authService.register(validatedData);

      res.status(201).json({
        message: 'Inscription réussie',
        user: {
          nom_utilisateur: user.nom_utilisateur,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Erreur:', error); // Pour débugger

      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors,
        });
      }

      res.status(400).json({
        error: "Erreur lors de l'inscription",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, mot_de_passe } = loginSchema.parse(req.body);

      const result = await this.authService.login(email, mot_de_passe);

      res.status(200).json({
        message: 'Connexion réussie',
        ...result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors,
        });
      }

      res.status(401).json({
        error: "Échec de l'authentification",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const resetToken = await this.authService.createPasswordResetToken(email);
      
      if (resetToken) {
        await this.emailService.sendPasswordResetEmail(email, resetToken);
        res.status(200).json({
          message: 'Un email de réinitialisation a été envoyé si cette adresse existe dans notre base de données.'
        });
      } else {
        // On renvoie le même message même si l'email n'existe pas pour des raisons de sécurité
        res.status(200).json({
          message: 'Un email de réinitialisation a été envoyé si cette adresse existe dans notre base de données.'
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Email invalide',
          details: error.errors,
        });
      }
      res.status(500).json({
        error: 'Erreur lors de la demande de réinitialisation',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, email, newPassword } = resetPasswordSchema.parse(req.body);
      await this.authService.resetPassword(email, token, newPassword);
      
      res.status(200).json({
        message: 'Mot de passe réinitialisé avec succès'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Données invalides',
          details: error.errors,
        });
      }
      res.status(400).json({
        error: 'Erreur lors de la réinitialisation du mot de passe',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }
}
