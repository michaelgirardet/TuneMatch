import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Afficher les informations de configuration (sans le mot de passe)
console.log('Configuration de la base de données:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  hasPassword: !!process.env.DB_PASSWORD,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Tester la connexion
pool
  .getConnection()
  .then((connection) => {
    console.log('Connexion à la base de données établie avec succès');
    connection.release();
  })
  .catch((err) => {
    console.error(
      '🔐 Connexion impossible ! Vérifie tes identifiants et réessaie. à la base de données:',
      err
    );
  });

export { pool };
