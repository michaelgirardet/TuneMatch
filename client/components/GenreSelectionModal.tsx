'use client';
import { ToasterError, ToasterSuccess } from '@/components/Toast';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface GenreSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (genres: string[]) => void;
  currentGenres: string[];
}

const AVAILABLE_GENRES = [
  'Rock',
  'Jazz',
  'Soul',
  'Hip-Hop',
  'R&B',
  'Pop',
  'Électro',
  'Classique',
  'Metal',
  'Folk',
  'Reggae',
  'Blues',
  'Country',
  'Rap',
  'Indie',
  'Latino',
];

export default function GenreSelectionModal({
  isOpen,
  onClose,
  onUpdate,
  currentGenres,
}: GenreSelectionModalProps) {
  const { token, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentGenres);
  const [loading, setLoading] = useState(false);

  const handleSessionExpired = () => {
    <ToasterError message="Votre session a expiré, veuillez vous reconnecter" />;
    logout();
    router.push('/login');
    onClose();
  };

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres((prev) => prev.filter((g) => g !== genre));
      return;
    }

    if (selectedGenres.length >= 3) {
      <ToasterError message="🎼 3 genres max ! Garde ceux qui te représentent le mieux." />;
      return;
    }

    setSelectedGenres((prev) => [...prev, genre]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token || !isAuthenticated) {
        handleSessionExpired();
        return;
      }

      const response = await fetch('http://localhost:5001/api/users/genres', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ genres: selectedGenres }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erreur détaillée:', error);

        if (response.status === 401 || error.clearToken) {
          logout();
          router.push('/login');
          return;
        }
        throw new Error(error.message || 'Erreur lors de la mise à jour des genres');
      }

      const data = await response.json();
      console.log('Réponse réussie:', data);

      // Recharger les données utilisateur
      const userResponse = await fetch('http://localhost:5001/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        useAuthStore.getState().updateUser(userData);
      }

      onUpdate(selectedGenres);
      <ToasterSuccess message="🎼 Genres actualisés ! Ta vibe est bien définie." />;
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        <ToasterError message="error" />;
      } else {
        <ToasterError message="🔐 Connexion impossible ! Vérifie tes identifiants et réessaie." />;
      }
      console.error('Erreur lors de la mise à jour des genres:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1e2c] p-8 rounded-lg w-[90%] max-w-2xl">
        <h2 className="text-xl mb-4 font-montserrat text-center font-bold">
          Sélectionnez vos genres musicaux (max. 3)
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {AVAILABLE_GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className={`p-2 font-montserrat rounded transition-colors ${
                  selectedGenres.includes(genre)
                    ? 'bg-[#51537B] text-[#f3f3f7]'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-[#f3f3f7] font-sulphur"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[#51537B] disabled:opacity-50 text-[#f3f3f7] font-sulphur"
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
