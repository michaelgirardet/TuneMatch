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
  const [isMenu, setIsMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsMenu(false);
    setIsBurger(false);
    router.push('/');
  };

  const handleBurger = () => {
    setIsBurger((b) => !b);
  };

  const handleMenu = () => {
    setIsMenu((m) => !m);
  };

  return (
    <nav className="bg-red-200 p-4 shadow-lg">
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
              {user && (
                <div className="relative group">
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={handleMenu}
                    onKeyDown={handleMenu}
                    onBlur={() => setIsMenu(false)}
                  >
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
                        {user.nom_utilisateur?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  {isMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#212936] border border-[#1D1E2C] rounded-lg z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-[#f3f3f7] hover:bg-[#101119] font-sulphur rounded-t-lg"
                        onClick={() => setIsMenu(false)}
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
                  )}
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
            onClick={handleBurger}
            className="w-7 cursor-pointer"
          />
          {isBurger && (
            <div
              className="fixed top-0 right-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={handleBurger}
              onKeyDown={handleBurger}
              tabIndex={-1}
              aria-label="Fermer le menu"
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
                      onClick={handleBurger}
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
                          onClick={handleBurger}
                        >
                          <span>Accueil</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Profil</span>
                        </Link>
                        <Link
                          href="/announcements"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Annonces</span>
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Messages</span>
                        </Link>
                        <Link
                          href="/search"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Recherche</span>
                        </Link>
                        <div className="flex-grow" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-xl font-medium mt-auto font-quicksand"
                        >
                          <span>Déconnexion</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Connexion</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center px-4 py-3 text-[#f3f3f7] bg-[#51537B] hover:bg-[#8f1356] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                          onClick={handleBurger}
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
