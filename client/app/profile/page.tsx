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

export default function Profile() {
  const { user, updateUser } = useAuthStore();

  const handlePhotoUpdate = (url: string) => {
    if (user) {
      updateUser({ ...user, photo_profil: url });
    }
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
          <Image
            src={LogoYT}
            className="w-12 cursor-pointer"
            alt="Logo Youtube"
            aria-label="Redirection vers youtube"
          />
          <Image
            src={LogoIG}
            className="w-12 cursor-pointer"
            alt="Logo Instagram"
            aria-label="Redirection vers Instagram"
          />
          <Image
            src={LogoSoundClound}
            className="w-12 cursor-pointer"
            alt="Logo Youtube"
            aria-label="Redirection vers youtube"
          />
        </div>
        <div>
          <ul className="flex gap-5 justify-center items-center">
            <li className="font-sulphur text-white bg-black p-2 rounded">Rock</li>
            <li className="font-sulphur text-white bg-black p-2 rounded">Jazz</li>
            <li className="font-sulphur text-white bg-black p-2 rounded">Soul</li>
          </ul>
          <h3 className="text-white p-5 font-bold text-2xl">Sacramento, USA</h3>
          <p className="font-montserrat p-5 bg-[#1d1e2c] m-5 rounded-[8px]">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut unde, nobis culpa
            quibusdam deleniti adipisci dicta quasi mollitia enim perspiciatis earum aliquid
            quisquam eum debitis totam id quas, eos atque porro facere praesentium veritatis illo.
            Nisi, quaerat eum, in laboriosam quidem sapiente aliquid ut nihil tempore voluptas,
            iusto dolor ad?
          </p>
        </div>
        <div className="player-div">
          <AudioPlayer />
        </div>
      </div>
      <Footer />
    </main>
  );
}
