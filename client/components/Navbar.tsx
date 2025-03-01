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
    <nav className="bg-[#1d1e2c] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-[#F2F6FF] text-2xl font-sulphur">
            Tune<span className="text-[#a71666] font-extrabold">Match</span>
          </h1>
        </Link>

        {/* Navigation Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-montserrat"
              >
                Accueil
              </Link>
              <Link
                href="/profile"
                className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-montserrat"
              >
                Profil
              </Link>
              <Link
                href="/announcements"
                className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-montserrat"
              >
                Annonces
              </Link>
              <Link
                href="/login"
                className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-montserrat"
                onClick={handleLogout}
              >
                Déconnexion
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-[#F2F6FF] hover:text-[#ffffff] border border-[#f2f6ff] p-3 rounded-md transition-colors font-montserrat"
              >
                Inscription
              </Link>
              <Link
                href="/login"
                className="text-[#F2F6FF] hover:text-[#ffffff] p-3 rounded-md transition-colors font-montserrat"
              >
                Connexion
              </Link>
            </>
          )}
        </div>

        {/* Navigation Mobile */}
        <div className="md:hidden">
          <Image
            src={LogoBurger}
            alt="logo du burger menu"
            onClick={handleBuger}
            className="w-7 cursor-pointer"
          />
          {isBurger && (
            <div className="fixed top-0 right-0 w-full h-full flex flex-col justify-start items-start p-10 gap-5 bg-[#212936] font-montserrat z-50">
              <Image
                src={CloseIcon}
                alt="fermeture du menu"
                onClick={handleBuger}
                className="w-7 self-end cursor-pointer"
              />
              {isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors text-2xl font-montserrat"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/profile"
                    className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors text-2xl font-montserrat"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/announcements"
                    className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors text-2xl font-montserrat"
                  >
                    Annonces
                  </Link>
                  <Link
                    href="/login"
                    className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors text-2xl font-montserrat"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[#F2F6FF] hover:text-gray-100 hover:bg-[#a71666] p-3 rounded-md transition-colors text-2xl font-montserrat"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="text-[#F2F6FF] hover:text-gray-100 hover:bg-[#212936] p-3 rounded-md transition-colors text-2xl font-montserrat"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
