'use client';
import { useState } from 'react';
import { ToasterError } from './Toast';
import { useAuthStore } from '@/store/authStore';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationData) => void;
  userTracks: Array<{ id: number; title: string }>;
}

export interface ApplicationData {
  message: string;
  selected_tracks?: string;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  userTracks,
}: ApplicationModalProps) {
  const [formData, setFormData] = useState<ApplicationData>({
    message: '',
    selected_tracks: '',
  });
  const [selectedTrackIds, setSelectedTrackIds] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message) {
      ToasterError({ message: '✍️ Un petit message, ça aide ! Écris quelque chose.' });
      return;
    }

    onSubmit({
      ...formData,
      selected_tracks: selectedTrackIds.join(','),
    });
  };

  const handleTrackToggle = (trackId: number) => {
    setSelectedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1e2c] p-8 rounded-lg w-[90%] max-w-2xl">
        <h2 className="text-xl mb-4 font-quicksand text-center font-bold">Postuler à l'annonce</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-sulphur text-[#f3f3f7]">
              Votre message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="p-2 rounded bg-[#101119] text-[#f3f3f7] font-sulphur min-h-[100px] italic"
              placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé par cette annonce..."
              required
            />
          </div>

          {userTracks.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userTracks.map((track) => (
                  <div
                    key={track.id}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      selectedTrackIds.includes(track.id)
                        ? 'bg-[#51537B] text-[#f3f3f7]'
                        : 'bg-[#101119] text-gray-300 hover:bg-gray-800'
                    }`}
                    onClick={() => handleTrackToggle(track.id)}
                    onKeyDown={() => handleTrackToggle(track.id)}
                  >
                    {track.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-[#f3f3f7] font-sulphur"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#51537B] disabled:opacity-50 text-[#f3f3f7] font-sulphur"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
