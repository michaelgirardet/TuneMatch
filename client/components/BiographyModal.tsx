'use client';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface BiographyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newBio: string) => Promise<void>;
  currentBio: string;
}

export default function BiographyModal({ isOpen, onClose }: BiographyModalProps) {
  const { user, updateUser } = useAuthStore();
  const [biography, setBiography] = useState(user?.biography || '');
  const [loading, setLoading] = useState(false);

  // Met à jour la bio si user change en gardant la modale ouverte
  useEffect(() => {
    setBiography(user?.biography || '');
  }, [user?.biography]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetchWithAuth('http://localhost:5001/api/users/biography', {
        method: 'PUT',
        body: JSON.stringify({ biography }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.user) {
          updateUser(json.user);
        } else if (user?.id) {
          updateUser({ ...user, biography });
        }
        toast.success('📖 Bio mise à jour ! Ton histoire est prête à être lue.');
        onClose();
      } else {
        toast.error('Erreur lors de la mise à jour de la biographie');
      }
    } catch (error) {
      console.error(error);
      toast.error('🔐 Connexion impossible ! Vérifie ta connexion.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-raisin bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-raisin h-96 p-6 rounded-lg w-[90%] max-w-md shadow-lg flex flex-col items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-air focus:outline-none"
          aria-label="Fermer la modale"
        >
          ×
        </button>
        <h2 className="text-xl mb-4 font-semibold text-white text-center uppercase">
          Modifier la biographie
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            placeholder="Écris ta biographie ici…"
            className="p-4 bg-space rounded-lg text-white font-quicksand h-[30vh] w- focus:outline-electric"
            required
            maxLength={1000}
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-oxford text-white border border-gray-500 hover:bg-gray-800"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-electric text-white hover:bg-electrichover"
              disabled={loading || !biography}
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
