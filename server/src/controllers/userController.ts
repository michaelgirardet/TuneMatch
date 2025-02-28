import type { Request, Response } from 'express';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import bcrypt from 'bcrypt';

export class UserController {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  createUser = async (req: Request, res: Response) => {
    try {
      const { nom_utilisateur, email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const [existingUsers] = await this.pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer le nouvel utilisateur
      const [result] = await this.pool.execute<ResultSetHeader>(
        `INSERT INTO users (nom_utilisateur, email, password, role, created_at, updated_at) 
         VALUES (?, ?, ?, 'user', NOW(), NOW())`,
        [nom_utilisateur, email, hashedPassword]
      );

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: result.insertId,
          nom_utilisateur,
          email,
          role: 'user'
        }
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
  };

  getUsers = async (_req: Request, res: Response) => {
    try {
      const [users] = await this.pool.execute(
        'SELECT id, nom_utilisateur, email, role, photo_profil, biography, genres_musicaux, created_at, updated_at FROM users'
      );
      res.json(users);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
  };
}
