'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToasterError, ToasterSuccess } from '@/components/Toast';
import Image from 'next/image';

interface Application {
  id: number;
  artist_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  selected_tracks: string;
  created_at: string;
  nom_utilisateur: string;
  photo_profil?: string;
  genres_musicaux?: string;
}

export default function ApplicationsPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/applications/announcements/${params.id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des candidatures');
        }

        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Erreur:', error);
        <ToasterError message="🚨 Impossible de charger les candidatures. Réessaie dans un instant." />;
      } finally {
        setLoading(false);
      }
    };

    if (token && params.id) {
      fetchApplications();
    }
  }, [token, params.id]);

  const handleUpdateStatus = async (applicationId: number, newStatus: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/applications/${applicationId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du statut');
      }
      <ToasterSuccess message="✅ Statut actualisé ! Tout est en place." />;
      setApplications(
        applications.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen w-full flex flex-col">
        <Navbar />
        <div className="flex justify-center items-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a71666]" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-quicksand font-bold mb-8 text-center">
            Candidatures reçues
          </h1>
          <div className="space-y-6">
            {applications.length === 0 ? (
              <p className="text-center text-gray-400 font-sulphur">
                Aucune candidature reçue pour le moment
              </p>
            ) : (
              applications.map((application) => (
                <div key={application.id} className="bg-[#0A0A0A] rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    {application.photo_profil ? (
                      <Image
                        src={application.photo_profil}
                        alt={application.nom_utilisateur}
                        width={48}
                        height={48}
                        className="rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-avatar.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#a71666] flex items-center justify-center text-[#F2F6FF] font-bold">
                        {application.nom_utilisateur[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-montserrat text-[#F2F6FF]">
                        <span
                          onClick={() => router.push(`/profile/${application.artist_id}`)}
                          onKeyDown={() => router.push(`/profile/${application.artist_id}`)}
                          className="cursor-pointer hover:text-[#a71666] transition-colors"
                        >
                          {application.nom_utilisateur}
                        </span>
                      </h3>
                      {application.genres_musicaux && (
                        <p className="text-sm text-gray-400">
                          Genres: {application.genres_musicaux}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="font-montserrat text-[#F2F6FF] whitespace-pre-wrap">
                    {application.message}
                  </p>

                  {application.selected_tracks && (
                    <div className="bg-[#1D1E2C] p-4 rounded">
                      <h4 className="font-sulphur text-[#F2F6FF] mb-2">Morceaux sélectionnés:</h4>
                      <ul className="list-disc list-inside text-gray-400">
                        {application.selected_tracks.split(',').map((trackId) => (
                          <li key={trackId}>Morceau #{trackId}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    {application.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(application.id, 'accepted')}
                          className="px-4 py-2 rounded bg-[#2A9D8F] text-[#F2F6FF] text-sm"
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(application.id, 'rejected')}
                          className="px-4 py-2 rounded bg-[#CA2E55] text-[#F2F6FF] text-sm"
                        >
                          Refuser
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-4 py-2 rounded text-sm ${
                            application.status === 'accepted'
                              ? 'bg-[#2a9d8f] text-[#F2F6FF]'
                              : 'bg-[#ca2e55] text-[#F2F6FF]'
                          }`}
                        >
                          {application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                        </span>
                        {application.status === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => router.push(`/messages/${application.artist_id}`)}
                            className="px-4 py-2 rounded bg-[#a71666] text-[#F2F6FF] text-sm hover:bg-[#8f1356] transition-colors"
                          >
                            Envoyer un message
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
