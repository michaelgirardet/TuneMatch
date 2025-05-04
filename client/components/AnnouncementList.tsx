'use client';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { AnnouncementData } from './AnnouncementModal';
import AnnouncementModal from './AnnouncementModal';
import type { ApplicationData } from './ApplicationModal';
import ApplicationModal from './ApplicationModal';
import { ToasterError, ToasterSuccess } from './Toast';
import { toast } from 'react-toastify';

interface Announcement extends AnnouncementData {
  id: number;
  user_id: number;
  created_at: string;
  nom_utilisateur: string;
  photo_profil?: string;
}

interface Track {
  id: number;
  title: string;
  url: string;
}

export default function AnnouncementList() {
  const { user, token } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementData | undefined>();
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<number | null>(null);
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAnnouncements = useCallback(async () => {
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
      ToasterError({ message: "📢 Les annonces ne s'affichent pas. On regarde ça !" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchUserTracks = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tracks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserTracks(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des morceaux:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAnnouncements();
      if (user?.role === 'musicien' || user?.role === 'chanteur') {
        fetchUserTracks();
      }
    }
  }, [token, user?.role, fetchAnnouncements, fetchUserTracks]);

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
      toast.success('📢 Annonce en ligne ! Que le show commence.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de la création de l'annonce", {
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
      toast.success('✏️ Annonce actualisée ! Toujours au top.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      setIsModalOpen(false);
      setSelectedAnnouncement(undefined);
      fetchAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de la mise à jour de l'annonce", {
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
      toast.success('❌ Annonce supprimée. Prêt pour la prochaine ?', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de la suppression de l'annonce", {
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
  };

  const handleSubmit = (announcementData: AnnouncementData) => {
    if (selectedAnnouncement) {
      handleUpdateAnnouncement(announcementData);
    } else {
      handleCreateAnnouncement(announcementData);
    }
  };

  const handleApply = async (applicationData: ApplicationData) => {
    if (!selectedAnnouncementId) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/applications/announcements/${selectedAnnouncementId}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(applicationData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la candidature");
      }
      toast.success('🚀 Candidature envoyée ! On croise les doigts.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      setIsApplicationModalOpen(false);
      setSelectedAnnouncementId(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de l'envoi de la candidature", {
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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#51537B]" />
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
            className="px-4 py-2 rounded bg-air hover:bg-[#595B88] text-white font-quicksand"
          >
            Créer une annonce
          </button>
        </div>
      )}

      <div>
        <hr className="text-white w-[50vw] justify-self-center mt-16" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-[#212936] rounded-lg p-6 shadow-lg flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              {announcement.photo_profil ? (
                <Image
                  src={announcement.photo_profil}
                  alt={announcement.nom_utilisateur}
                  width={40}
                  height={40}
                  className="rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.jpg';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-air flex items-center justify-center text-white font-bold">
                  {announcement.nom_utilisateur[0].toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-quicksand text-white">{announcement.title}</h3>
                <p className="text-sm text-gray-400">
                  par{' '}
                  <span
                    onClick={() => router.push(`/profile/${announcement.user_id}`)}
                    onKeyDown={() => router.push(`/profile/${announcement.user_id}`)}
                    className="cursor-pointer hover:text-[#51537B] transition-colors"
                  >
                    {announcement.nom_utilisateur}
                  </span>
                </p>
              </div>
            </div>

            <p className="font-quicksand text-white">{announcement.description}</p>

            <div className="flex flex-wrap gap-2 font-quicksand font-light">
              <span className="px-2 py-1 bg-[#f3f3f7] text-[#OAOAOA] rounded text-sm">
                {announcement.musical_style}
              </span>
              {announcement.voice_type && (
                <span className="px-2 py-1 bg-[#f3f3f7] text-[#OAOAOA] rounded text-sm">
                  Voix: {announcement.voice_type}
                </span>
              )}
              {announcement.instrument && (
                <span className="px-2 py-1 bg-[#f3f3f7] text-[#OAOAOA] rounded text-sm">
                  Instrument: {announcement.instrument}
                </span>
              )}
            </div>

            {announcement.other_criteria && (
              <p className="text-sm text-gray-400">{announcement.other_criteria}</p>
            )}

            <div className="flex justify-center gap-2 mt-4">
              {user?.id === announcement.user_id ? (
                <>
                  <div className="flex flex-col justify-between items-center gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setIsModalOpen(true);
                      }}
                      className="py-3 w-44 rounded bg-[#212936] text-white text-md border-lg border font-quicksand sm:w-36 md:w-24 md:text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/applications/${announcement.id}`)}
                      className="py-3 w-44 rounded bg-[#1d1e2c] border border-lg border-[#1d1e2c] text-white text-md font-quicksand sm:w-36 md:w-24 md:text-sm"
                    >
                      Collabs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="py-3 w-44 rounded bg-[#CA2E55] text-white text-md font-quicksand sm:w-36 md:w-24 md:text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              ) : (
                (user?.role === 'musicien' || user?.role === 'chanteur') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAnnouncementId(announcement.id);
                      setIsApplicationModalOpen(true);
                    }}
                    className="px-6 py-3 rounded bg-air text-white text-sm font-quicksand"
                  >
                    Postuler
                  </button>
                )
              )}
            </div>
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

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedAnnouncementId(null);
        }}
        onSubmit={handleApply}
        userTracks={userTracks}
      />
    </div>
  );
}
