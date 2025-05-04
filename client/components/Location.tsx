'use client';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import LocationModal from './LocationModal';

export default function Location() {
  const { user, updateUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationUpdate = (location: { city: string; country: string }) => {
    if (user) {
      updateUser({
        ...user,
        city: location.city,
        country: location.country,
      });
    }
  };

  const displayLocation =
    user?.city && user?.country ? `${user.city}, ${user.country}` : 'Ajouter une localisation';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity p-4 rounded-lg"
        aria-label="Modifier la localisation"
      >
        <FaMapMarkerAlt className="text-[#51537B]" />
        <span className="text-white font-bold text-lg font-quicksand">{displayLocation}</span>
      </button>

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleLocationUpdate}
        currentLocation={{
          city: user?.city || '',
          country: user?.country || '',
        }}
      />
    </div>
  );
}
