import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthUser extends JwtPayload {
  userId: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export type AuthRequest = Request; 