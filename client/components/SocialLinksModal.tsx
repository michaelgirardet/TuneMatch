'use client';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { ToasterError, ToasterSuccess } from './Toast';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

interface SocialLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (links: SocialLinks) => void;
  currentLinks: SocialLinks;
  platform: 'youtube' | 'instagram' | 'soundcloud';
}

interface SocialLinks {
  youtube?: string;
  instagram?: string;
  soundcloud?: string;
}

export default function SocialLinksModal({
  isOpen,
  onClose,
  onUpdate,
  currentLinks,
  platform,
}: SocialLinksModalProps) {
  const [link, setLink] = useState(currentLinks[platform] || '');
  const [loading, setLoading] = useState(false);

  const platformLabels = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    soundcloud: 'SoundCloud',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetchWithAuth('http://localhost:5001/api/users/social-links', {
        method: 'PUT',
        body: JSON.stringify({
          platform,
          link,
        }),
      });

      if (response.ok) {
        onUpdate({ ...currentLinks, [platform]: link });
        ToasterSuccess({ message: '🔗 Lien actualisé ! Tout est bien connecté.' });
        onClose();
      } else {
        const error = await response.json();
        ToasterError(error.message || 'Erreur lors de la mise à jour du lien');
      }
    } catch (error) {
      ToasterError({ message: '🔐 Connexion impossible ! Vérifie tes identifiants et réessaie.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-raisin bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-raisin p-6 rounded-lg w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl mb-4 font-semibold text-white text-center uppercase">
          Modifier le lien {platformLabels[platform]}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={`URL ${platformLabels[platform]}`}
            className="p-2 rounded text-center bg-space text-white italic placeholder-gray-400 focus:outline-electric"
            required
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0a0a0a] text-white border border-gray-500 hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-electric text-white hover:bg-electrichover"
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
