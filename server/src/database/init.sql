DROP DATABASE IF EXISTS tunematch;
CREATE DATABASE tunematch;

USE tunematch;

-- Création de la table users
-- Modèle Conceptuel de Données (MCD)
-- Entités et relations principales

-- TABLE Utilisateur (Artiste ou Producteur)
CREATE TABLE Utilisateur (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT,
    nom_utilisateur VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('artiste', 'producteur') NOT NULL,
    photo_profil VARCHAR(255),
    biographie TEXT,
    localisation VARCHAR(100),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL
);

-- TABLE Profil Artiste (Spécifique aux artistes)
CREATE TABLE ProfilArtiste (
    id_artiste INT PRIMARY KEY,
    id_utilisateur INT UNIQUE NOT NULL,
    genre_musical VARCHAR(100),
    instruments_pratiques VARCHAR(255),
    reseaux_sociaux TEXT,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- TABLE Profil Producteur (Spécifique aux producteurs)
CREATE TABLE ProfilProducteur (
    id_producteur INT PRIMARY KEY,
    id_utilisateur INT UNIQUE NOT NULL,
    style_recherche VARCHAR(100),
    label_studio VARCHAR(255),
    projets_en_cours TEXT,
    liens_professionnels TEXT,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);

-- TABLE Morceaux (Liens vers les musiques des artistes)
CREATE TABLE Morceaux (
    id_morceau INT PRIMARY KEY AUTO_INCREMENT,
    id_artiste INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    lien_musique VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_artiste) REFERENCES ProfilArtiste(id_artiste) ON DELETE CASCADE
);

-- TABLE Matchs (Mise en relation entre Artistes et Producteurs)
CREATE TABLE Matchs (
    id_match INT PRIMARY KEY AUTO_INCREMENT,
    id_artiste INT NOT NULL,
    id_producteur INT NOT NULL,
    statut ENUM('en attente', 'accepté', 'rejeté') DEFAULT 'en attente',
    date_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_artiste) REFERENCES ProfilArtiste(id_artiste) ON DELETE CASCADE,
    FOREIGN KEY (id_producteur) REFERENCES ProfilProducteur(id_producteur) ON DELETE CASCADE
);

-- TABLE Messages (Messagerie entre utilisateurs)
CREATE TABLE Messages (
    id_message INT PRIMARY KEY AUTO_INCREMENT,
    id_expediteur INT NOT NULL,
    id_destinataire INT NOT NULL,
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_expediteur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_destinataire) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);


-- Insertion de données d'exemple pour la table Utilisateur
INSERT INTO Utilisateur (nom_utilisateur, email, mot_de_passe, role, photo_profil, biographie, localisation, date_inscription) VALUES
  ('JohnD999', 'johndoe@example.com', '123456', 'artiste', 'http://photo-de-profil.fr/johndoe.jpg', 'Passionné de musique électronique', 'Barcelone', NOW()),
  ('Marie Martin', 'marie@example.com', 'abcdef', 'producteur', 'http://photo-de-profil.fr/marie.jpg', 'Productrice de hip-hop', 'Paris', NOW()),
  ('Pierre Durant', 'pierre@example.com', 'xyz789', 'artiste', 'http://photo-de-profil.fr/pierre.jpg', 'Guitariste et auteur-compositeur', 'Lyon', NOW());

-- Insertion de données pour les artistes (associés aux utilisateurs)
INSERT INTO ProfilArtiste (id_artiste, id_utilisateur, genre_musical, instruments_pratiques, reseaux_sociaux) VALUES
  (1, 1, 'Électro', 'Synthétiseur, DJ', 'https://instagram.com/johnd999'),
  (2, 3, 'Rock', 'Guitare, Chant', 'https://facebook.com/pierredurantmusic');

-- Insertion de données pour les producteurs (associés aux utilisateurs)
INSERT INTO ProfilProducteur (id_producteur, id_utilisateur, style_recherche, label_studio, projets_en_cours, liens_professionnels) VALUES
  (1, 2, 'Hip-Hop, Trap', 'Paris Sound Studio', 'Recrute des talents émergents', 'https://linkedin.com/in/mariemartin');

-- Insertion de morceaux pour les artistes
INSERT INTO Morceaux (id_artiste, titre, lien_musique) VALUES
  (1, 'Electro Vibes', 'https://soundcloud.com/johnd999/electro-vibes'),
  (2, 'Rock Anthem', 'https://youtube.com/pierredurant/rock-anthem');

-- Insertion d'une mise en relation (Matchs)
INSERT INTO Matchs (id_artiste, id_producteur, statut) VALUES
  (1, 1, 'en attente'),
  (2, 1, 'accepté');

-- Insertion de messages entre utilisateurs
INSERT INTO Messages (id_expediteur, id_destinataire, contenu) VALUES
  (1, 2, 'Salut Marie, intéressée par un featuring électro ?'),
  (2, 1, 'Salut John, j\'aime ton style ! On peut en discuter.');