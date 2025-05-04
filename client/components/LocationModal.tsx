'use client';

import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { ToasterError, ToasterSuccess } from './Toast';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (location: { city: string; country: string }) => void;
  currentLocation: {
    city?: string;
    country?: string;
  };
}

export default function LocationModal({
  isOpen,
  onClose,
  onUpdate,
  currentLocation,
}: LocationModalProps) {
  const [city, setCity] = useState(currentLocation.city || '');
  const [country, setCountry] = useState(currentLocation.country || '');
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/users/location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ city, country }),
      });

      if (response.ok) {
        onUpdate({ city, country });
        <ToasterSuccess message="📍 Localisation enregistrée ! Place à la connexion." />;
        onClose();
      } else {
        <ToasterError message="Erreur lors de la mise à jour de la localisation" />;
      }
    } catch (error) {
      <ToasterError message="🔐 Connexion impossible ! Vérifie tes identifiants et réessaie." />;
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1e2c] p-8 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl mb-4 font-montserrat text-center font-bold">
          Modifier la localisation
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ville"
            className="form-input p-2 rounded text-center bg-[#101119] font-thin italic font-sulphur"
            required
          />
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Pays"
            className="form-input p-2 rounded text-center bg-[#101119] font-thin italic font-sulphur"
            required
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-[#f3f3f7] font-sulphur"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[#51537B] disabled:opacity-50 text-[#f3f3f7] font-sulphur"
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
