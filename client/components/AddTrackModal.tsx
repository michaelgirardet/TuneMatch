import { useState } from 'react';
import { ToasterError } from './Toast';
import { toast } from 'react-toastify';

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
      toast.error("Quelque chose s'est mal passé, veuillez réessayer", {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      toast.error('🎬 Oups ! Cette vidéo YouTube semble invalide.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    // Vérifier si la vidéo existe
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (!response.ok) {
        toast.error('❌ Vidéo introuvable ou restreinte. Vérifie l’URL !', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        return;
      }
    } catch {
      toast.error('🔍 Impossible de vérifier cette vidéo. Essaie une autre.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    onAdd({
      title,
      artist,
      url: videoId,
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
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-oxford text-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-space p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4 font-quicksand text-center font-semibold uppercase">
          Ajouter un morceau
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du morceau"
            className="form-input p-2 rounded text-center bg-[#101119] font-thin italic font-quicksand focus:outline-electric"
            required
          />
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Nom de l'artiste"
            className="form-input p-2 rounded text-center bg-[#101119] font-thin italic font-quicksand focus:outline-electric"
            required
          />
          <div>
            <input
              type="url"
              value={youtubeUrl}
              onChange={handleUrlChange}
              placeholder="URL YouTube"
              className={`form-input p-2 rounded text-center bg-[#101119] font-thin italic font-quicksand w-full focus:outline-electric ${urlError ? 'border border-red-500' : ''}`}
              required
            />
            {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
          </div>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0A0A0A] border text-white font-quicksand"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-air disabled:opacity-50 text-white font-quicksand"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
