USE tunematch;

-- Ajout des colonnes pour la réinitialisation du mot de passe
ALTER TABLE Utilisateur
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expires TIMESTAMP NULL; 