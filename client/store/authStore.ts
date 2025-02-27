import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useRouter } from 'next/router';

interface User {
  id_utilisateur?: number;
  nom_utilisateur: string;
  email: string;
  role: 'artiste' | 'producteur';
  photo_profil: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: () => {
        set({ isAuthenticated: false, token: null, user: null });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
