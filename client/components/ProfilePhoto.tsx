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
      <div className="relative group flex flex-col items-center">
        {/* Avatar Card */}
        <div
          className="w-[160px] h-[160px] rounded-full overflow-hidden shadow-xl border-4 border-[#212936] bg-[#101119] 
          transition-transform duration-300 group-hover:scale-105 group-hover:ring-4 ring-[#51537B] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          onKeyDown={() => setIsModalOpen(true)}
        >
          <Image
            src={currentPhotoUrl || '/avatar.png'}
            alt="photo de profil"
            width={160}
            height={160}
            className="object-cover w-full h-full transition-opacity duration-200 group-hover:opacity-80"
            priority
          />
        </div>
        {/* Modifier Button (appears on hover) */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 text-xs bg-[#51537B] text-white rounded-full 
          shadow transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-y-2"
        >
          Modifier
        </button>
      </div>

      {/* Modal pour changer la photo */}
      <ProfilePhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPhotoUpdate={onPhotoUpdate}
      />
    </>
  );
}
