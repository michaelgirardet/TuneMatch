import { useState } from 'react';
import Image from 'next/image';
import ProfilePhotoModal from './ProfilePhotoModal';

interface ProfilePhotoProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (url: string) => void;
}

export default function ProfilePhoto({ currentPhotoUrl, onPhotoUpdate }: ProfilePhotoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Image
        src={currentPhotoUrl || '/avatar.png'}
        alt="photo de profil"
        width={160}
        height={160}
        className="w-[10em] h-[10em] rounded-[50%] bg-white cursor-pointer object-cover"
        onClick={() => setIsModalOpen(true)}
      />
      <ProfilePhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPhotoUpdate={onPhotoUpdate}
      />
    </>
  );
} 