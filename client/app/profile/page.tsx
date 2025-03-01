'use client';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import LogoYT from '@/public/yt-icon-wh.png';
import LogoIG from '@/public/instagram-new.png';
import LogoSoundClound from '@/public/soundcloud-removebg-preview.png';
import AudioPlayer from '@/components/AudioPlayer';
import ProfilePhoto from '@/components/ProfilePhoto';
import { useState, useEffect } from 'react';
import SocialLinksModal from '@/components/SocialLinksModal';
import GenreSelectionModal from '@/components/GenreSelectionModal';
import Biography from '@/components/Biography';
import AddTrackModal from '@/components/AddTrackModal';
import { ToasterError, ToasterSuccess } from '@/components/Toast';
import Location from '@/components/Location';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

interface SocialLinks {
  youtube?: string;
  instagram?: string;
  soundcloud?: string;
}

export default function Profile() {
  const { user, updateUser, token } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'youtube' | 'instagram' | 'soundcloud'>('youtube');
  const [genres, setGenres] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    youtube: 'https://www.youtube.com/',
    instagram: 'https://www.instagram.com/',
    soundcloud: 'https://soundcloud.com/',
  });
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);

  const handlePhotoUpdate = (url: string) => {
    if (user) {
      updateUser({ ...user, photo_profil: url });
    }
  };

  const handleSocialLinkClick = (platform: 'youtube' | 'instagram' | 'soundcloud') => {
    setSelectedPlatform(platform);
    setModalOpen(true);
  };

  const handleUpdateLinks = (newLinks: SocialLinks) => {
    setSocialLinks(newLinks);
  };

  const handleUpdateGenres = (newGenres: string[]) => {
    setGenres(newGenres);
  };

  const handleAddTrack = () => {
    setIsAddTrackModalOpen(true);
  };

  const handleTrackSubmit = async (trackData: { title: string; artist: string; url: string }) => {
    try {
      const response = await fetch('http://localhost:5001/api/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trackData),
      });

      if (response.ok) {
        const newTrack = await response.json();
        setTracks([...tracks, newTrack]);
        ToasterSuccess('Morceau ajouté avec succès !');
      } else {
        const error = await response.json();
        ToasterError(error.message || "Erreur lors de l'ajout du morceau");
      }
    } catch (error) {
      ToasterError('Erreur lors de la connexion au serveur');
      console.error(error);
    }
  };

  const handleDeleteTrack = async (trackId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce morceau ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/tracks/${trackId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTracks(tracks.filter((track) => track.id !== trackId));
        ToasterSuccess('Morceau supprimé avec succès !');
      } else {
        const error = await response.json();
        ToasterError(error.message || 'Erreur lors de la suppression du morceau');
      }
    } catch (error) {
      ToasterError('Erreur lors de la connexion au serveur');
      console.error(error);
    }
  };

  // Charger les morceaux au montage du composant
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/tracks', {
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
      }
    };

    if (token) {
      fetchTracks();
    }
  }, [token]);

  // Mettre à jour les genres quand l'utilisateur change
  useEffect(() => {
    if (user?.genres_musicaux) {
      setGenres(user.genres_musicaux.split(','));
    }
  }, [user?.genres_musicaux]);

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-10 gap-5">
        <ProfilePhoto currentPhotoUrl={user?.photo_profil} onPhotoUpdate={handlePhotoUpdate} />
        <h1 className="title font-sulphur font-bold text-5xl capitalize">
          {user?.nom_utilisateur}
        </h1>
        <p className="font-sulphur capitalize">{user?.role}</p>
        <div className="flex flex-row gap-2">
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
            <Image
              src={LogoYT}
              className="w-[60px] h-[auto] cursor-pointer"
              alt="Logo Youtube"
              aria-label="Modifier le lien YouTube"
              onClick={(e) => {
                e.preventDefault();
                handleSocialLinkClick('youtube');
              }}
            />
          </a>
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
            <Image
              src={LogoIG}
              className="w-[60px] h-[auto] cursor-pointer"
              alt="Logo Instagram"
              aria-label="Modifier le lien Instagram"
              onClick={(e) => {
                e.preventDefault();
                handleSocialLinkClick('instagram');
              }}
            />
          </a>
          <a href={socialLinks.soundcloud} target="_blank" rel="noopener noreferrer">
            <Image
              src={LogoSoundClound}
              className="w-[60px] h-[auto] cursor-pointer"
              alt="Logo Soundcloud"
              aria-label="Modifier le lien Soundcloud"
              onClick={(e) => {
                e.preventDefault();
                handleSocialLinkClick('soundcloud');
              }}
            />
          </a>
        </div>
        <div>
          <div className="flex flex-row justify-center items-center md:flex-col relative md:gap-5">
            <ul className="flex gap-5 justify-center items-center flex-wrap">
              {genres.map((genre) => (
                <li
                  key={genre}
                  className="font-sulphur text-[#F2F6FF] bg-[#0A0A0A] p-2 rounded cursor-pointer"
                  onClick={() => setGenreModalOpen(true)}
                  onKeyDown={() => setGenreModalOpen(true)}
                >
                  {genre}
                </li>
              ))}
            </ul>
          </div>
          <Location />
          <Biography />
        </div>
        <div className="w-full max-w-2xl px-4">
          <AudioPlayer
            tracks={tracks}
            onAddTrack={handleAddTrack}
            onDeleteTrack={handleDeleteTrack}
          />
        </div>
      </div>
      <Footer />
      <SocialLinksModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdateLinks}
        currentLinks={socialLinks}
        platform={selectedPlatform}
      />
      <GenreSelectionModal
        isOpen={genreModalOpen}
        onClose={() => setGenreModalOpen(false)}
        onUpdate={handleUpdateGenres}
        currentGenres={genres}
      />
      <AddTrackModal
        isOpen={isAddTrackModalOpen}
        onClose={() => setIsAddTrackModalOpen(false)}
        onAdd={handleTrackSubmit}
      />
    </main>
  );
}
