'use client';

import { useEffect, useState, useRef } from 'react';
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
  musical_style?: string;
  bio?: string;
}

export default function MyMatches() {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const res = await fetchWithAuth('http://localhost:5001/api/discover/matches');
        if (!res.ok) throw new Error('Erreur lors du chargement des matchs');
        const data = await res.json();
        setMatches(data);
      } catch (error) {
        toast.error('Impossible de charger vos matchs.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  // Scroll carousel à gauche
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Scroll carousel à droite
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Envoyer un message (exemple : redirection vers page chat)
  const handleSendMessage = (matchId: number) => {
    // Par exemple, rediriger vers /chat/[matchId]
    window.location.href = `/messages/${matchId}`;
  };

  // Supprimer un match
  const handleDeleteMatch = async (matchId: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce match ?')) return;

    try {
      const res = await fetchWithAuth(`http://localhost:5001/api/discover/matches/${matchId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression du match');

      toast.success('Match supprimé avec succès.');
      // Met à jour la liste localement
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
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
    <section className="mt-12">
      <div className="relative w-full">
        {/* Bouton gauche */}
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Défiler vers la gauche"
          className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-charcoal p-2 rounded-full bg-opacity-70 hover:bg-opacity-90 text-white"
        >
          ❮
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="carousel w-full h-full flex px-16 justify-center items-center"
          style={{ scrollBehavior: 'smooth' }}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              className="carousel-item min-w-[10vw] bg-space rounded-xl shadow-lg p-6 flex-shrink-0 cursor-pointer flex flex-col items-center"
              title={`${match.nom_utilisateur} - ${match.role}`}
            >
              <Image
                src={match.photo_profil || '/default-avatar.jpg'}
                alt={match.nom_utilisateur}
                width={160}
                height={160}
                className="w-[160px] h-[160px] rounded-full object-cover mb-3 border-4 border-white shadow"
                priority
              />
              <h3 className="text-white font-semibold text-lg truncate capitalize font-quicksand text-center">
                {match.nom_utilisateur}
              </h3>
              <p className="text-lavender text-sm truncate font-quicksand text-center">
                {match.role}
              </p>
              <p className="text-air text-xs truncate font-quicksand text-white text-center mt-2">
                {match.city}
                {match.country ? `, ${match.country}` : ''}
              </p>

              {/* Boutons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleSendMessage(match.id)}
                  className="btn btn-primary rounded-md p-2 bg-blue-600 hover:bg-blue-500 text-white font-quicksand flex gap-1 items-center"
                  aria-label={`Envoyer un message à ${match.nom_utilisateur}`}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <title>message icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                  Message
                </button>
                <button
                  onClick={() => handleDeleteMatch(match.id)}
                  className="btn btn-primary rounded-md p-2 bg-red-600 hover:bg-red-500 text-white font-quicksand flex gap-1 items-center"
                  aria-label={`Supprimer le match avec ${match.nom_utilisateur}`}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <title>delete icon</title>
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
          ))}
        </div>

        {/* Bouton droit */}
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Défiler vers la droite"
          className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-charcoal bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full text-white"
        >
          ❯
        </button>
      </div>
    </section>
  );
}
