import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import notificationRoutes from './routes/notifications.routes';
import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import tracksRoutes from './routes/tracks.routes';
import userRoutes from './routes/user.routes';
import discoverRoutes from './routes/discover.routes';
import reviewRoutes from './routes/review.routes';

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Configuration CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Lire les cookies
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tracks', tracksRoutes);
app.use('/api/applications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/reviews', reviewRoutes);

// Route de test
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Middleware pour logger les requêtes
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Gestion des erreurs
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: '❌ Oups ! Un problème est survenu. Essaie à nouveau. sur le serveur' });
});

export default app;
