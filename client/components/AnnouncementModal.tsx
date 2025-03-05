'use client';
import { useState } from 'react';
import { ToasterError, ToasterSuccess } from './Toast';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (announcement: AnnouncementData) => void;
  announcement?: AnnouncementData;
}

export interface AnnouncementData {
  id?: number;
  title: string;
  description: string;
  musical_style: string;
  voice_type?: string;
  instrument?: string;
  other_criteria?: string;
}

const MUSICAL_STYLES = [
  'Rock',
  'Jazz',
  'Soul',
  'Hip-Hop',
  'R&B',
  'Pop',
  'Électro',
  'Classique',
  'Metal',
  'Folk',
  'Reggae',
  'Blues',
  'Country',
  'Rap',
  'Indie',
  'Latino',
];

export default function AnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  announcement,
}: AnnouncementModalProps) {
  const [formData, setFormData] = useState<AnnouncementData>(
    announcement || {
      title: '',
      description: '',
      musical_style: '',
      voice_type: '',
      instrument: '',
      other_criteria: '',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.musical_style) {
      <ToasterError message="📝 Il manque des infos ! Complète tous les champs requis." />;
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1d1e2c] p-8 rounded-lg w-[90%] max-w-2xl">
        <h2 className="text-xl mb-4 font-montserrat text-center font-bold">
          {announcement ? "Modifier l'annonce" : 'Créer une nouvelle annonce'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              id="title"
              value={formData.title}
              placeholder="Titre"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input p-2 rounded text-center bg-[#0A0A0A] font-thin italic font-sulphur"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <textarea
              id="description"
              value={formData.description}
              placeholder="Description"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input p-2 rounded text-center bg-[#0A0A0A] font-thin italic font-sulphur flex flex-row justify-center items-center"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <select
              id="musical_style"
              value={formData.musical_style}
              onChange={(e) => setFormData({ ...formData, musical_style: e.target.value })}
              className="form-input p-2 rounded text-center bg-[#0A0A0A] font-thin italic font-sulphur"
              required
            >
              <option value="">Sélectionnez un style</option>
              {MUSICAL_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              id="voice_type"
              placeholder="Type de voix"
              value={formData.voice_type}
              onChange={(e) => setFormData({ ...formData, voice_type: e.target.value })}
              className="form-input p-2 rounded text-center bg-[#0A0A0A] font-thin italic font-sulphur"
            />
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              id="instrument"
              placeholder="Intrument (optionnel)"
              value={formData.instrument}
              onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
              className="form-input p-2 rounded text-center bg-[#0A0A0A] font-thin italic font-sulphur"
            />
          </div>

          <div className="flex flex-col gap-2">
            <textarea
              id="other_criteria"
              value={formData.other_criteria}
              placeholder="Autres critères (optionnel)"
              onChange={(e) => setFormData({ ...formData, other_criteria: e.target.value })}
              className="form-input p-2 rounded text-center bg-[#0A0A0A] font-thin italic font-sulphur"
            />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-[#F2F6FF] font-sulphur"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#a71666] disabled:opacity-50 text-[#F2F6FF] font-sulphur"
            >
              {announcement ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
