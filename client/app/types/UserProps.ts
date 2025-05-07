export interface UserProps {
  id_utilisateur?: number;
  nom_utilisateur: string;
  email: string;
  role: 'artiste' | 'producteur';
  photo_profil: string;
  biography?: string;
}
