DROP DATABASE IF EXISTS tunematch;
CREATE DATABASE tunematch;

USE tunematch;

-- Création de la table users
-- Modèle Conceptuel de Données (MCD)
-- Entités et relations principales

-- TABLE Users (table principale)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom_utilisateur VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('musicien', 'chanteur', 'producteur') NOT NULL,
    photo_profil VARCHAR(255),
    biography TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    youtube_link VARCHAR(255),
    instagram_link VARCHAR(255),
    soundcloud_link VARCHAR(255),
    genres_musicaux VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABLE Tracks (dépend de users)
CREATE TABLE tracks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE Annonces (dépend de users)
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    musical_style VARCHAR(255) NOT NULL,
    voice_type VARCHAR(255),
    instrument VARCHAR(255),
    other_criteria TEXT,
    user_id INT NOT NULL,
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE Profil Artiste (dépend de users)
CREATE TABLE profil_artiste (
    id_artiste INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    genre_musical VARCHAR(100),
    instruments_pratiques VARCHAR(255),
    reseaux_sociaux TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE Profil Producteur (dépend de users)
CREATE TABLE profil_producteur (
    id_producteur INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    style_recherche VARCHAR(100),
    label_studio VARCHAR(255),
    projets_en_cours TEXT,
    liens_professionnels TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE Matchs (dépend de profil_artiste et profil_producteur)
CREATE TABLE matchs (
    id_match INT PRIMARY KEY AUTO_INCREMENT,
    id_artiste INT NOT NULL,
    id_producteur INT NOT NULL,
    statut ENUM('en attente', 'accepté', 'rejeté') DEFAULT 'en attente',
    date_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_artiste) REFERENCES profil_artiste(id_artiste) ON DELETE CASCADE,
    FOREIGN KEY (id_producteur) REFERENCES profil_producteur(id_producteur) ON DELETE CASCADE
);

-- TABLE Messages (dépend de users)
CREATE TABLE messages (
    id_message INT PRIMARY KEY AUTO_INCREMENT,
    id_expediteur INT NOT NULL,
    id_destinataire INT NOT NULL,
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_expediteur) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_destinataire) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLE Applications (candidatures aux annonces)
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    announcement_id INT NOT NULL,
    artist_id INT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    selected_tracks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (announcement_id, artist_id)
);

-- TABLE Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('application_status', 'message', 'match') NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Données de test (dans l'ordre des dépendances)
INSERT INTO users (nom_utilisateur, email, password, role, photo_profil, biography, city, country) VALUES
('JohnD999', 'johndoe@example.com', '$2b$10$test', 'musicien', 'https://avatar.iran.liara.run/public/boy', 'Passionné de musique électronique', 'Paris', 'France'),
('Marie Martin', 'marie@example.com', '$2b$10$test', 'producteur', 'https://avatar.iran.liara.run/public/girl', 'Productrice de hip-hop', 'Lyon', 'France'),
('Pierre Durant', 'pierre@example.com', '$2b$10$test', 'chanteur', 'https://avatar.iran.liara.run/public/girl', 'Guitariste et auteur-compositeur', 'Marseille', 'France');

INSERT INTO tracks (title, artist, url, user_id) VALUES
('Electro Vibes', 'JohnD999', 'https://soundcloud.com/johnd999/electro-vibes', 1),
('Rock Anthem', 'Pierre Durant', 'https://youtube.com/pierredurant/rock-anthem', 3);

INSERT INTO profil_artiste (user_id, genre_musical, instruments_pratiques, reseaux_sociaux) VALUES
(1, 'Électro', 'Synthétiseur, DJ', 'https://instagram.com/johnd999'),
(3, 'Rock', 'Guitare, Chant', 'https://facebook.com/pierredurantmusic');

INSERT INTO profil_producteur (user_id, style_recherche, label_studio, projets_en_cours, liens_professionnels) VALUES
(2, 'Hip-Hop, Trap', 'Paris Sound Studio', 'Recrute des talents émergents', 'https://linkedin.com/in/mariemartin');

INSERT INTO matchs (id_artiste, id_producteur) VALUES
(1, 1),
(2, 1);

INSERT INTO messages (id_expediteur, id_destinataire, contenu) VALUES
(1, 2, 'Salut Marie, intéressée par un featuring électro ?'),
(2, 1, "Salut John, j\'aime ton style ! On peut en discuter.");

-- Ajout d'annonces de test
INSERT INTO announcements (title, description, musical_style, voice_type, instrument, user_id) VALUES
('Recherche guitariste rock', 'Je cherche un guitariste pour un projet rock alternatif', 'Rock', NULL, 'Guitare', 2),
('Cherche chanteur/chanteuse', 'Projet pop en cours, recherche voix soul', 'Pop', 'Soul', NULL, 2);

-- Applications de test
INSERT INTO applications (announcement_id, artist_id, message) VALUES
(1, 1, 'Je suis intéressé par cette annonce'),
(1, 3, 'Je suis également intéressé par cette annonce');