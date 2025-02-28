'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <nav>
        <Navbar />
      </nav>
      <main className="flex-1 w-full px-4 flex flex-col justify-center items-center">
        <div className="home-sct flex flex-col justify-center max-w-[500px] gap-3">
          <h1 className="text-[#F2F6FF] title font-quicksand text-5xl pb-10 text-center">
            Tune<span className="text-[#a71666]">Match</span>
          </h1>
          <h2 className="font-montserrat">🎶 Connecte tes talents, crée ta musique !</h2>
          <p className="font-montserrat">
            Bienvenue sur TuneMatch, la plateforme où artistes et producteurs se rencontrent pour
            donner vie à de nouveaux projets musicaux. Trouve le bon collaborateur, partage tes sons
            et fais vibrer l'industrie avec tes créations.
          </p>
          <h2 className="font-montserrat">Prêt à faire matcher ta musique ? 🎧</h2>
          <button className="button mt-5 w-[200px] self-center" type="button">
            Découvrir
          </button>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
