'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-oxford text-white">
      <div className="flex flex-col justify-center max-w-[500px] gap-3">
        <h1 className="font-bold font-quicksand text-5xl pb-10 text-center">
          Tune
          <span className="text-accent-violet text-air">Match</span>
        </h1>
        <h2 className="text-2xl">🎶 Connecte tes talents, crée ta musique !</h2>
        <p>
          Bienvenue sur TuneMatch, la plateforme où artistes et producteurs se rencontrent pour
          donner vie à de nouveaux projets musicaux. Trouve le bon collaborateur, partage tes sons
          et fais vibrer l'industrie avec tes créations.
        </p>
        <h2>Prêt à faire matcher ta musique ? 🎧</h2>
        <Link href="/register" className="self-center">
          <button
            className="bg-electric hover:bg-electrichover mt-5 w-[200px] py-6 px-12 rounded-lg text-lg font-medium tracking-wide shadow-lg transition"
            type="button"
          >
            Découvrir
          </button>
        </Link>
      </div>
    </div>
  );
}
