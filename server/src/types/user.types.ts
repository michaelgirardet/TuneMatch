export interface User {
  id_utilisateur?: number;
  nom_utilisateur: string;
  email: string;
  mot_de_passe: string;
  role: 'artiste' | 'producteur';
  photo_profil?: string;
  biographie?: string;
  localisation?: string;
  date_inscription?: Date;
  reset_token?: string;
  reset_token_expires?: Date;
} 