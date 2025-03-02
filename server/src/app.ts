import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tracksRoutes from './routes/tracks.routes';

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tracks', tracksRoutes);

// Route de test
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Gestion des erreurs
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: '❌ Oups ! Un problème est survenu. Essaie à nouveau. sur le serveur' });
});

export default app;
