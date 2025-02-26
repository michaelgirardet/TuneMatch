import type { Request, Response } from 'express';
import type { Pool } from 'mysql2/promise';

export class UserController {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  createUser = async (req: Request, res: Response) => {
    try {
      const { nom_utilisateur, email } = req.body;
      const [result] = await this.pool.execute(
        'INSERT INTO Utilisateur (nom_utilisateur, email) VALUES (?, ?)',
        [nom_utilisateur, email]
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
  };

  getUsers = async (_req: Request, res: Response) => {
    try {
      const [users] = await this.pool.execute('SELECT * FROM Utilisateur');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
  };
} 