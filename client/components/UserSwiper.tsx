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
  musical_style?: string;
  bio?: string;
}

export default function UserSwiper() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Charger les profils à découvrir
  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true);
      try {
        const res = await fetchWithAuth('http://localhost:5001/api/discover/users');
        if (!res.ok) throw new Error('Erreur lors du chargement des profils');
        const data = await res.json();
        setProfiles(data);
      } catch (error) {
        toast.error('Impossible de charger les profils à découvrir.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  // Passer au profil suivant
  const nextProfile = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  // Action "Like"
  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;
    const likedId = profiles[currentIndex].id;
    try {
      const res = await fetchWithAuth('http://localhost:5001/api/discover/like', {
        method: 'POST',
        body: JSON.stringify({ likedId }),
      });
      if (!res.ok) throw new Error('Erreur lors du like');
      const data = await res.json();
      if (data.match) {
        toast.success('🎉 Match musical ! Vous pouvez maintenant discuter ou collaborer.');
      } else {
        toast.info('👍 Profil liké !');
      }
      nextProfile();
    } catch (error) {
      toast.error('Erreur lors du like.');
      console.error(error);
    }
  };

  // Action "Pass"
  const handlePass = () => {
    nextProfile();
  };

  if (loading) {
    return <div className="text-white text-center py-20">Chargement des profils...</div>;
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="text-white text-center py-20">
        Plus de profils à découvrir pour le moment.
      </div>
    );
  }

  const profile = profiles[currentIndex];

  return (
    <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] h-full bg-space rounded-md p-2 shadow-xl flex flex-col items-center justify-center self-center">
      <Image
        src={profile.photo_profil || '/default-avatar.jpg'}
        alt={profile.nom_utilisateur}
        width={140}
        height={140}
        className="w-full mb-4"
        priority
      />
      <h2 className="text-white text-2xl font-bold mb-1">{profile.nom_utilisateur}</h2>
      <p className="text-lavender mb-2 bg-oxford rounded-full p-2">{profile.role}</p>
      <p className="text-air mb-4">{profile.musical_style}</p>
      <p className="text-white text-center mb-6">{profile.bio}</p>
      <div className="flex gap-8">
        <button
          type="button"
          onClick={handlePass}
          className="btn bg-charcoal hover:bg-charcoalhover px-6 py-6 flex items-center gap-2 rounded-lg text-white font-semibold"
          aria-label="Passer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <title>skip</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          type="button"
          className="btn bg-red-500 hover:bg-red-400 px-6 py-6 flex items-center gap-2 rounded-lg text-white font-semibold"
          onClick={handleLike}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <title>like</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>
      <div className="mt-6 text-gray-400 text-sm">
        Profil {currentIndex + 1} sur {profiles.length}
      </div>
    </div>
  );
}
