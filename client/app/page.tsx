'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-[80vh] flex flex-col justify-center items-center bg-space text-white px-4 py-8 md:py-0 font-quicksand">
      <div className="w-full max-w-[500px] flex flex-col gap-6">
        <h1 className="font-bold font-quicksand text-4xl md:text-5xl pb-6 md:pb-10 text-center">
          Tune
          <span className="text-[#B35CFF]">Match</span>
        </h1>
        <div className="px-0 md:px-3 flex flex-col gap-4">
          <h2 className="md:text-2xl xl:text-4xl text-center font-semibold">
            Connecte tes talents, crée ta musique !
          </h2>
          <p className="md:text-xl text-center">
            Bienvenue sur TuneMatch, la plateforme où artistes et producteurs se rencontrent pour
            donner vie à de nouveaux projets musicaux. Trouve le bon collaborateur, partage tes sons
            et fais vibrer l&apos;industrie avec tes créations.
          </p>
          <h2 className="text-lg xl:text-2xl text-lavender text-center mt-2 md:mt-4">
            Prêt à faire matcher ta musique ?
          </h2>
        </div>
        <Link
          href="/register"
          className="flex justify-center items-center self-center w-full md:w-auto"
        >
          <button
            className="btn btn-wide bg-electric hover:bg-electrichover font-semibold px-10 md:px-20 py-5 md:py-10 mt-12 rounded-lg flex items-center justify-center self-center gap-5"
            type="button"
          >
            Découvrir
          </button>
        </Link>
      </div>
    </div>
  );
}
