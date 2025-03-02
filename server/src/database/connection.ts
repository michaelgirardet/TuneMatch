import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Ajout d'un test de connexion
const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Connexion à la base de données réussie');
  } catch (error) {
    console.error(
      '🔐 Connexion impossible ! Vérifie tes identifiants et réessaie. à la base de données:',
      error
    );
  }
};

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

testConnection();
