import { toast } from 'react-toastify';
import { fetchWithAuth } from '../app/utils/fetchWithAuth';
import { useState } from 'react';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoUpdate: (url: string) => void;
}

export default function ProfilePhotoModal({
  isOpen,
  onClose,
  onPhotoUpdate,
}: ProfilePhotoModalProps) {
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth('http://localhost:5001/api/users/photo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photo_profil: photoUrl }),
      });

      if (response.ok) {
        const json = await response.json();
        onPhotoUpdate(json.photoUrl);
        toast.success('📸 Nouvelle photo enregistrée ! Tu es au top !', {
          position: 'bottom-right',
          theme: 'dark',
        });
        onClose();
      } else {
        toast.error('Erreur lors de la mise à jour de la photo', {
          position: 'bottom-right',
          theme: 'dark',
        });
      }
    } catch (error) {
      toast.error('🔐 Problème de connexion ! Réessaie plus tard.', {
        position: 'bottom-right',
        theme: 'dark',
      });
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-oxford p-8 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl mb-4 font-quicksand text-center font-semibold text-white uppercase">
          Modifier la photo de profil
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="URL de la photo"
            className="form-input p-2 rounded text-center bg-space text-white font-thin italic font-quicksand focus:outline-electric"
            required
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-white font-quicksand"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-air disabled:opacity-50 text-oxford font-quicksand"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
