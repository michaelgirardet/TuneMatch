'use client';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import { useAuthStore } from '@/store/authStore';
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

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Charger les profils à découvrir
  useEffect(() => {
    async function loadProfiles() {
      setLoading(true);
      try {
        const res = await fetchWithAuth('http://localhost:5001/api/discover/users');
        if (!res.ok) throw new Error('Erreur lors du chargement des profils');
        const data = await res.json();
        setProfiles(data);
      } catch (e) {
        toast.error('Impossible de charger les profils à découvrir.');
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, []);

  // Action LIKE
  async function handleLike() {
    const likedId = profiles[current]?.id;
    if (!likedId) return;
    try {
      const res = await fetchWithAuth('http://localhost:5001/api/discover/like', {
        method: 'POST',
        body: JSON.stringify({ likedId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.match) {
        toast.success('🎉 Match musical ! Vous pouvez maintenant discuter ou collaborer.');
      } else {
        toast.info('👍 Profil liké !');
      }
      setCurrent((c) => c + 1);
    } catch {
      toast.error('Erreur lors du like.');
    }
  }

  // Action PASS
  async function handlePass() {
    setCurrent((c) => c + 1);
    // Optionnel : tu peux aussi POST vers /discover/pass pour analytics
  }

  if (loading) return <div className="text-white text-center">Chargement…</div>;
  if (profiles.length === 0 || current >= profiles.length)
    return (
      <div className="text-white text-center">Plus de profils à découvrir pour le moment.</div>
    );

  const profile = profiles[current];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-space rounded-2xl p-8 shadow-lg flex flex-col items-center w-full max-w-md">
        <Image
          src={profile.photo_profil || '/default-avatar.jpg'}
          alt={profile.nom_utilisateur}
          width={120}
          height={120}
          className="rounded-full object-cover mb-4"
        />
        <h2 className="text-white text-2xl font-bold mb-1">{profile.nom_utilisateur}</h2>
        <p className="text-lavender mb-2">
          {profile.role} · {profile.city} {profile.country && `· ${profile.country}`}
        </p>
        <p className="text-air mb-2">{profile.musical_style}</p>
        <p className="text-white mb-4 text-center">{profile.bio}</p>
        <div className="flex gap-8 mt-4">
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
      </div>
      <div className="mt-6 text-gray-400 text-sm">
        Profil {current + 1} sur {profiles.length}
      </div>
    </div>
  );
}
