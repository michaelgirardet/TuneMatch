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
      </div>

      <ProfilePhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadClick={openFileDialog}
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
