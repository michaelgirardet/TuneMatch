import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { ToasterError } from './Toast';
import { toast } from 'react-toastify';

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
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/users/photo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photo_profil: photoUrl }),
      });

      if (response.ok) {
        onPhotoUpdate(photoUrl);
        toast.success('📸 Nouvelle photo enregistrée ! Tu es au top !', {
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
      } else {
        toast.error('Erreur lors de la mise à jour de la photo"', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        toast.error('Erreur lors de la mise à jour de la photo', {
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
    } catch (error) {
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
