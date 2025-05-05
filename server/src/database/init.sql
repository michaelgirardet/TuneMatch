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

-- TABLE Applications (Collabs aux annonces)
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

INSERT INTO users (
  nom_utilisateur, email, password, role, photo_profil, instruments, biography, city, country, refresh_token
) VALUES
('JohnD999', 'johndoe@example.com', '$2b$10$test', 'musicien', 'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?ga=GA1.1.1458521712.1740386979', 'Guitare', 'Passionné de musique électronique', 'Paris', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken1.signature'),
('Marie Martin', 'marie@example.com', '$2b$10$test', 'producteur', 'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg?ga=GA1.1.1458521712.1740386979', 'Piano, Chant', 'Productrice de hip-hop', 'Lyon', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken2.signature'),
('Pierre Durant', 'pierre@example.com', '$2b$10$test', 'chanteur', 'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833546.jpg?ga=GA1.1.1458521712.1740386979', 'Guitariste et auteur-compositeur', 'Guitare', 'Marseille', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken3.signature'),
('Sophie Dubois', 'sophie@example.com', '$2b$10$test', 'musicien', 'https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869153.jpg?ga=GA1.1.1458521712.1740386979', 'Violoniste classique', 'Guitare', 'Bordeaux', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken4.signature'),
('Alex Becker', 'alex@example.com', '$2b$10$test', 'producteur', 'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303093.jpg?ga=GA1.1.1458521712.1740386979', 'Beatmaker spécialisé trap et drill', 'Violon', 'Berlin', 'Allemagne', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken5.signature'),
('Carlos Mendez', 'carlos@example.com', '$2b$10$test', 'chanteur', 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671116.jpg?ga=GA1.1.1458521712.1740386979', 'Chanteur de reggaeton', 'Madrid', 'DJ', 'Espagne', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken6.signature'),
('Emma Leroy', 'emma@example.com', '$2b$10$test', 'musicien', 'https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869129.jpg?ga=GA1.1.1458521712.1740386979', 'Pianiste jazz', 'DJ', 'Lille', 'France', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken7.signature'),
('Noah Smith', 'noah@example.com', '$2b$10$test', 'producteur', 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611710.jpg?ga=GA1.1.1458521712.1740386979', 'Producteur indépendant pop', 'Chant', 'New York', 'USA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken8.signature'),
('Lucas Moreau', 'lucas@example.com', '$2b$10$test', 'musicien', 'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833584.jpg?ga=GA1.1.1458521712.1740386979', 'Batteur métal', 'Batterie', 'Bruxelles', 'Belgique', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken9.signature'),
('Hana Tanaka', 'hana@example.com', '$2b$10$test', 'chanteur', 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?ga=GA1.1.1458521712.1740386979', 'Chanteuse pop K-pop', 'Piano', 'Séoul', 'Corée du Sud', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken10.signature'),
('Jamal Carter', 'jamal@example.com', '$2b$10$test', 'musicien', 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436200.jpg?ga=GA1.1.1458521712.1740386979', 'Basse funk', 'Piano', 'Los Angeles', 'USA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken11.signature'),
('Maya Rossi', 'maya@example.com', '$2b$10$test', 'producteur', 'https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869157.jpg?ga=GA1.1.1458521712.1740386979', 'Spécialisée en house music', 'Batterie', 'Milan', 'Italie', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken12.signature'),
('Theo Evans', 'theo@example.com', '$2b$10$test', 'musicien', 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671126.jpg?ga=GA1.1.1458521712.1740386979', 'DJ techno', 'DJ', 'Amsterdam', 'Pays-Bas', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken13.signature'),
('Nina Kowalski', 'nina@example.com', '$2b$10$test', 'chanteur', 'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303065.jpg?ga=GA1.1.1458521712.1740386979', 'Mezzo-soprano classique', 'Chant', 'Varsovie', 'Pologne', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken14.signature'),
('Ben Foster', 'ben@example.com', '$2b$10$test', 'producteur', 'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833548.jpg?ga=GA1.1.1458521712.1740386979', 'Ingé son spécialisé en rock alternatif', 'Batterie', 'Dublin', 'Irlande', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshToken15.signature');


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

-- Ajout d'annonces de test
INSERT INTO announcements (title, description, musical_style, voice_type, instrument, user_id) VALUES
("Cherche beatmaker trap", "Besoin d'un beatmaker pour un projet de mixtape", "Trap", NULL, NULL, 5),
("Violoniste pour orchestre", "Recherche violoniste classique pour concerts", "Classique", NULL, "Violon", 4),
("Batteur métal recherché", "Projet métal en cours, besoin d'un batteur expérimenté", "Métal", NULL, "Batterie", 9),
("Chanteur reggae", "Besoin d'un chanteur pour un album reggae", "Reggae", "Ténor", NULL, 6),
("DJ pour collaboration house", "Je cherche un DJ pour mixer mes tracks house", "House", NULL, "DJ", 12),
("Pianiste jazz", "Cherche pianiste pour trio jazz", "Jazz", NULL, "Piano", 7),
("Guitariste pour projet indie", "Projet indie-pop en préparation, besoin d'un guitariste", "Indie", NULL, "Guitare", 2),
("Chanteuse pop urbaine", "Besoin d'une chanteuse avec une voix RnB", "Pop", "Alto", NULL, 10),
("Basse funk groove", "Je cherche un bassiste funky pour un band", "Funk", NULL, "Basse", 11),
("Artiste hip-hop pour feat", "Besoin d'un rappeur pour un feat sur mon EP", "Hip-Hop", NULL, NULL, 8),
("Orchestre symphonique cherche voix", "Orchestre cherchant une voix soprano", "Classique", "Soprano", NULL, 14),
("Chanteur/Chanteuse rock alternatif", "Besoin d'une voix puissante pour projet rock", "Rock", "Baryton", NULL, 15),
("Batteur jazz fusion", "Recherche batteur pour projet jazz fusion", "Jazz", NULL, "Batterie", 7),
("Choriste gospel", "Chœur gospel cherche choriste alto", "Gospel", "Alto", NULL, 13),
("Saxophoniste funk", "Projet funk en recherche d'un saxophoniste", "Funk", NULL, "Saxophone", 11);



-- Applications de test
INSERT INTO applications (announcement_id, artist_id, message) VALUES
(1, 1, 'Je suis intéressé par cette annonce'),
(1, 3, 'Je suis également intéressé par cette annonce');