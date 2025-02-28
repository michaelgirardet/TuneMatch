import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  id_utilisateur?: number;
  nom_utilisateur: string;
  email: string;
  role: 'artiste' | 'producteur';
  photo_profil: string;
  biography: string;
}

interface JwtPayload {
  exp: number;
  userId: number;
}

type LogoutCallback = () => void;

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: (onLogout?: LogoutCallback) => void;
  updateUser: (user: User) => void;
  checkTokenExpiration: () => boolean;
  refreshToken: () => Promise<boolean>;
  forceLogout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: (onLogout?: LogoutCallback) => {
        set({ isAuthenticated: false, token: null, user: null });
        localStorage.removeItem('auth-storage');
        if (onLogout) {
          onLogout();
        }
      },
      forceLogout: () => {
        set({ isAuthenticated: false, token: null, user: null });
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      },
      updateUser: (user) => set({ user }),
      checkTokenExpiration: () => {
        const token = get().token;
        if (!token) return true;

        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;
          return decoded.exp < currentTime;
        } catch {
          return true;
        }
      },
      refreshToken: async () => {
        const { token, user } = get();
        if (!token || !user) return false;

        try {
          const response = await fetch('http://localhost:5001/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            const data = await response.json();
            if (data.clearToken) {
              get().forceLogout();
            }
            throw new Error('Échec du rafraîchissement du token');
          }

          const data = await response.json();
          set({ token: data.token, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Erreur lors du rafraîchissement du token:', error);
          get().forceLogout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
