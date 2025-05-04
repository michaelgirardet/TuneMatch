'use client';
import { useEffect, useState } from 'react';

// Extend the Window interface to include openAnnouncementModal
declare global {
  interface Window {
    openAnnouncementModal?: () => void;
  }
}
import AnnouncementList from '@/components/AnnouncementList';
import { useAuthStore } from '@/store/authStore';

export default function AnnouncementsPage() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStyle, setFilterStyle] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Animation classes for elements when they appear
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const MUSICAL_STYLES = [
    'Tous',
    'Rock',
    'Jazz',
    'Soul',
    'Hip-Hop',
    'R&B',
    'Pop',
    'Électro',
    'Classique',
    'Metal',
    'Folk',
    'Reggae',
    'Blues',
    'Country',
    'Rap',
    'Indie',
    'Latino',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-oxford">
      <div className="flex-grow">
        {/* Hero Section with Background */}
        <div className="relative h-64 md:h-80 mb-8 overflow-hidden">
          <div
            className="absolute inset-0 bg-[url('/images/music-collaboration.jpg')] bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/images/music-collaboration.jpg')" }}
          />
          <div className="relative z-30 h-full flex flex-col items-center justify-center px-4">
            <h1
              className={`font-quicksand text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-4 
                ${isVisible ? 'animate-fadeIn opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
            >
              Collaborations Musicales
            </h1>
            <p
              className={`text-lg md:text-xl text-gray-100 max-w-2xl text-center font-montserrat
                ${isVisible ? 'animate-fadeIn opacity-100 delay-300' : 'opacity-0'} transition-opacity duration-1000`}
            >
              Trouvez les meilleurs talents ou rejoignez les projets qui vous inspirent
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search and Filter Bar */}
          <div
            className={`bg-[#212936] rounded-lg shadow-lg p-4 mb-8 
            ${isVisible ? 'animate-slideInUp opacity-100 delay-500' : 'opacity-0 translate-y-10'} 
            transition-all duration-700`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Rechercher des annonces..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-[#1d1e2c] text-[#f3f3f7] focus:ring-2 focus:ring-[#51537B] outline-none transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Search Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div className="flex w-full md:w-auto justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1d1e2c] text-[#f3f3f7] hover:bg-[#2a2b3c] transition-all"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filtres
                </button>

                {user?.role === 'producteur' && (
                  <button
                    type="button"
                    onClick={() => {
                      // Scroll to AnnouncementList component and trigger create modal
                      document
                        .getElementById('announcement-list-component')
                        ?.scrollIntoView({ behavior: 'smooth' });
                      // We'll need to expose a method from AnnouncementList to open the modal
                      window.openAnnouncementModal?.();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#51537B] hover:bg-[#595B88] text-[#f3f3f7] font-sulphur transition-all"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Nouvelle annonce
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {MUSICAL_STYLES.map((style) => (
                  <button
                    type="button"
                    key={style}
                    onClick={() => setFilterStyle(style === 'Tous' ? '' : style)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all
                      ${
                        filterStyle === style || (style === 'Tous' && filterStyle === '')
                          ? 'bg-[#51537B] text-white'
                          : 'bg-[#2a2b3c] text-gray-300 hover:bg-[#3a3b4c]'
                      }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12
            ${isVisible ? 'animate-slideInUp opacity-100 delay-700' : 'opacity-0 translate-y-10'} 
            transition-all duration-700`}
          >
            <div className="bg-gradient-to-r from-[#32334E] to-[#51537B] rounded-lg p-6 shadow-lg flex items-center">
              <div className="bg-[#212936] rounded-full p-3 mr-4">
                <svg
                  className="h-8 w-8 text-[#f3f3f7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-300">Projets en cours</p>
                <p className="text-2xl font-bold text-white">124</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#32334E] to-[#51537B] rounded-lg p-6 shadow-lg flex items-center">
              <div className="bg-[#212936] rounded-full p-3 mr-4">
                <svg
                  className="h-8 w-8 text-[#f3f3f7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-300">Artistes actifs</p>
                <p className="text-2xl font-bold text-white">356</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#32334E] to-[#51537B] rounded-lg p-6 shadow-lg flex items-center">
              <div className="bg-[#212936] rounded-full p-3 mr-4">
                <svg
                  className="h-8 w-8 text-[#f3f3f7]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-300">Collaborations réussies</p>
                <p className="text-2xl font-bold text-white">78</p>
              </div>
            </div>
          </div>

          {/* Annoucement List Section with Title */}
          <div
            id="announcement-list-component"
            className={`${isVisible ? 'animate-slideInUp opacity-100 delay-900' : 'opacity-0 translate-y-10'} 
            transition-all duration-700`}
          >
            <div className="flex items-center mb-8">
              <div className="h-1 bg-gradient-to-r from-[#51537B] to-transparent flex-grow" />
              <h2 className="px-4 text-2xl font-montserrat font-semibold text-white">
                Annonces disponibles
              </h2>
              <div className="h-1 bg-gradient-to-l from-[#51537B] to-transparent flex-grow" />
            </div>

            <AnnouncementList searchTerm={searchTerm} filterStyle={filterStyle} />
          </div>

          {/* Call to Action Section */}
          <div className="mt-16 mb-8 bg-gradient-to-r from-[#32334E] to-[#51537B] rounded-lg p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4">
              Vous êtes un artiste talentueux ?
            </h3>
            <p className="text-gray-200 mb-6 max-w-lg mx-auto">
              Rejoignez notre communauté et commencez à collaborer avec des producteurs et artistes
              du monde entier.
            </p>
            <button
              type="button"
              className="px-6 py-3 bg-electric hover:bg-electrichover text-white rounded-lg font-bold transition-all"
            >
              Créer votre profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
