// ProfilePhoto.tsx
import Image from 'next/image';
import { useState, useRef } from 'react';
import { fetchWithAuth } from '../app/utils/fetchWithAuth';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import ProfilePhotoModal from './ProfilePhotoModal';

interface ProfilePhotoProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (url: string) => void;
}

export default function ProfilePhoto({ currentPhotoUrl, onPhotoUpdate }: ProfilePhotoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateUser = useAuthStore((state) => state.updateUser);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetchWithAuth('http://localhost:5001/api/users/photo', {
        method: 'POST',
        body: formData,
      });
      const json = await response.json();

      if (response.ok && json.photoUrl) {
        onPhotoUpdate(json.photoUrl);
        updateUser({ ...json.user });
        toast.success('Photo de profil mise à jour !');
      } else {
        toast.error(json.error || "Erreur lors de l'upload.");
      }
    } catch (err) {
      toast.error("Erreur réseau lors de l'upload.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="relative group flex flex-col items-center gap-5">
        <div
          className="avatar w-[150px] h-[150px] mt-5"
          onClick={() => setIsModalOpen(true)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsModalOpen(true)}
          aria-label="Changer la photo de profil"
        >
          <Image
            src={currentPhotoUrl || '/avatar.png'}
            alt="Photo de profil"
            width={100}
            height={100}
            className="object-cover object-center w-full h-full rounded-full cursor-pointer"
            priority
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm">
              Upload...
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-2 px-5 text-white text-xs font-quicksand">
          <button
            type="button"
            onClick={openFileDialog}
            className="btn btn-wide bg-charcoal hover:bg-charcoalhover px-6 py-3 rounded-lg flex items-center justify-center gap-3"
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
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-wide bg-charcoal hover:bg-charcoalhover px-6 py-3 rounded-lg flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-white"
            >
              <title>upload from web</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            Depuis une URL
          </button>
        </div>
      </div>

      <ProfilePhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPhotoUpdate={async (url) => {
          try {
            const response = await fetchWithAuth('http://localhost:5001/api/users/photo', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ photo_profil: url }),
            });
            const json = await response.json();
            if (response.ok && json.photoUrl) {
              onPhotoUpdate(json.photoUrl);
              updateUser({ ...json.user });
              toast.success('📸 Nouvelle photo enregistrée !');
              setIsModalOpen(false);
            } else {
              toast.error(json.error || 'Erreur lors de la mise à jour.');
            }
          } catch (error) {
            toast.error('Erreur réseau lors de la mise à jour.');
            console.error(error);
          }
        }}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
}
