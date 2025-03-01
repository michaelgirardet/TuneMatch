'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ToasterError, ToasterSuccess } from './Toast';
import type { AnnouncementData } from './AnnouncementModal';
import AnnouncementModal from './AnnouncementModal';
import Image from 'next/image';

interface Announcement extends AnnouncementData {
  id: number;
  user_id: number;
  created_at: string;
  nom_utilisateur: string;
  photo_profil?: string;
}

export default function AnnouncementList() {
  const { user, token } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementData | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/announcements', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des annonces');
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Erreur:', error);
      ToasterError('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnnouncements();
    }
  }, [token]);

  const handleCreateAnnouncement = async (announcementData: AnnouncementData) => {
    try {
      const response = await fetch('http://localhost:5001/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'annonce");
      }

      ToasterSuccess('Annonce créée avec succès');
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      ToasterError("Erreur lors de la création de l'annonce");
    }
  };

  const handleUpdateAnnouncement = async (announcementData: AnnouncementData) => {
    if (!selectedAnnouncement?.id) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/announcements/${selectedAnnouncement.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(announcementData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'annonce");
      }

      ToasterSuccess('Annonce mise à jour avec succès');
      setIsModalOpen(false);
      setSelectedAnnouncement(undefined);
      fetchAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      ToasterError("Erreur lors de la mise à jour de l'annonce");
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'annonce");
      }

      ToasterSuccess('Annonce supprimée avec succès');
      fetchAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      ToasterError("Erreur lors de la suppression de l'annonce");
    }
  };

  const handleSubmit = (announcementData: AnnouncementData) => {
    if (selectedAnnouncement) {
      handleUpdateAnnouncement(announcementData);
    } else {
      handleCreateAnnouncement(announcementData);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a71666]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {user?.role === 'producteur' && (
        <div className="mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setSelectedAnnouncement(undefined);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded bg-[#a71666] text-[#F2F6FF] font-sulphur"
          >
            Créer une annonce
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-[#0A0A0A] rounded-lg p-6 shadow-lg flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              {announcement.photo_profil ? (
                <Image
                  src={announcement.photo_profil}
                  alt={announcement.nom_utilisateur}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#a71666] flex items-center justify-center text-[#F2F6FF] font-bold">
                  {announcement.nom_utilisateur[0].toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-montserrat text-white">{announcement.title}</h3>
                <p className="text-sm text-gray-400">par {announcement.nom_utilisateur}</p>
              </div>
            </div>

            <p className="font-sulphur text-[#F2F6FF]">{announcement.description}</p>

            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-[#f2f6ff] rounded text-sm">
                {announcement.musical_style}
              </span>
              {announcement.voice_type && (
                <span className="px-2 py-1 bg-[#f2f6ff] rounded text-sm">
                  Voix: {announcement.voice_type}
                </span>
              )}
              {announcement.instrument && (
                <span className="px-2 py-1 bg-[#f2f6ff] rounded text-sm">
                  Instrument: {announcement.instrument}
                </span>
              )}
            </div>

            {announcement.other_criteria && (
              <p className="text-sm text-gray-400">{announcement.other_criteria}</p>
            )}

            {user?.id === announcement.user_id && (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="submit"
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-[#F2F6FF] font-sulphur"
                >
                  Modifier
                </button>
                <button
                  type="submit"
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  className="px-4 py-2 rounded bg-[#a71666] disabled:opacity-50 text-[#F2F6FF] font-sulphur"
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAnnouncement(undefined);
        }}
        onSubmit={handleSubmit}
        announcement={selectedAnnouncement}
      />
    </div>
  );
}
