'use client';
import { useState } from 'react';
import { ToasterError, ToasterSuccess } from './Toast';
import { useAuthStore } from '@/store/authStore';

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
  const { token } = useAuthStore();

  const platformLabels = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    soundcloud: 'SoundCloud',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/users/social-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform,
          link,
        }),
      });

      if (response.ok) {
        onUpdate({ ...currentLinks, [platform]: link });
        ToasterSuccess('Lien mis à jour avec succès !');
        onClose();
      } else {
        const error = await response.json();
        ToasterError(error.message || 'Erreur lors de la mise à jour du lien');
      }
    } catch (error) {
      ToasterError('Erreur de connexion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1e2c] p-8 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl mb-4 font-quicksand text-center">
          Modifier le lien {platformLabels[platform]}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={`URL ${platformLabels[platform]}`}
            className="form-input p-2 rounded text-center"
            required
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[#a71666] disabled:opacity-50 text-white"
            >
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
