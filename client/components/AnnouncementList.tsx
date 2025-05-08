'use client';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { AnnouncementData } from './AnnouncementModal';
import AnnouncementModal from './AnnouncementModal';
import type { ApplicationData } from './ApplicationModal';
import ApplicationModal from './ApplicationModal';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

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

interface AnnouncementListProps {
  searchTerm: string;
  filterStyle: string;
}

export default function AnnouncementList({ searchTerm, filterStyle }: AnnouncementListProps) {
  const { user, token } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementData | undefined>();
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<number | null>(null);
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetchWithAuth('http://localhost:5001/api/announcements', {});
      if (!response.ok) throw new Error('Erreur lors de la récupération des annonces');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("📢 Les annonces ne s'affichent pas. On regarde ça !");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user tracks
  const fetchUserTracks = useCallback(async () => {
    try {
      const response = await fetchWithAuth('http://localhost:5001/api/tracks', {});
      if (response.ok) {
        const data = await response.json();
        setUserTracks(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des morceaux:', error);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAnnouncements();
      if (user?.role === 'musicien' || user?.role === 'chanteur') {
        fetchUserTracks();
      }
    }
  }, [token, user?.role, fetchAnnouncements, fetchUserTracks]);

  // --- 🔎 Filtrage des annonces selon le terme de recherche ---
  const filteredAnnouncements = announcements.filter((announcement) => {
    const term = searchTerm.trim().toLowerCase();
    const style = filterStyle.trim().toLowerCase();

    // Filtre par style musical
    const styleOk =
      !style || (announcement.musical_style && announcement.musical_style.toLowerCase() === style);

    // Filtre par recherche texte
    const searchOk =
      !term ||
      announcement.title?.toLowerCase().includes(term) ||
      announcement.description?.toLowerCase().includes(term) ||
      announcement.musical_style?.toLowerCase().includes(term) ||
      announcement.instrument?.toLowerCase().includes(term) ||
      announcement.voice_type?.toLowerCase().includes(term) ||
      announcement.other_criteria?.toLowerCase().includes(term) ||
      announcement.nom_utilisateur?.toLowerCase().includes(term);
    return styleOk && searchOk;
  });

  // --- Actions CRUD et modales (inchangées) ---
  const handleCreateAnnouncement = async (announcementData: AnnouncementData) => {
    try {
      const response = await fetchWithAuth('http://localhost:5001/api/announcements', {
        method: 'POST',
        body: JSON.stringify(announcementData),
      });
      if (!response.ok) throw new Error("Erreur lors de la création de l'annonce");
      toast.success('📢 Annonce en ligne ! Que le show commence.', {
        position: 'bottom-right',
        autoClose: 5000,
        theme: 'dark',
      });
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de la création de l'annonce", {
        position: 'bottom-right',
        autoClose: 5000,
        theme: 'dark',
      });
    }
  };

  const handleUpdateAnnouncement = async (announcementData: AnnouncementData) => {
    if (!selectedAnnouncement?.id) return;
    try {
      const response = await fetchWithAuth(
        `http://localhost:5001/api/announcements/${selectedAnnouncement.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(announcementData),
        }
      );
      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'annonce");
      toast.success('✏️ Annonce actualisée ! Toujours au top.', {
        position: 'bottom-right',
        autoClose: 5000,
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
        theme: 'dark',
      });
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    try {
      const response = await fetchWithAuth(`http://localhost:5001/api/announcements/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de l'annonce");
      toast.success('❌ Annonce supprimée. Prêt pour la prochaine ?', {
        position: 'bottom-right',
        autoClose: 5000,
        theme: 'dark',
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de la suppression de l'annonce", {
        position: 'bottom-right',
        autoClose: 5000,
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
      const response = await fetchWithAuth(
        `http://localhost:5001/api/applications/announcements/${selectedAnnouncementId}/apply`,
        {
          method: 'POST',
          body: JSON.stringify(applicationData),
        }
      );
      if (!response.ok) throw new Error("Erreur lors de l'envoi de la candidature");
      toast.success('🚀 Candidature envoyée ! On croise les doigts.', {
        position: 'bottom-right',
        autoClose: 5000,
        theme: 'dark',
      });
      setIsApplicationModalOpen(false);
      setSelectedAnnouncementId(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de l'envoi de la candidature", {
        position: 'bottom-right',
        autoClose: 5000,
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
        <div className="mb-6 text-center">
          <button
            type="button"
            onClick={() => {
              setSelectedAnnouncement(undefined);
              setIsModalOpen(true);
            }}
            className="px-6 py-2 bg-charcoal hover:bg-charcoalhover text-white rounded-lg font-quicksand transition"
          >
            Créer une annonce
          </button>
        </div>
      )}

      <hr className="border-gray-700 my-8 mx-auto w-1/2" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.length === 0 ? (
          <p className="text-white text-center col-span-full">Aucune annonce trouvée.</p>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-space rounded-2xl p-5 shadow-md flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                {announcement.photo_profil ? (
                  <Image
                    src={announcement.photo_profil}
                    alt={announcement.nom_utilisateur}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-avatar.jpg';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-white font-bold font-quicksand">
                    {announcement.nom_utilisateur[0].toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="text-white font-quicksand font-semibold text-xl">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    par{' '}
                    <span
                      onClick={() => router.push(`/profile/${announcement.user_id}`)}
                      onKeyDown={() => router.push(`/profile/${announcement.user_id}`)}
                      className="cursor-pointer text-air hover:text-charcoalhover underline"
                    >
                      {announcement.nom_utilisateur}
                    </span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white font-quicksand text-md mb-3">{announcement.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-oxford text-lavender text-sm px-2 py-1 rounded-full">
                  {announcement.musical_style}
                </span>
                {announcement.voice_type && (
                  <span className="bg-oxford text-lavender text-sm px-2 py-1 rounded-full">
                    Voix: {announcement.voice_type}
                  </span>
                )}
                {announcement.instrument && (
                  <span className="bg-oxford text-lavender text-sm px-2 py-1 rounded-full">
                    Instrument: {announcement.instrument}
                  </span>
                )}
              </div>

              {/* Autres critères */}
              {announcement.other_criteria && (
                <p className="text-gray-400 text-xs mb-4">{announcement.other_criteria}</p>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                {user?.id === announcement.user_id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setIsModalOpen(true);
                      }}
                      className="w-full py-2 text-sm bg-[#212936] text-white rounded-md font-quicksand"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/applications/${announcement.id}`)}
                      className="w-full py-2 text-sm bg-[#1d1e2c] text-white border border-gray-600 rounded-md font-quicksand"
                    >
                      Collabs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="w-full py-2 text-sm bg-[#CA2E55] text-white rounded-md font-quicksand"
                    >
                      Supprimer
                    </button>
                  </>
                ) : (
                  (user?.role === 'musicien' || user?.role === 'chanteur') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAnnouncementId(announcement.id);
                        setIsApplicationModalOpen(true);
                      }}
                      className="w-full py-2 text-md font-semibold bg-electric hover:bg-electrichover text-white rounded-md font-quicksand"
                    >
                      Rejoindre
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
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
