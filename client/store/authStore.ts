import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  nom_utilisateur: string;
  email: string;
  role: string;
  photo_profil?: string;
  biography?: string;
  genres_musicaux?: string;
  youtube_link?: string;
  instagram_link?: string;
  soundcloud_link?: string;
  instruments: string;
  city?: string;
  country?: string;
  tracks?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
