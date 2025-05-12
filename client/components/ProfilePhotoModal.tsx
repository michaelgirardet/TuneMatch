import { useState } from 'react';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoUpdate: (url: string) => void;
  onUploadClick: () => void;
}

export default function ProfilePhotoModal({
  isOpen,
  onClose,
  onPhotoUpdate,
  onUploadClick,
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
    <div className="fixed inset-0 bg-raisin bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-raisin p-6 rounded-lg w-[90%] max-w-md shadow-lg">
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

          <div className="flex items-center justify-center gap-6 mt-2 text-white text-xs font-quicksand">
            <button
              type="button"
              onClick={onUploadClick}
              className="flex flex-col items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-white"
              >
                <title>téléverser une image</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                />
              </svg>
              Téléverser une image
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-oxford text-white border border-gray-500 hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-electric text-white hover:bg-electrichover"
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
