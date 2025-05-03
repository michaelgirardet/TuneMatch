import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tracksRoutes from './routes/tracks.routes';
import searchRoutes from './routes/search.routes';
import applicationRoutes from './routes/application.routes';
import messageRoutes from './routes/message.routes';
import announcementRoutes from './routes/announcement.routes';
import completeProfileRoutes from './routes/completeProfile.routes';

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

console.log('Enregistrement des routes...');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tracks', tracksRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/com', completeProfileRoutes);

console.log('Routes enregistrées');

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
