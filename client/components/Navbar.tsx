'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import LogoBurger from '@/public/sliders-icon-wh.svg';
import CloseIcon from '@/public/xmark-wh.svg';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const [isBurger, setIsBurger] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleBuger = () => {
    setIsBurger(!isBurger);
  };

  return (
    <nav className="bg-[#1d1e2c] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-white text-xl font-bold ml-2 font-quicksand">TuneMatch</span>
        </Link>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Image
                src={LogoBurger}
                alt="logo du burger menu"
                onClick={handleBuger}
                onKeyDown={handleBuger}
                className="w-7"
              />
              {isBurger && (
                <div className="absolute top-0 right-0 w-[100vw] h-[100vh] flex flex-col justify-start items-start p-10 gap-5 bg-[#A71666] font-montserrat rounded-sm z-50">
                  <Image
                    src={CloseIcon}
                    alt="fermeture du menu"
                    onClick={handleBuger}
                    className="w-7 self-end"
                  />
                  <Link
                    href="/"
                    className="text-white hover:text-gray-300 transition-colors text-2xl font-montserrat"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/profile"
                    className="text-white hover:text-gray-300 transition-colors text-2xl font-montserrat"
                  >
                    Profile
                  </Link>
                  {isAuthenticated && (
                    <Link
                      href="/login"
                      className="text-white hover:text-gray-300 transition-colors text-2xl font-montserrat"
                      onClick={handleLogout}
                      onKeyDown={handleLogout}
                    >
                      Déconnexion
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Image
                src={LogoBurger}
                alt="logo du burger menu"
                onClick={handleBuger}
                onKeyDown={handleBuger}
                className="w-7"
              />
              {isBurger && (
                <div className="absolute top-0 right-0 w-[100vw] h-[100vh] flex flex-col justify-start items-start p-10 gap-5 bg-[#A71666] font-montserrat rounded-sm">
                  <Image
                    src={CloseIcon}
                    alt="fermeture du menu"
                    onClick={handleBuger}
                    className="w-7 self-end"
                  />
                  <Link
                    href="/login"
                    className="text-white hover:text-gray-300 transition-colors text-2xl font-montserrat"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="text-white hover:text-gray-300 transition-colors text-2xl font-montserrat"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
