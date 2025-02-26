import type { Request, Response } from 'express';

export const testController = {
  getTest: async (_req: Request, res: Response) => {
    try {
      res.json({ message: "L'API fonctionne correctement !" });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
      console.error(error);
    }
  },
};
