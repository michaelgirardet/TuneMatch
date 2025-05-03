'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToasterError } from '@/components/Toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import LogoYT from '@/public/yt-icon-wh.png';
import LogoIG from '@/public/instagram-new.png';
import LogoSoundClound from '@/public/soundcloud-removebg-preview.png';
import AudioPlayer from '@/components/AudioPlayer';
import Link from 'next/link';

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

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

export default function PublicProfile() {
  const { token } = useAuthStore();
  const params = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du profil');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Erreur:', error);
        <ToasterError message="Erreur lors du chargement du profil" />;
      }
    };

    const fetchUserTracks = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/tracks/user/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTracks(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des morceaux:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && params.id) {
      fetchProfile();
      fetchUserTracks();
    }
  }, [token, params.id]);

  if (loading || !profile) {
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
    <div className="flex flex-col items-center justify-center flex-1 bg-oxford">
      <div>
        <Link href="/search">
          <ArrowLeftIcon className="h-8 w-8 text-gray-200 mb-5" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center py-10 gap-5">
        {profile.photo_profil ? (
          <Image
            src={profile.photo_profil}
            alt={profile.nom_utilisateur}
            width={120}
            height={120}
            className="rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.jpg';
            }}
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-[#51537B] flex items-center justify-center text-[#f3f3f7] text-4xl font-bold">
            {profile.nom_utilisateur[0].toUpperCase()}
          </div>
        )}

        <h1 className="title font-sulphur font-bold text-5xl capitalize">
          {profile.nom_utilisateur}
        </h1>
        <p className="font-sulphur capitalize">{profile.role}</p>

        {(profile.youtube_link || profile.instagram_link || profile.soundcloud_link) && (
          <div className="flex flex-row gap-2">
            {profile.youtube_link && (
              <a href={profile.youtube_link} target="_blank" rel="noopener noreferrer">
                <Image src={LogoYT} className="w-[60px] h-[auto]" alt="Logo Youtube" />
              </a>
            )}
            {profile.instagram_link && (
              <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer">
                <Image src={LogoIG} className="w-[60px] h-[auto]" alt="Logo Instagram" />
              </a>
            )}
            {profile.soundcloud_link && (
              <a href={profile.soundcloud_link} target="_blank" rel="noopener noreferrer">
                <Image src={LogoSoundClound} className="w-[60px] h-[auto]" alt="Logo Soundcloud" />
              </a>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 max-w-2xl px-4">
          {profile.genres_musicaux && (
            <div className="flex flex-wrap gap-2 justify-center">
              {profile.genres_musicaux.split(',').map((genre) => (
                <span key={genre} className="font-sulphur text-[#f3f3f7] bg-[#101119] p-2 rounded">
                  {genre.trim()}
                </span>
              ))}
            </div>
          )}

          {(profile.city || profile.country) && (
            <p className="text-gray-400 font-sulphur">
              {[profile.city, profile.country].filter(Boolean).join(', ')}
            </p>
          )}

          {profile.biography && (
            <p className="text-[#f3f3f7] font-montserrat text-center whitespace-pre-wrap">
              {profile.biography}
            </p>
          )}

          {tracks.length > 0 && (
            <div className="w-full max-w-2xl mt-8">
              <h2 className="text-2xl font-quicksand font-bold mb-4 text-center">Morceaux</h2>
              <AudioPlayer tracks={tracks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
