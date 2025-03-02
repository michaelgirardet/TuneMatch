import type { Request, Response } from 'express';
import type { Pool } from 'mysql2/promise';

export class TestController {
  constructor(private pool: Pool) {}

  public getTest = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.pool.getConnection();
      res.json({ message: 'Connexion réussie avec le serveur et la base de données!' });
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            '🔐 Connexion impossible ! Vérifie tes identifiants et réessaie. à la base de données',
          error,
        });
    }
  };
}
