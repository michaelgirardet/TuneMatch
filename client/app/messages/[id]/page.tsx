'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface UserProfile {
  id: number;
  nom_utilisateur: string;
  role: string;
  photo_profil?: string;
  biography?: string;
  genres_musicaux?: string;
  youtube_link?: string;
  instagram_link?: string;
  soundcloud_link?: string;
  city?: string;
  country?: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Adapte l'URL selon ton API
        const res = await fetchWithAuth(`http://localhost:5001/api/users/${params.id}`);
        if (!res.ok) throw new Error('Erreur lors du chargement du profil');
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        toast.error('Impossible de charger le profil.');
        router.push('/404');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProfile();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-white">
        Chargement du profil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-white">
        Profil introuvable.
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center py-12 px-4 bg-oxford min-h-screen">
      <div className="bg-space rounded-2xl shadow-xl p-8 max-w-2xl w-full flex flex-col items-center">
        <div className="relative">
          <Image
            src={profile.photo_profil || '/default-avatar.jpg'}
            alt={profile.nom_utilisateur}
            width={160}
            height={160}
            className="rounded-full border-4 border-[#212936] shadow-lg object-cover"
            priority
          />
          <span className="absolute bottom-2 right-2 bg-electric text-white px-3 py-1 rounded-full text-xs font-semibold">
            {profile.role}
          </span>
        </div>
        <h1 className="text-white text-3xl font-bold mt-6 mb-2 capitalize font-quicksand text-center">
          {profile.nom_utilisateur}
        </h1>
        <p className="text-lavender text-base mb-3 text-center">
          {profile.city}
          {profile.city && profile.country ? ', ' : ''}
          {profile.country}
        </p>
        {profile.genres_musicaux && (
          <div className="mb-4">
            <span className="bg-[#2a344a] text-air px-3 py-1 rounded-full text-xs font-quicksand">
              {profile.genres_musicaux}
            </span>
          </div>
        )}
        {profile.biography && (
          <p className="text-white text-center mb-6 whitespace-pre-line">{profile.biography}</p>
        )}

        {/* Réseaux sociaux */}
        <div className="flex gap-5 mt-4">
          {profile.youtube_link && (
            <a
              href={profile.youtube_link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="YouTube"
            >
              <Image src="/icons/youtube.svg" alt="YouTube" width={32} height={32} />
            </a>
          )}
          {profile.instagram_link && (
            <a
              href={profile.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="Instagram"
            >
              <Image src="/icons/instagram.svg" alt="Instagram" width={32} height={32} />
            </a>
          )}
          {profile.soundcloud_link && (
            <a
              href={profile.soundcloud_link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="SoundCloud"
            >
              <Image src="/icons/soundcloud.svg" alt="SoundCloud" width={32} height={32} />
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
