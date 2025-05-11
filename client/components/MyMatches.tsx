'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface UserProfile {
  id: number;
  nom_utilisateur: string;
  photo_profil?: string;
  role: string;
  city?: string;
  country?: string;
  genres_musicaux?: string;
  biography?: string;
}

export default function MyMatches() {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const res = await fetchWithAuth('http://localhost:5001/api/discover/matches');
        if (!res.ok) throw new Error('Erreur lors du chargement des matchs');
        const data = await res.json();
        setMatches(data);
        if (data.length > 0) {
          setSelectedMatch(data[0]);
        }
      } catch (error) {
        toast.error('Impossible de charger vos matchs.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  const handleSelectMatch = (match: UserProfile) => {
    setSelectedMatch(match);
  };

  const handleSendMessage = (matchId: number) => {
    window.location.href = `/messages/${matchId}`;
  };

  const handleDeleteMatch = async (matchId: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce match ?')) return;
    try {
      const res = await fetchWithAuth(`http://localhost:5001/api/discover/matches/${matchId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression du match');

      toast.success('Match supprimé avec succès.');
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      if (selectedMatch?.id === matchId) {
        setSelectedMatch(null);
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression du match.');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-10">Chargement des matchs...</div>;
  }

  if (matches.length === 0) {
    return <div className="text-white text-center py-10">Vous n'avez pas encore de matchs.</div>;
  }

  return (
    <section className="p-2 flex flex-col items-center gap-2">
      {/* Carousel avec photos round */}
      <div className="flex overflow-x-auto gap-6 py-4 w-full scrollbar-hide justify-center bg-space font-quicksand">
        {matches.map((match) => (
          <div key={match.id} className="flex flex-col items-center justify-center">
            <button
              type="button"
              key={match.id}
              onClick={() => handleSelectMatch(match)}
              className={`transition duration-200 transform hover:scale-120 focus:outline-none ${
                selectedMatch?.id === match.id ? 'ring-electric shadow-lg scale-110' : 'opacity-80'
              } rounded-full`}
            >
              <Image
                src={match.photo_profil || '/default-avatar.jpg'}
                alt={match.nom_utilisateur}
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20 border-2 border-white"
              />
              <p className="text-white font-semibold text-center">{match.nom_utilisateur}</p>
              <p className="text-white font-medium">{match.role}</p>
            </button>
          </div>
        ))}
      </div>

      {/* Card avec infos du match sélectionné */}
      {selectedMatch && (
        <div className="w-[90vw] bg-space p-2 text-white">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            <Image
              src={selectedMatch.photo_profil || '/default-avatar.jpg'}
              alt={selectedMatch.nom_utilisateur}
              width={140}
              height={140}
              className="object-cover w-full h-72"
            />
            <div className="flex flex-col text-left gap-2 p-2 w-full font-quicksand">
              <h2 className="text-2xl font-bold capitalize">{selectedMatch.nom_utilisateur}</h2>
              <p className="text-white text-md uppercase tracking-wider">{selectedMatch.role}</p>
              <p className="text-white text-md">
                "{selectedMatch.biography || 'Aucune bio disponible.'}"
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <button
              type="button"
              onClick={() => handleSendMessage(selectedMatch.id)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <title>message</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              Message
            </button>
            <button
              type="button"
              onClick={() => handleDeleteMatch(selectedMatch.id)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <title>delete</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
