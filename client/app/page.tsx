'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-primary-dark">
      <nav>
        <Navbar />
      </nav>

      <main
        className="flex-1 w-full px-4 flex flex-col justify-center items-center"
        id="page-accueil"
      >
        <div className="bg-green-200 home-sct flex flex-col justify-center max-w-[500px] gap-3">
          <h1 className="text-surface-light title font-quicksand text-5xl pb-10 text-center">
            Tune
            <span className="text-accent-violet">Match</span>
          </h1>
          <h2 className="font-montserrat text-surface-light">
            🎶 Connecte tes talents, crée ta musique !
          </h2>
          <p className="font-montserrat text-surface-light">
            Bienvenue sur TuneMatch, la plateforme où artistes et producteurs se rencontrent pour
            donner vie à de nouveaux projets musicaux. Trouve le bon collaborateur, partage tes sons
            et fais vibrer l'industrie avec tes créations.
          </p>
          <h2 className="font-montserrat text-surface-light">
            Prêt à faire matcher ta musique ? 🎧
          </h2>
          <Link href="/register" className="self-center">
            <button
              className="bg-accent-violet text-surface-white mt-5 w-[200px] py-6 px-12 rounded-lg text-lg font-medium tracking-wide border border-accent-violet font-sulphur shadow-lg transition"
              type="button"
            >
              Découvrir
            </button>
          </Link>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
