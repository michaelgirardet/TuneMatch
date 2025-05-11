'use client';
import LogoBurger from '@/public/sliders-icon-wh.svg';
import CloseIcon from '@/public/xmark-wh.svg';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NotificationsMenu from './NotificationsMenu';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isBurger, setIsBurger] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetchWithAuth('http://localhost:5001/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    logout();
    setIsMenu(false);
    setIsBurger(false);
    router.push('/');
    toast.success('Déconnexion réussie ! à bientôt !', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  }

  const handleBurger = () => {
    setIsBurger((b) => !b);
  };

  const handleMenu = () => {
    setIsMenu((m) => !m);
  };

  return (
    <nav className="bg-raisin p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <h1 className="text-white text-2xl font-quicksand font-bold">
            Tune<span className="text-electric font-extrabold">Match</span>
          </h1>
        </Link>
        {/* Navigation Desktop */}
        <div className="hidden md:flex gap-4 items-center text-sm lg:text-lg">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className="text-white hover:underline decoration-electric underline-offset-8 p-3 rounded-md transition-colors font-quicksand"
              >
                Accueil
              </Link>
              <Link
                href="/profile"
                className="text-white hover:underline decoration-electric underline-offset-8 p-3 rounded-md transition-colors font-quicksand"
              >
                Profil
              </Link>

              <Link
                href="/discover"
                className="text-white hover:underline decoration-electric underline-offset-8 p-3 rounded-md transition-colors font-quicksand"
              >
                Découverte
              </Link>
              <Link
                href="/matches"
                className="text-white hover:underline decoration-electric underline-offset-8 p-3 rounded-md transition-colors font-quicksand"
              >
                Mes Matchs
              </Link>
              <Link
                href="/messages"
                className="text-white hover:underline decoration-electric underline-offset-8 p-3 rounded-md transition-colors font-quicksand"
              >
                Messages
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
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={user.photo_profil}
                          alt={user.nom_utilisateur}
                          width={48}
                          height={48}
                          className="object-cover object-center w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-white font-bold">
                        {user.nom_utilisateur?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  {isMenu && (
                    <div className="absolute right-0 mt-5 w-48 bg-raisin rounded-lg z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-white hover:bg-raisinhover font-quicksand rounded-t-lg"
                        onClick={() => setIsMenu(false)}
                      >
                        Mon profil
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-white hover:bg-raisinhover font-quicksand rounded-b-lg"
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
                className="text-white hover:text-[#ffffff] border border-[#f3f3f7] p-3 rounded-md transition-colors font-quicksand"
              >
                Inscription
              </Link>
              <Link
                href="/login"
                className="text-white hover:text-[#ffffff] p-3 rounded-md transition-colors font-quicksand"
              >
                Connexion
              </Link>
            </>
          )}
        </div>

        {/* Navigation Mobile, Burger Menu */}
        <div className="md:hidden">
          <Image
            src={LogoBurger}
            alt="logo du burger menu"
            onClick={handleBurger}
            className="w-7 cursor-pointer"
          />
          {isBurger && (
            <div
              className="fixed top-0 right-0 w-full h-full z-40"
              onClick={handleBurger}
              onKeyDown={handleBurger}
              tabIndex={-1}
              aria-label="Fermer le menu"
            >
              <div
                className="fixed top-0 right-0 w-[300px] bg-raisin h-full shadow-2xl transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col h-full p-8 bg-raisin backdrop-blur-md">
                  <div className="flex justify-end mb-8">
                    <button
                      type="button"
                      onClick={handleBurger}
                      className="p-2 hover:bg-raisin rounded-full transition-colors duration-200"
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
                          className="flex items-center px-4 py-3 text-white hover:bg-raisin rounded-lg transition-all duration-200 text-lg font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Accueil</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-white hover:bg-raisin rounded-lg transition-all duration-200 text-lg font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Profil</span>
                        </Link>

                        <Link
                          href="/discover"
                          className="flex items-center px-4 py-3 text-white hover:bg-raisin rounded-lg transition-all duration-200 text-lg font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          Découverte
                        </Link>
                        <Link
                          href="/matches"
                          className="flex items-center px-4 py-3 text-white hover:bg-raisin rounded-lg transition-all duration-200 text-lg font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          Mes Matchs
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center px-4 py-3 text-white hover:bg-raisin rounded-lg transition-all duration-200 text-lg font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Messages</span>
                        </Link>
                        <div className="flex-grow" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center px-4 py-3 text-red-600 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-lg font-medium mt-auto font-quicksand"
                        >
                          <span>Déconnexion</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="flex items-center px-4 py-3 text-white hover:bg-[#2a344a] rounded-lg transition-all duration-200 text-xl font-medium font-quicksand"
                          onClick={handleBurger}
                        >
                          <span>Connexion</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center px-4 py-3 text-white bg-electric hover:bg-electrichover rounded-lg text-xl font-medium font-quicksand"
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
