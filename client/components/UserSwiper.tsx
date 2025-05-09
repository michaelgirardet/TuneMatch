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
    <div className="max-w-5xl h-full mx-auto bg-space rounded-2xl p-8 shadow-lg flex flex-col items-center">
      <Image
        src={profile.photo_profil || '/default-avatar.jpg'}
        alt={profile.nom_utilisateur}
        width={140}
        height={140}
        className="rounded-full object-cover mb-4"
        priority
      />
      <h2 className="text-white text-2xl font-bold mb-1">{profile.nom_utilisateur}</h2>
      <p className="text-lavender mb-2">
        {profile.role} · {profile.city} {profile.country && `· ${profile.country}`}
      </p>
      <p className="text-air mb-4">{profile.musical_style}</p>
      <p className="text-white text-center mb-6">{profile.bio}</p>
      <div className="flex gap-8">
        <button
          type="button"
          onClick={handlePass}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-full text-white text-lg"
          aria-label="Passer"
        >
          ❌
        </button>
        <button
          type="button"
          onClick={handleLike}
          className="bg-electric hover:bg-electrichover px-6 py-2 rounded-full text-white text-lg"
          aria-label="Like"
        >
          ❤️
        </button>
      </div>
      <div className="mt-6 text-gray-400 text-sm">
        Profil {currentIndex + 1} sur {profiles.length}
      </div>
    </div>
  );
}
