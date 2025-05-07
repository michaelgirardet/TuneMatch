'use client';

import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { ToasterError, ToasterSuccess } from './Toast';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetchWithAuth('http://localhost:5001/api/users/location', {
        method: 'PUT',
        body: JSON.stringify({ city, country }),
      });

      if (response.ok) {
        onUpdate({ city, country });
        toast.success('📍 Localisation enregistrée ! Place à la connexion.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        onClose();
      } else {
        toast.error('Erreur lors de la mise à jour de la localisation', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } catch (error) {
      toast.error('🔐 Connexion impossible ! Vérifie tes identifiants et réessaie.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-oxford p-8 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl mb-4 font-quicksand text-center font-semibold text-white uppercase">
          Modifier la localisation
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ville"
            className="form-input p-2 rounded text-center bg-space text-white font-thin italic font-quicksand focus:outline-electric"
            required
          />
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Pays"
            className="form-input p-2 rounded text-center bg-space text-white font-thin italic font-quicksand focus:outline-electric"
            required
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-white font-quicksand"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-air disabled:opacity-50 text-oxford font-quicksand"
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
