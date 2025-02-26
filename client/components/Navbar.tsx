'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import WhiteLogin from '@/public/login-icon-wh.svg';
import WhiteRegister from '@/public/register-icon-wh.svg';
import WhiteSlider from '@/public/sliders-icon-wh.svg';
import WhiteMark from '@/public/xmark-wh.svg';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const [isDropdown, setIsDropdown] = useState(false);

  const handleShowDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  return (
    <nav className="navbar">
      <ul className="flex gap-8">
        {isAuthenticated ? (
          <>
            <li>
              <Image
                className="w-7 cursor-pointer"
                src={WhiteSlider}
                onClick={handleShowDropdown}
                alt="burger menu"
                aria-label="burger menu"
              />
            </li>
            {isDropdown && (
              <div className="bg-[#261450] absolute top-0 left-0 w-[100vw] h-[100vh] rounded-[2px] flex flex-col justify-start items-start p-10 gap-2">
                <Image
                  src={WhiteMark}
                  className="w-7 self-end"
                  alt="croix pour fermer le menu"
                  aria-label="fermer le menu"
                  onClick={handleShowDropdown}
                />
                <Link href="/">
                  <li className=" font-montserrat text-xl font-semibold">Accueil</li>
                </Link>
                <Link href="/profile">
                  <li className=" font-montserrat text-xl font-semibold">Profil</li>
                </Link>
                <li
                  className=" font-montserrat text-xl font-semibold"
                  onClick={logout}
                  onKeyDown={logout}
                >
                  Déconnexion
                </li>
              </div>
            )}
          </>
        ) : (
          <>
            <li>
              <Link href="/register" className="text-white hover:text-gray-300">
                <Image
                  className="w-7"
                  src={WhiteRegister}
                  alt="inscription"
                  aria-label="Inscription"
                />
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white hover:text-gray-300">
                <Image className="w-7" src={WhiteLogin} alt="connexion" aria-label="Connexion" />
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
