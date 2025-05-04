import compression from 'compression';
import type { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const configureSecurityMiddleware = (app: Express) => {
  // Protection contre les vulnérabilités web courantes
  app.use(helmet());

  // Limite le nombre de requêtes par IP
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
  });
  app.use('/api/', limiter);

  // Compression des réponses
  app.use(compression());

  // Désactive l'en-tête X-Powered-By
  app.disable('x-powered-by');
};
