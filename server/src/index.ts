import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import application from './app';
import type { DatabaseConfig } from './types';

dotenv.config();

// Configuration de la base de données
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tunematch',
};

const pool: Pool = mysql.createPool(dbConfig);
application.locals.pool = pool;

const PORT: number = Number.parseInt(process.env.PORT || '5001', 10);

// Démarrage du serveur
application.listen(PORT, () => {
  console.log(`Serveur TypeScript démarré sur le port ${PORT}`);
});
