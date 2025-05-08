// ProfilePhotoModal.tsx
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

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl(photoUrl)) return;

    onPhotoUpdate(photoUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1b26] p-6 rounded-lg w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl mb-4 font-semibold text-white text-center uppercase">
          Changer la photo
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Colle l’URL de l’image"
            className="p-2 rounded text-center bg-space text-white italic placeholder-gray-400 focus:outline-electric"
            required
          />

          {isValidUrl(photoUrl) && (
            <img
              src={photoUrl}
              alt="Aperçu"
              className="w-32 h-32 object-cover mx-auto rounded-full border-2 border-white"
            />
          )}

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0a0a0a] text-white border border-gray-500 hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-charcoal text-white hover:bg-charcoal/80"
              disabled={!isValidUrl(photoUrl)}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
