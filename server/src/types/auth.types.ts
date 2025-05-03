import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export interface AuthUser extends JwtPayload {
  userId: number;
  email: string;
  role: string;
  nom_utilisateur: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export type AuthRequest = Request;
