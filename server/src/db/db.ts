import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Afficher les informations de configuration (sans le mot de passe)
console.log('Configuration de la base de données:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  hasPassword: !!process.env.DB_PASSWORD
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tunematch',
});

// Tester la connexion
pool.getConnection()
  .then(connection => {
    console.log('Connexion à la base de données établie avec succès');
    connection.release();
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
  });

export { pool }; 