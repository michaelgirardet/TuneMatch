import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  try {
    // Première connexion sans spécifier de base de données
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Lecture du fichier SQL
    const sqlFile = path.join(__dirname, 'init.sql');
    const sqlQueries = fs.readFileSync(sqlFile, 'utf8');

    // Exécution des requêtes SQL
    const queries = sqlQueries.split(';').filter((query) => query.trim());
    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
      }
    }

    console.log('Base de données initialisée avec succès !');
    await connection.end();
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    process.exit(1);
  }
}

initDatabase();
