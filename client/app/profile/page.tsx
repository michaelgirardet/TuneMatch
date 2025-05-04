'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import ProfilePhoto from '@/components/ProfilePhoto';
import GenreSelectionModal from '@/components/GenreSelectionModal';
import Biography from '@/components/Biography';
import LocationModal from '@/components/LocationModal';
import AudioPlayer from '@/components/AudioPlayer';
import AddTrackModal from '@/components/AddTrackModal';
import Image from 'next/image';
import LogoIG from '@/public/instagram-new.png';
import LogoSoundCloud from '@/public/soundcloud-removebg-preview.png';
import LogoYT from '@/public/yt-icon-wh.png';
import BiographyModal from '@/components/Biography';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Modals state
  const [isGenreModalOpen, setGenreModalOpen] = useState(false);
  const [isBioModalOpen, setBioModalOpen] = useState(false);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isTrackModalOpen, setTrackModalOpen] = useState(false);

  // Tracks state (à remplacer par un fetch réel si besoin)
  const [tracks, setTracks] = useState<{ id: number }[]>(
    Array.isArray(user?.tracks) ? user.tracks : []
  );

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-oxford text-white text-2xl">
        Veuillez vous connecter pour accéder à votre profil.
      </div>
    );
  }

  // --- Handlers pour update (à brancher à tes modales) ---
  async function handleUpdateGenres(newGenres: string[]) {
    const response = await fetch('http://localhost:5001/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ genres_musicaux: newGenres.join(',') }),
    });
    const json = await response.json();
    if (response.ok && json.user) {
      updateUser(json.user);
      setGenreModalOpen(false);
    }
  }

  async function handleUpdateBio(newBio: string) {
    const response = await fetch('http://localhost:5001/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ biography: newBio }),
    });
    const json = await response.json();
    if (response.ok && json.user) {
      updateUser(json.user);
      setBioModalOpen(false);
    }
  }

  async function handleUpdateLocation(location: { city: string; country: string }) {
    const response = await fetch('http://localhost:5001/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ city: location.city, country: location.country }),
    });
    const json = await response.json();
    if (response.ok && json.user) {
      updateUser(json.user);
      setLocationModalOpen(false);
    }
  }

  // // Tracks (ajout/suppression)
  async function handleAddTrack(newTrack: string) {
    // Appel API pour ajouter le track, puis maj localement
    setTracks([...tracks, { id: Date.now(), ...(typeof newTrack === 'object' ? newTrack : {}) }]);
    setTrackModalOpen(false);
  }
  async function handleDeleteTrack(trackId: number) {
    // Appel API pour supprimer, puis maj localement
    setTracks(tracks.filter((t: { id: number }) => t.id !== trackId));
  }

  // --- Affichage ---
  return (
    <div className="flex flex-col min-h-screen bg-oxford">
      {/* Profil Card */}
      <section className="w-[100vw] md:w-[55vw] mx-auto px-6 py-8 flex flex-col gap-8 items-center" />
      <div className="flex flex-col items-center gap-3 bg-space p-8 shadow-lg w-full">
        <ProfilePhoto currentPhotoUrl={user.photo_profil} onPhotoUpdate={() => {}} />
        <h2 className="text-3xl font-bold font-quicksand text-white">{user.nom_utilisateur}</h2>
        <p className="text-sm text-white uppercase tracking-wider">{user.role}</p>
        {/* Réseaux sociaux */}
        <div className="flex gap-6 justify-center mt-4">
          {[
            { platform: 'youtube', icon: LogoYT, link: user.youtube_link },
            { platform: 'instagram', icon: LogoIG, link: user.instagram_link },
            { platform: 'soundcloud', icon: LogoSoundCloud, link: user.soundcloud_link },
          ].map(
            ({ platform, icon, link }) =>
              link && (
                <a
                  key={platform}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition transform hover:scale-110 hover:ring-2 ring-[#51537B] rounded-lg p-2 bg-[#1a1a2f]"
                >
                  <Image src={icon} alt={`${platform} logo`} width={40} height={40} />
                </a>
              )
          )}
        </div>
      </div>

      {/* Infos Profil */}
      <section className="bg-space w-full p-8 shadow-lg flex flex-col gap-8">
        {/* Genres musicaux */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-white">Genres musicaux</h3>
            <button
              type="button"
              className="text-sm text-lavender hover:text-white underline"
              onClick={() => setGenreModalOpen(true)}
            >
              Modifier
            </button>
          </div>
          <ul className="flex flex-wrap gap-3">
            {user.genres_musicaux ? (
              user.genres_musicaux.split(',').map((genre) => (
                <li key={genre} className="bg-[#32334E] text-white px-3 py-1 rounded-full text-sm">
                  {genre}
                </li>
              ))
            ) : (
              <li className="text-white">Non renseigné</li>
            )}
          </ul>
        </div>
        {/* Localisation */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-white">Localisation</h3>
            <button
              type="button"
              className="text-sm text-lavender hover:text-white underline"
              onClick={() => setLocationModalOpen(true)}
            >
              Modifier
            </button>
          </div>
          <p className="text-white">
            {user.city || 'Ville inconnue'}, {user.country || 'Pays inconnu'}
          </p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-white">Biographie</h3>
            <button
              type="button"
              className="text-sm text-lavender hover:text-white underline"
              onClick={() => setBioModalOpen(true)}
            >
              Modifier
            </button>
          </div>
          <p className="text-white">{user.biography || 'Aucune biographie pour le moment.'}</p>
        </div>

        {/* Audio Tracks */}
        <div className="flex items-center justify-center px-4">
          <AudioPlayer
            tracks={tracks}
            onAddTrack={() => setTrackModalOpen(true)}
            onDeleteTrack={handleDeleteTrack}
          />
        </div>
      </section>
      {/* 

{/* Modals */}
      <GenreSelectionModal
        isOpen={isGenreModalOpen}
        onClose={() => setGenreModalOpen(false)}
        onUpdate={handleUpdateGenres}
        currentGenres={user.genres_musicaux ? user.genres_musicaux.split(',') : []}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onUpdate={handleUpdateLocation}
        currentLocation={{
          city: user.city || '',
          country: user.country || '',
        }}
      />
      <BiographyModal
        isOpen={isBioModalOpen}
        onClose={() => setBioModalOpen(false)}
        onUpdate={handleUpdateBio}
        currentBio={user.biography}
      />
      <AddTrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        onAdd={handleAddTrack}
      />
    </div>
  );
}
