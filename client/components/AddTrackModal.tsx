import { useState } from 'react';
import { ToasterError } from './Toast';

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (track: { title: string; artist: string; url: string }) => void;
}

export default function AddTrackModal({ isOpen, onClose, onAdd }: AddTrackModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [urlError, setUrlError] = useState('');

  const validateYoutubeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
        return "L'URL doit provenir de YouTube";
      }
      return '';
    } catch {
      return "L'URL n'est pas valide";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    setUrlError(validateYoutubeUrl(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateYoutubeUrl(youtubeUrl);
    if (error) {
      ToasterError(error);
      return;
    }

    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      ToasterError("Impossible d'extraire l'ID de la vidéo YouTube");
      return;
    }

    // Vérifier si la vidéo existe
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (!response.ok) {
        ToasterError("Cette vidéo YouTube n'existe pas ou n'est pas accessible");
        return;
      }
    } catch {
      ToasterError("Erreur lors de la vérification de la vidéo YouTube");
      return;
    }

    onAdd({
      title,
      artist,
      url: videoId
    });

    // Réinitialiser le formulaire
    setYoutubeUrl('');
    setTitle('');
    setArtist('');
    setUrlError('');
    onClose();
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1e2c] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-white text-xl font-sulphur mb-4">Ajouter un morceau</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du morceau"
            className="p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Nom de l'artiste"
            className="p-2 rounded bg-gray-700 text-white"
            required
          />
          <div>
            <input
              type="url"
              value={youtubeUrl}
              onChange={handleUrlChange}
              placeholder="URL YouTube"
              className={`p-2 rounded bg-gray-700 text-white w-full ${urlError ? 'border border-red-500' : ''}`}
              required
            />
            {urlError && (
              <p className="text-red-500 text-sm mt-1">{urlError}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#a71666] text-white hover:bg-[#8f1357] transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 