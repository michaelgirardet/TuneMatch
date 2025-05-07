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

  // Met à jour la bio si user change (utile si modale rouverte)
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
        // On suppose que le backend renvoie user à jour (sinon, update manuellement)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-oxford p-8 rounded-xl w-[90%] max-w-md shadow-2xl border-2 border-space relative animate-fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-air focus:outline-none"
          aria-label="Fermer la modale"
        >
          ×
        </button>
        <h2 className="text-2xl mb-6 font-quicksand text-center font-semibold text-white uppercase tracking-widest">
          Modifier la biographie
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            placeholder="Écris ta biographie ici…"
            className="p-4 bg-space rounded-lg text-white font-quicksand min-h-[120px] focus:outline-electric"
            required
            maxLength={1000}
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#212936] border border-lavender text-lavender font-sulphur hover:bg-space transition"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-air text-oxford font-quicksand"
              disabled={loading || !biography}
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.25s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
