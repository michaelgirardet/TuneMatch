import type { Request, Response } from 'express';
import type { Pool } from 'mysql2/promise';
import type { User } from '../types';

export class UserController {
  constructor(private pool: Pool) {}

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email }: User = req.body;

      const [result] = await this.pool.execute('INSERT INTO users (name, email) VALUES (?, ?)', [
        name,
        email,
      ]);

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: { name, email },
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        error,
      });
    }
  };

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const [users] = await this.pool.query('SELECT * FROM users');
      res.json(users);
    } catch (error) {
      res.status(500).json({
        message: 'Erreur lors de la récupération des utilisateurs',
        error,
      });
    }
  };
}
