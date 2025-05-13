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
    photo_profil VARCHAR(1000),
    instruments VARCHAR(255),
    biography TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    youtube_link VARCHAR(255),
    instagram_link VARCHAR(255),
    soundcloud_link VARCHAR(255),
    genres_musicaux VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    refresh_token VARCHAR(512) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
    
 

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

-- TABLE Likes (registre tous les likes, en attente ou réciproques)
CREATE TABLE likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    liker_id INT NOT NULL,
    liked_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_match BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (liker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (liked_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (liker_id, liked_id)
);


-- Table swipe en fil d'attente
CREATE TABLE swipe_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    viewer_id INT NOT NULL,
    viewed_id INT NOT NULL,
    seen BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (viewed_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_swipe (viewer_id, viewed_id)
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

-- TABLE Reviews
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reviewer_id INT NOT NULL,      -- utilisateur qui donne l'avis
  reviewed_id INT NOT NULL,      -- utilisateur qui reçoit l'avis (l'artiste)
  rating INT NOT NULL,           -- note, ex: 1 à 5
  comment TEXT,                  -- commentaire optionnel
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (reviewer_id, reviewed_id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE CASCADE
);


INSERT INTO users (
  nom_utilisateur, email, password, role, photo_profil, instruments, biography, city, country, refresh_token
) VALUES
('JohnD999', 'johndoe@example.com', '$2b$10$test', 'musicien', 'https://avatar.iran.liara.run/public/boy', 'Guitare', 'Passionné de musique électronique', 'Paris', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken1.signature'),
('Marie Martin', 'marie@example.com', '$2b$10$test', 'producteur', 'https://avatar.iran.liara.run/public/girl', 'Piano, Chant', 'Productrice de hip-hop', 'Lyon', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken2.signature'),
('Pierre Durant', 'pierre@example.com', '$2b$10$test', 'chanteur', 'https://avatar.iran.liara.run/public/boy', 'Guitariste et auteur-compositeur', 'Guitare', 'Marseille', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken3.signature'),
('Sophie Dubois', 'sophie@example.com', '$2b$10$test', 'musicien', 'https://avatar.iran.liara.run/public/girl', 'Violoniste classique', 'Guitare', 'Bordeaux', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken4.signature'),
('Alex Becker', 'alex@example.com', '$2b$10$test', 'producteur', 'https://avatar.iran.liara.run/public/boy', 'Beatmaker spécialisé trap et drill', 'Violon', 'Berlin', 'Allemagne', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken5.signature'),
('Carlos Mendez', 'carlos@example.com', '$2b$10$test', 'chanteur', 'https://avatar.iran.liara.run/public/boy', 'Chanteur de reggaeton', 'Madrid', 'DJ', 'Espagne', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken6.signature'),
('Emma Leroy', 'emma@example.com', '$2b$10$test', 'musicien', 'https://avatar.iran.liara.run/public/girl', 'Pianiste jazz', 'DJ', 'Lille', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken7.signature'),
('Noah Smith', 'noah@example.com', '$2b$10$test', 'producteur', 'https://avatar.iran.liara.run/public/boy', 'Producteur indépendant pop', 'Chant', 'New York', 'USA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken8.signature'),
('Lucas Moreau', 'lucas@example.com', '$2b$10$test', 'musicien', 'https://avatar.iran.liara.run/public/boy', 'Batteur métal', 'Batterie', 'Bruxelles', 'Belgique', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken9.signature'),
('Hana Tanaka', 'hana@example.com', '$2b$10$test', 'chanteur', 'https://avatar.iran.liara.run/public/girl', 'Chanteuse pop K-pop', 'Piano', 'Séoul', 'Corée du Sud', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken10.signature'),
('Jamal Carter', 'jamal@example.com', '$2b$10$test', 'musicien', 'https://avatar.iran.liara.run/public/boy', 'Basse funk', 'Piano', 'Los Angeles', 'USA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken11.signature'),
('Maya Rossi', 'maya@example.com', '$2b$10$test', 'producteur', 'https://avatar.iran.liara.run/public/girlhttps://i.pravatar.cc/300', 'Spécialisée en house music', 'Batterie', 'Milan', 'Italie', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken12.signature'),
('Theo Evans', 'theo@example.com', '$2b$10$test', 'musicien', 'https://avatar.iran.liara.run/public/boy', 'DJ techno', 'DJ', 'Amsterdam', 'Pays-Bas', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken13.signature'),
('Nina Kowalski', 'nina@example.com', '$2b$10$test', 'chanteur', 'https://avatar.iran.liara.run/public/girl', 'Mezzo-soprano classique', 'Chant', 'Varsovie', 'Pologne', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken14.signature'),
('Ben Foster', 'ben@example.com', '$2b$10$test', 'producteur', 'https://avatar.iran.liara.run/public/boy', 'Ingé son spécialisé en rock alternatif', 'Batterie', 'Dublin', 'Irlande', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken15.signature');


INSERT INTO tracks (title, artist, url, user_id) VALUES
('Electro Vibes', 'JohnD999', 'https://soundcloud.com/johnd999/electro-vibes', 1),
('Rock Anthem', 'Pierre Durant', 'https://youtube.com/pierredurant/rock-anthem', 3);

INSERT INTO profil_artiste (user_id, genre_musical, instruments_pratiques, reseaux_sociaux) VALUES
(1, 'Électro', 'Synthétiseur, DJ', 'https://instagram.com/johnd999'),
(3, 'Rock', 'Guitare, Chant', 'https://facebook.com/pierredurantmusic');

INSERT INTO profil_producteur (user_id, style_recherche, label_studio, projets_en_cours, liens_professionnels) VALUES
(2, 'Hip-Hop, Trap', 'Paris Sound Studio', 'Recrute des talents émergents', 'https://linkedin.com/in/mariemartin');

-- Likes simulés entre utilisateurs (certains deviennent un match si les deux se likent)
INSERT INTO likes (liker_id, liked_id, is_match) VALUES
(1, 2, FALSE),  -- John aime Marie, pas encore réciproque
(2, 1, TRUE),   -- Marie aime aussi John ⇒ match activé
(3, 4, FALSE),  -- Pierre aime Sophie, pas encore réciproque
(5, 1, FALSE),  -- Alex aime John
(1, 5, TRUE),   -- John aime Alex aussi ⇒ match activé
(6, 3, FALSE),  -- Carlos aime Pierre
(7, 10, FALSE), -- Emma aime Hana
(10, 7, TRUE);  -- Hana aime aussi Emma ⇒ match

-- Simule les profils que chaque utilisateur a vus
INSERT INTO swipe_queue (viewer_id, viewed_id, seen) VALUES
(1, 2, TRUE),  -- John a vu Marie
(1, 3, TRUE),  -- John a vu Pierre
(1, 5, TRUE),  -- John a vu Alex
(2, 1, TRUE),  -- Marie a vu John
(3, 4, TRUE),  -- Pierre a vu Sophie
(4, 3, TRUE),  -- Sophie a vu Pierre
(7, 10, TRUE), -- Emma a vu Hana
(10, 7, TRUE), -- Hana a vu Emma
(5, 6, FALSE), -- Alex n’a pas encore swipé Carlos
(6, 5, FALSE); -- Carlos n’a pas encore swipé Alex

INSERT INTO messages (id_expediteur, id_destinataire, contenu) VALUES
(1, 2, 'Salut Marie, intéressée par un featuring électro ?'),
(2, 1, "Salut John, j\'aime ton style ! On peut en discuter.");

INSERT INTO reviews (reviewer_id, reviewed_id, rating, comment) VALUES
(1, 2, 5, 'Un artiste incroyable, très professionnel et créatif !'),
(3, 2, 4, 'Très bon travail, à recommander.'),
(4, 1, 3, 'Bon musicien mais peut encore s’améliorer sur certains aspects.'),
(2, 3, 5, 'Collaboration parfaite, super expérience !'),
(5, 1, 2, 'Pas entièrement satisfait, communication difficile.'),
(6, 4, 4, 'Beau travail, à refaire avec plaisir.'),
(7, 5, 5, 'Talentueux et très sympathique.'),
(8, 2, 3, 'Correct mais manque un peu d’originalité.'),
(9, 6, 4, 'Bonne énergie et bon son.'),
(10, 7, 5, 'Artiste très professionnel, je recommande vivement !');
