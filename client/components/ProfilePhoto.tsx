import Image from 'next/image';
import { useState, useRef } from 'react';
import ProfilePhotoModal from './ProfilePhotoModal';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

interface ProfilePhotoProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (url: string) => void;
}

export default function ProfilePhoto({ currentPhotoUrl, onPhotoUpdate }: ProfilePhotoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);

  // Handler d'upload (API à adapter à ton backend)
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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

      const response = await fetch('http://localhost:5001/api/users/photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const json = await response.json();
      if (response.ok && json.photoUrl) {
        onPhotoUpdate(json.photoUrl);
        updateUser({ ...json.user }); // Si ton backend renvoie user à jour
        toast.success('Photo de profil mise à jour !');
        setIsModalOpen(false);
      } else {
        toast.error(json.error || "Erreur lors de l'upload.");
      }
    } catch (err) {
      toast.error("Erreur réseau lors de l'upload.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <div className="relative group flex flex-col items-center">
        {/* Avatar Card */}
        <div
          className="w-[160px] h-[160px] rounded-full overflow-hidden shadow-xl border-4 border-[#212936] bg-[#101119] 
          transition-transform duration-300 group-hover:scale-105 group-hover:ring-4 ring-[#51537B] cursor-pointer"
          aria-label="Changer la photo de profil"
          onClick={() => setIsModalOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true);
          }}
        >
          <Image
            src={currentPhotoUrl || '/avatar.png'}
            alt={currentPhotoUrl ? 'Photo de profil' : 'Avatar par défaut'}
            width={160}
            height={160}
            className="object-cover w-full h-full transition-opacity duration-200 group-hover:opacity-80"
            priority
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm">
              Upload...
            </div>
          )}
        </div>
        {/* Modifier Button (toujours visible sur mobile, hover sur desktop) */}
        <button
          type="button"
          aria-label="Modifier la photo de profil"
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 text-xs bg-air text-white rounded-full 
          shadow transition-all duration-200 opacity-100 md:opacity-0 group-hover:opacity-100 group-hover:translate-y-2"
        >
          Modifier
        </button>
      </div>

      {/* Modal pour changer la photo */}
      <ProfilePhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPhotoUpdate={(url) => {
          onPhotoUpdate(url);
          setIsModalOpen(false);
        }}
      />

      {/* Input file caché pour accessibilité */}
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
