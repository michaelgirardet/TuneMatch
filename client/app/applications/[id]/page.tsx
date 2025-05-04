'use client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ToasterSuccess } from '@/components/Toast';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
          throw new Error('Erreur lors de la récupération des Collabs');
        }

        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Erreur:', error);
        <ToastContainer
          message="🚨 Impossible de charger les Collabs. Réessaie dans un instant."
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />;
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
      toast.success('✅ Statut actualisé ! Tout est en place.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#51537B]" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-quicksand font-bold mb-8 text-center">Collabs reçues</h1>
          <div className="space-y-6">
            {applications.length === 0 ? (
              <p className="text-center text-gray-400 font-quicksand">
                Aucune candidature reçue pour le moment
              </p>
            ) : (
              applications.map((application) => (
                <div key={application.id} className="bg-[#101119] rounded-lg p-6 space-y-4">
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
                      <div className="w-12 h-12 rounded-full bg-air flex items-center justify-center text-white font-bold">
                        {application.nom_utilisateur[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-quicksand text-white">
                        <span
                          onClick={() => router.push(`/profile/${application.artist_id}`)}
                          onKeyDown={() => router.push(`/profile/${application.artist_id}`)}
                          className="cursor-pointer hover:text-[#51537B] transition-colors"
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

                  <p className="font-quicksand text-white whitespace-pre-wrap">
                    {application.message}
                  </p>

                  {application.selected_tracks && (
                    <div className="bg-[#1D1E2C] p-4 rounded">
                      <h4 className="font-quicksand text-white mb-2">Morceaux sélectionnés:</h4>
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
                          className="px-4 py-2 rounded bg-[#2A9D8F] text-white text-sm"
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(application.id, 'rejected')}
                          className="px-4 py-2 rounded bg-[#CA2E55] text-white text-sm"
                        >
                          Refuser
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-4 py-2 rounded text-sm ${
                            application.status === 'accepted'
                              ? 'bg-[#2a9d8f] text-white'
                              : 'bg-[#ca2e55] text-white'
                          }`}
                        >
                          {application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                        </span>
                        {application.status === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => router.push(`/messages/${application.artist_id}`)}
                            className="px-4 py-2 rounded bg-air text-white text-sm hover:bg-[#595B88] transition-colors"
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
