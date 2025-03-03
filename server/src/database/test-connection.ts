import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tunematch',
    });

    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données réussie');

    // Test de la requête de recherche
    const [rows] = await connection.execute(`
      SELECT COUNT(*) as total 
      FROM users 
      WHERE role IN ('musicien', 'chanteur')
    `);
    console.log('✅ Requête de recherche testée avec succès');
    console.log('Nombre total d\'artistes:', (rows as any[])[0].total);

    await connection.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
  }
}

testConnection(); 