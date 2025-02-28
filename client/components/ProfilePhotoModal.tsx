import { useState } from 'react';
import { toast } from 'react-toastify';
import { ToasterError, ToasterSuccess } from './Toast';
import { useAuthStore } from '@/store/authStore';

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
        ToasterSuccess('Photo de profil mise à jour !');
        onClose();
      } else {
        const errorData = await response.json();
        ToasterError(errorData.message || 'Erreur lors de la mise à jour de la photo');
      }
    } catch (error) {
      ToasterError('Erreur de connexion');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1e2c] p-8 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl text-center mb-4 font-quicksand">Modifier la photo de profil</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="URL de la photo"
            className="form-input p-2 rounded bg-[#0A0A0A]"
            required
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-[#F2F6FF]"
            >
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#a71666] text-[#F2F6FF]">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
