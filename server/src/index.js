const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Configuration de la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mon_projet',
});

// Example query to test database connection
pool.query('SELECT 1 + 1 AS solution', (error, results) => {
  if (error) {
    console.error('Database connection failed:', error);
  } else {
    console.log('Database connected successfully. Test query result:', results[0].solution);
  }
});

// Route de test
app.get('/api/test', (_req, res) => {
  res.json({ message: 'Connexion réussie avec le serveur!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
