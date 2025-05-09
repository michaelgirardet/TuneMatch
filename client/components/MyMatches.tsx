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
      <h2 className="text-white text-2xl font-semibold mb-4">Mes Matchs</h2>
      <div className="relative">
        {/* Bouton gauche */}
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Défiler vers la gauche"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-charcoal bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2"
        >
          ‹
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth px-8"
          style={{ scrollBehavior: 'smooth' }}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              className="min-w-[180px] bg-space rounded-xl p-4 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center"
              title={`${match.nom_utilisateur} - ${match.role}`}
            >
              <Image
                src={match.photo_profil || '/default-avatar.jpg'}
                alt={match.nom_utilisateur}
                width={140}
                height={140}
                className="w-[180px] h-[180px] rounded-full object-cover mb-3"
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
                  className="bg-electric hover:bg-electrichover text-white px-3 py-1 rounded font-quicksand text-sm"
                  aria-label={`Envoyer un message à ${match.nom_utilisateur}`}
                  type="button"
                >
                  💬 Message
                </button>
                <button
                  onClick={() => handleDeleteMatch(match.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-quicksand text-sm"
                  aria-label={`Supprimer le match avec ${match.nom_utilisateur}`}
                  type="button"
                >
                  🗑️ Supprimer
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-charcoal bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2"
        >
          ›
        </button>
      </div>
    </section>
  );
}
