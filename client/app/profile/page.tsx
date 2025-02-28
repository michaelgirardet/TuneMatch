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
import { useState } from 'react';
import SocialLinksModal from '@/components/SocialLinksModal';
import GenreSelectionModal from '@/components/GenreSelectionModal';
import Biography from '@/components/Biography';

interface SocialLinks {
  youtube?: string;
  instagram?: string;
  soundcloud?: string;
}

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'youtube' | 'instagram' | 'soundcloud'>(
    'youtube'
  );
  const [genres, setGenres] = useState<string[]>(['Rock', 'Jazz', 'Soul']);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    youtube: 'https://www.youtube.com/',
    instagram: 'https://www.instagram.com/',
    soundcloud: 'https://soundcloud.com/',
  });

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
              className="w-12 cursor-pointer"
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
              className="w-12 cursor-pointer"
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
              className="w-12 cursor-pointer"
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
                  className="font-sulphur text-white bg-black p-2 rounded cursor-pointer"
                  onClick={() => setGenreModalOpen(true)}
                  onKeyDown={() => setGenreModalOpen(true)}
                >
                  {genre}
                </li>
              ))}
            </ul>
          </div>
          <h3 className="text-white p-5 font-bold text-2xl">Sacramento, USA</h3>
          <Biography />
        </div>
        <div className="player-div">
          <AudioPlayer />
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
    </main>
  );
}
