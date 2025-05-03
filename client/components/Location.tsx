'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import LocationModal from './LocationModal';
import { FaMapMarkerAlt } from 'react-icons/fa';

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
      <div
        onKeyDown={() => setIsModalOpen(true)}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity p-5"
      >
        <FaMapMarkerAlt className="text-[#51537B]" />
        <h3 className="text-[#f3f3f7] font-bold text-2xl font-quicksand">{displayLocation}</h3>
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleLocationUpdate}
        currentLocation={{
          city: user?.city,
          country: user?.country,
        }}
      />
    </div>
  );
}
