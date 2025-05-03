'use client';
import { useAuthStore } from '@/store/authStore';
import ProfilePhoto from '@/components/ProfilePhoto';
import SocialLinksModal from '@/components/SocialLinksModal';
import GenreSelectionModal from '@/components/GenreSelectionModal';
import Biography from '@/components/Biography';
import AddTrackModal from '@/components/AddTrackModal';
import AudioPlayer from '@/components/AudioPlayer';
import Location from '@/components/Location';
import Image from 'next/image';
import LogoYT from '@/public/yt-icon-wh.png';
import LogoIG from '@/public/instagram-new.png';
import LogoSoundClound from '@/public/soundcloud-removebg-preview.png';

export default function Profile() {
  const { user } = useAuthStore();
  // ...States et handlers comme dans ta version

  return (
    <div className="flex flex-col min-h-screen bg-oxford">
      {/* Profil Card */}
      <section className="w-[100vw] md:w-[55vw] mx-auto px-6 py-8 flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center gap-3 bg-space rounded-2xl p-8 shadow-lg w-full">
          <ProfilePhoto currentPhotoUrl={user?.photo_profil} onPhotoUpdate={() => {}} />
          <h2 className="text-3xl font-bold font-quicksand text-white">{user?.nom_utilisateur}</h2>
          <p className="text-sm text-wite uppercase tracking-wider">{user?.role}</p>
          {/* Social Links */}
          <div className="flex gap-6 justify-center mt-4">
            {[
              { platform: 'youtube', icon: LogoYT, link: user?.youtube_link },
              { platform: 'instagram', icon: LogoIG, link: user?.instagram_link },
              { platform: 'soundcloud', icon: LogoSoundClound, link: user?.soundcloud_link },
            ].map(({ platform, icon, link }) => (
              <a
                key={platform}
                href={link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="transition transform hover:scale-110 hover:ring-2 ring-[#51537B] rounded-lg p-2 bg-[#1a1a2f]"
              >
                <Image src={icon} alt={`${platform} logo`} className="w-[40px] h-[40px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Section Infos Profil */}
        <section className="bg-space w-full rounded-2xl p-8 shadow-lg flex flex-col gap-8">
          {/* Genres musicaux */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-white">Genres musicaux</h3>
              <button
                type="button"
                className="text-sm text-lavender hover:text-white underline"
                // onClick={() => ...}
              >
                Modifier
              </button>
            </div>
            <ul className="flex flex-wrap gap-3">
              {/* genres.map(...) */}
              <li className="bg-[#32334E] text-white px-3 py-1 rounded-full text-sm">Rock</li>
              <li className="bg-[#32334E] text-white px-3 py-1 rounded-full text-sm">Pop</li>
              {/* ... */}
            </ul>
          </div>

          {/* Localisation */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-white">Localisation</h3>
              <button
                type="button"
                className="text-sm text-lavender hover:text-white underline"
                // onClick={() => ...
              >
                Modifier
              </button>
            </div>
            <Location />
          </div>

          {/* Biographie */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-white">Biographie</h3>
              <button
                type="button"
                className="text-sm text-lavender hover:text-white underline"
                // onClick={() => ...}
              >
                Modifier
              </button>
            </div>
            <Biography />
          </div>
        </section>

        {/* Audio Tracks */}
        <div className="w-full max-w-2xl px-4">
          <AudioPlayer tracks={[]} onAddTrack={() => {}} onDeleteTrack={() => {}} />
        </div>
      </section>

      {/* Modals (à brancher sur tes handlers) */}
      <SocialLinksModal
        isOpen={false} // Replace with your state variable controlling modal visibility
        onClose={() => {}} // Replace with your handler for closing the modal
        onUpdate={(_updatedLinks) => {}} // Replace with your handler for updating links
        currentLinks={user?.social_links || []} // Replace with the current social links from your data
        platform="youtube" // Replace with the appropriate platform or make it dynamic
      />
      <GenreSelectionModal
        isOpen={false} // Replace with your state variable controlling modal visibility
        onClose={() => {}} // Replace with your handler for closing the modal
        onUpdate={(updatedGenres) => {}} // Replace with your handler for updating genres
        currentGenres={[]} // Replace with the current genres from your data
      />
      <AddTrackModal
        isOpen={false} // Replace with your state variable controlling modal visibility
        onClose={() => {}} // Replace with your handler for closing the modal
        onAdd={(newTrack) => {}} // Replace with your handler for adding a new track
      />
    </div>
  );
}
