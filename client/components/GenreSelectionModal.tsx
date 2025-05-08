'use client';
import { ToasterError, ToasterSuccess } from '@/components/Toast';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

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
    toast.error('Votre session a expiré, veuillez vous reconnecter', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
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
      toast.error('🎼 3 genres max ! Garde ceux qui te représentent le mieux.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
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

      // Mettre à jour les genres musicaux
      const response = await fetchWithAuth('http://localhost:5001/api/users/genres', {
        method: 'PUT',
        body: JSON.stringify({ genres: selectedGenres }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erreur détaillée:', error);

        if (response.status === 401 || error.clearToken) {
          router.push('/login');
          return;
        }
        throw new Error(error.message || 'Erreur lors de la mise à jour des genres');
      }

      const data = await response.json();
      console.log('Réponse réussie:', data);

      // Recharger les données utilisateur
      const userResponse = await fetchWithAuth('http://localhost:5001/api/users/me');

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log(userData);
        useAuthStore.getState().updateUser(userData);
      }

      onUpdate(selectedGenres);
      toast.success('🎼 Genres actualisés ! Ta vibe est bien définie.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Erreur', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        toast.error('🔐 Connexion impossible ! Vérifie tes identifiants et réessaie.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
      console.error('Erreur lors de la mise à jour des genres:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-oxford p-8 rounded-lg w-[90%] max-w-2xl">
        <h2 className="text-xl mb-4 font-quicksand text-center font-semibold text-white uppercase">
          Sélectionnez vos genres musicaux (max. 3)
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {AVAILABLE_GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className={`p-2 font-quicksand rounded transition-colors ${
                  selectedGenres.includes(genre)
                    ? 'bg-space text-white'
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
              className="px-4 py-2 rounded-lg bg-[#0A0A0A] border text-white font-quicksand"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-air disabled:opacity-50 text-oxford font-quicksand"
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
