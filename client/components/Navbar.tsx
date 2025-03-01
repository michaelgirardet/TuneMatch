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
                className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-quicksand"
              >
                Accueil
              </Link>
              <Link
                href="/profile"
                className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-quicksand"
              >
                Profil
              </Link>
              <Link
                href="/announcements"
                className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-quicksand"
              >
                Annonces
              </Link>
              <Link
                href="/login"
                className="text-[#F2F6FF] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-quicksand"
                onClick={handleLogout}
              >
                Déconnexion
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-[#F2F6FF] hover:text-[#ffffff] border border-[#f2f6ff] p-3 rounded-md transition-colors font-quicksand"
              >
                Inscription
              </Link>
              <Link
                href="/login"
                className="text-[#F2F6FF] hover:text-[#ffffff] p-3 rounded-md transition-colors font-quicksand"
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
            <div
              className="fixed top-0 right-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={handleBuger}
              onKeyDown={handleBuger}
            >
              <div
                className="fixed top-0 right-0 w-[300px] h-full bg-gradient-to-b from-[#1a1f2c] to-[#212936] shadow-2xl transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col h-full p-8">
                  <div className="flex justify-end mb-8">
                    <button
                      type="button"
                      onClick={handleBuger}
                      className="p-2 hover:bg-[#2a344a] rounded-full transition-colors duration-200"
                    >
                      <Image src={CloseIcon} alt="fermeture du menu" className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/"
                          className="flex items-center px-4 py-3 text-[#F2F6FF] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Accueil</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-[#F2F6FF] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Profil</span>
                        </Link>
                        <Link
                          href="/announcements"
                          className="flex items-center px-4 py-3 text-[#F2F6FF] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Annonces</span>
                        </Link>
                        <div className="flex-grow" />
                        <Link
                          href="/login"
                          onClick={handleLogout}
                          className="flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-xl font-medium mt-auto font-quicksand"
                        >
                          <span>Déconnexion</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="flex items-center px-4 py-3 text-[#F2F6FF] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Connexion</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center px-4 py-3 text-[#F2F6FF] bg-[#a71666] hover:bg-[#8f1356] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Inscription</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
