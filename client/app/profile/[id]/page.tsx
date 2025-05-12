'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import { Stars } from '@/components/Stars';
import { ReviewForm } from '@/components/ReviewForm';
import AudioPlayer from '@/components/AudioPlayer';
import LogoIG from '@/public/instagram-new.png';
import LogoSoundClound from '@/public/soundcloud-removebg-preview.png';
import LogoYT from '@/public/yt-icon-wh.png';

// Interfaces pour le typage fort
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

interface Review {
  id: number;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer_name: string;
  reviewer_photo?: string;
}

export default function PublicProfile() {
  const { token, user } = useAuthStore();
  const params = useParams();

  // Centralisation des états
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [reviewsData, setReviewsData] = useState<{
    averageRating: number;
    reviewCount: number;
    reviews: Review[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user?.id === Number(params.id);

  // Fonction de fetch réutilisable
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:5001/api/reviews/${params.id}`);
      if (!res.ok) throw new Error('Erreur chargement avis');
      const data = await res.json();
      setReviewsData(data);
    } catch (err) {
      console.error(err);
    }
  }, [params.id]);

  // Chargement des données (profil, tracks, avis) en parallèle
  useEffect(() => {
    if (!token || !params.id) return;

    setLoading(true);
    Promise.all([
      fetchWithAuth(`http://localhost:5001/api/users/${params.id}`),
      fetchWithAuth(`http://localhost:5001/api/tracks/user/${params.id}`),
      fetchWithAuth(`http://localhost:5001/api/reviews/${params.id}`),
    ])
      .then(async ([profileRes, tracksRes, reviewsRes]) => {
        if (!profileRes.ok) throw new Error('Erreur chargement profil');
        if (!tracksRes.ok) throw new Error('Erreur chargement morceaux');
        if (!reviewsRes.ok) throw new Error('Erreur chargement avis');

        const profileData = await profileRes.json();
        const tracksData = await tracksRes.json();
        const reviewsData = await reviewsRes.json();

        setProfile(profileData);
        setTracks(Array.isArray(tracksData) ? tracksData : tracksData.tracks || []);
        setReviewsData(reviewsData);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Erreur lors du chargement des données');
      })
      .finally(() => setLoading(false));
  }, [token, params.id]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-raisin">
      <div>
        <Link href="/search">
          <ArrowLeftIcon className="h-8 w-8 text-white mb-5" />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center py-10 gap-5">
        {profile?.photo_profil ? (
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
          <div className="w-[120px] h-[120px] rounded-full bg-charcoal flex items-center justify-center text-white text-4xl font-bold">
            {profile?.nom_utilisateur[0].toUpperCase()}
          </div>
        )}

        <h1 className="title font-quicksand font-semibold text-5xl capitalize text-lavender">
          {profile?.nom_utilisateur}
        </h1>
        <p className="font-quicksand capitalize text-white">{profile?.role}</p>

        {(profile?.youtube_link || profile?.instagram_link || profile?.soundcloud_link) && (
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
          {profile?.genres_musicaux && (
            <div className="flex flex-wrap gap-2 justify-center">
              {profile.genres_musicaux.split(',').map((genre) => (
                <span key={genre} className="font-quicksand text-white bg-[#101119] p-2 rounded">
                  {genre.trim()}
                </span>
              ))}
            </div>
          )}

          {(profile?.city || profile?.country) && (
            <p className="font-quicksand text-white">
              {[profile.city, profile.country].filter(Boolean).join(', ')}
            </p>
          )}

          {profile?.biography && (
            <p className="text-white font-quicksand text-center whitespace-pre-wrap">
              {profile.biography}
            </p>
          )}

          {reviewsData && (
            <div className="my-4 flex flex-col items-center">
              <Stars rating={reviewsData.averageRating} />
              <p className="text-gray-400 text-sm mt-1">{reviewsData.reviewCount} avis</p>
            </div>
          )}

          {!isOwnProfile && user && (
            <ReviewForm
              reviewedId={Number(params.id)}
              onReviewSubmitted={fetchReviews} // <-- on utilise fetchReviews
            />
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
