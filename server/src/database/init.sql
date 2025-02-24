DROP DATABASE IF EXISTS launchify;
CREATE DATABASE launchify;

USE launchify;

-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données d'exemple
INSERT INTO users (name, email) VALUES
  ('Jean Dupont', 'jean@example.com'),
  ('Marie Martin', 'marie@example.com'),
  ('Pierre Durant', 'pierre@example.com'); 