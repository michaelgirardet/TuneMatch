import type { NextFunction, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, AuthUser } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'tunematch_secret_key_2024';

export const auth: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("En-tête d'autorisation reçu:", authHeader);

    if (!authHeader) {
      console.log("Aucun en-tête d'autorisation trouvé");
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extrait:', `${token?.substring(0, 20)}...`);

    if (!token) {
      console.log("Token non trouvé dans l'en-tête");
      return res.status(401).json({ message: 'Token invalide' });
    }

    try {
      // Décodage du token sans vérification pour voir son contenu
      const decodedWithoutVerification = jwt.decode(token);
      console.log('Contenu du token sans vérification:', decodedWithoutVerification);

      console.log('Secret JWT utilisé pour la vérification:', JWT_SECRET);
      console.log(
        'Tentative de vérification du token avec le secret:',
        `${JWT_SECRET.substring(0, 10)}...`
      );

      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

      // Vérifier que le userId est présent
      if (!decoded.userId) {
        console.log('Token invalide: userId manquant');
        return res.status(401).json({
          message: 'Token invalide: userId manquant',
          clearToken: true,
        });
      }

      console.log('Token décodé avec succès:', {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'non défini',
      });

      // Vérification de l'expiration avec une marge de 5 minutes
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp - currentTime < 300) {
          // 300 secondes = 5 minutes
          console.log("Token proche de l'expiration, rafraîchissement nécessaire");
          return res.status(401).json({
            message: 'Token expiré',
            needsRefresh: true,
          });
        }
      }

      // Récupérer nom_utilisateur depuis la DB
      const [rows] = await req.app.locals.pool.execute(
        'SELECT nom_utilisateur FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (!rows[0]) {
        console.log('Utilisateur non trouvé dans la base');
        return res.status(401).json({ message: 'Utilisateur introuvable' });
      }

      req.user = {
        ...decoded,
        nom_utilisateur: rows[0].nom_utilisateur,
      };

      
      next();
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          message: 'Token expiré',
          needsRefresh: true,
        });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          message: 'Token invalide',
          error: error.message,
          clearToken: true, // Indique au client qu'il doit supprimer le token
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Erreur dans le middleware d'authentification:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      'email' in decoded &&
      'role' in decoded
    ) {
      req.user = decoded as AuthUser;
      next();
    } else {
      return res.status(403).json({ message: 'Token invalide: données manquantes' });
    }
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: 'Token invalide' });
  }
};
