'use client';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import LocationModal from './LocationModal';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

export default function Location() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // État local pour stocker la localisation
  const [location, setLocation] = useState({
    city: user?.city || '',
    country: user?.country || '',
  });

  // Mettre à jour l'état local lorsque user change
  useEffect(() => {
    if (user) {
      setLocation({
        city: user.city || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handleLocationUpdate = async (newLocation: { city: string; country: string }) => {
    try {
      const response = await fetchWithAuth('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          city: newLocation.city,
          country: newLocation.country,
        }),
      });

      const json = await response.json();

      if (response.ok && json.user) {
        updateUser(json.user);
        setLocation(newLocation);
        setIsModalOpen(false);
      } else {
        console.error('Erreur lors de la mise à jour:', json);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la localisation:', error);
    }
  };

  const displayLocation =
    location.city && location.country
      ? `${location.city}, ${location.country}`
      : 'Ajouter une localisation';

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
        currentLocation={location}
      />
    </div>
  );
}
