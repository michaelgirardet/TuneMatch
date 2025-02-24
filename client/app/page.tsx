'use client';
import Link from 'next/link';
import WhiteLogin from '../public/login-icon-wh.svg';
import WhiteRegister from '../public/register-icon-wh.svg';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <nav className="navbar">
        <nav>
          <ul>
            <li>
              <Link href="/register" className="text-white hover:text-gray-300">
                <Image
                  className="w-7"
                  src={WhiteRegister}
                  alt="utilisateur avec un plus"
                  aria-label="icon de navigation vers la page d'
                inscription"
                />
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white hover:text-gray-300">
                <Image
                  className="w-7"
                  src={WhiteLogin}
                  alt="utilisateur blanc"
                  aria-label="icon de navigation vers la page de connexion"
                />
              </Link>
            </li>
          </ul>
        </nav>
      </nav>
      <main className="flex-1 w-full px-4 flex flex-col justify-center items-center">
        <div className="home-sct flex flex-col justify-center max-w-[500px] gap-3">
          <h1 className="title font-quicksand text-5xl pb-10 text-center">TuneMatch</h1>
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
      <footer className="w-full py-4 text-center bg-gray-800 text-white">
        Copyright TuneMatch 2025
      </footer>
    </div>
  );
}
