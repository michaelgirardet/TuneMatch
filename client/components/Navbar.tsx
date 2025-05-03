'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import LogoBurger from '@/public/sliders-icon-wh.svg';
import CloseIcon from '@/public/xmark-wh.svg';
import NotificationsMenu from './NotificationsMenu';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuthStore();
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
          <h1 className="text-[#f3f3f7] text-2xl font-sulphur">
            Tune<span className="text-[#51537B] font-extrabold">Match</span>
          </h1>
        </Link>
        {/* Navigation Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className="text-[#f3f3f7] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-quicksand"
              >
                Accueil
              </Link>
              <Link
                href="/profile"
                className="text-[#f3f3f7] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-quicksand"
              >
                Profil
              </Link>
              <Link
                href="/announcements"
                className="text-[#f3f3f7] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-quicksand"
              >
                Annonces
              </Link>
              <Link
                href="/messages"
                className="text-[#f3f3f7] hover:text-[#ffffff] hover:bg-[#212936] p-3 rounded-md transition-colors font-quicksand"
              >
                Messages
              </Link>
              <Link href="/search" aria-label="search an artist">
                <MagnifyingGlassIcon className="h-6 w-6 stroke-gray-400 cursor-pointer" />
              </Link>
              <NotificationsMenu />
              {isAuthenticated && user && (
                <div className="relative group">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    {user.photo_profil ? (
                      <Image
                        src={user.photo_profil}
                        alt={user.nom_utilisateur}
                        width={32}
                        height={32}
                        className="rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#51537B] flex items-center justify-center text-[#f3f3f7] font-bold">
                        {user.nom_utilisateur[0].toUpperCase()}
                      </div>
                    )}
                    {/* <span className="text-[#f3f3f7] font-sulphur">{user.nom_utilisateur}</span> */}
                  </div>

                  <div className="absolute right-0 mt-2 w-48 bg-[#212936] border border-[#1D1E2C] rounded-lg hidden group-hover:block z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-[#f3f3f7] hover:bg-[#101119] font-sulphur rounded-t-lg"
                    >
                      Mon profil
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[#f3f3f7] hover:bg-[#101119] font-sulphur rounded-b-lg"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-[#f3f3f7] hover:text-[#ffffff] border border-[#f3f3f7] p-3 rounded-md transition-colors font-quicksand"
              >
                Inscription
              </Link>
              <Link
                href="/login"
                className="text-[#f3f3f7] hover:text-[#ffffff] p-3 rounded-md transition-colors font-quicksand"
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
                        <NotificationsMenu />
                        <Link
                          href="/"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Accueil</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Profil</span>
                        </Link>
                        <Link
                          href="/announcements"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Annonces</span>
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Messages</span>
                        </Link>
                        <Link
                          href="/search"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Recherche</span>
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
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                        >
                          <span>Connexion</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] bg-[#51537B] hover:bg-[#8f1356] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
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
