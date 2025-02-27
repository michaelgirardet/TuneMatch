'use client';
import { useState } from 'react';
import { ToasterError, ToasterSuccess } from './Toast';

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
  const [selectedGenres, setSelectedGenres] = useState<string[]>(currentGenres);
  const [loading, setLoading] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      }
      if (prev.length >= 5) {
        ToasterError('Vous ne pouvez sélectionner que 5 genres maximum');
        return prev;
      }
      return [...prev, genre];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/users/genres', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ genres: selectedGenres }),
      });

      if (response.ok) {
        onUpdate(selectedGenres);
        ToasterSuccess('Genres musicaux mis à jour !');
        onClose();
      } else {
        const error = await response.json();
        ToasterError(error.message || 'Erreur lors de la mise à jour des genres');
      }
    } catch (error) {
      ToasterError('Erreur de connexion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1e2c] p-8 rounded-lg w-[90%] max-w-2xl">
        <h2 className="text-2xl mb-4 font-quicksand text-white">
          Sélectionnez vos genres musicaux (max. 5)
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {AVAILABLE_GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className={`p-2 rounded transition-colors ${
                  selectedGenres.includes(genre)
                    ? 'bg-[#a71666] text-white font-sulphur font-light'
                    : 'bg-gray-700 text-white hover:bg-gray-600 font-sulphur'
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
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors text-white font-semibold font-sulphur"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[#a71666] disabled:opacity-50 text-white font-semibold font-sulphur"
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
