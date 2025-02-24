import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import type { DatabaseConfig } from './types';
import { UserController } from './controllers/userController';
import testRoutes from './routes/test.routes';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

// Configuration de la base de données
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mon_projet',
};

const pool: Pool = mysql.createPool(dbConfig);

// Initialisation des contrôleurs
const userController = new UserController(pool);

// Routes
app.post('/api/users', userController.createUser);
app.get('/api/users', userController.getUsers);
app.use('/api', testRoutes);

const PORT: number = Number.parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`Serveur TypeScript démarré sur le port ${PORT}`);
});
