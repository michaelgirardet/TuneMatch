'use client';

import { Pagination } from '@/components/Pagination';
import { UserCard } from '@/components/UserCard';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useCallback, useEffect, useState } from 'react';
import { FiFilter, FiGlobe, FiGrid, FiList, FiMapPin, FiMusic, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Artist {
  id: number;
  nom_utilisateur: string;
  photo_profil: string | null;
  role: string;
  city: string;
  country: string;
  genres_musicaux: string;
  biography: string;
  instruments_pratiques: string;
  tracks_count: number;
}

interface SearchFilters {
  role?: string;
  genres?: string;
  city?: string;
  country?: string;
  instruments?: string;
  page: number;
  limit: number;
}

export default function SearchPage() {
  const { token } = useAuthStore();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debug useEffect
  useEffect(() => {
    console.log("État d'authentification dans SearchPage:", {
      token: token,
      isAuthenticated: useAuthStore.getState().isAuthenticated,
      timestamp: new Date().toISOString(),
    });
  }, [token]);

  const fetchArtists = useCallback(async () => {
    if (!token) {
      setError('Vous devez être connecté pour effectuer une recherche');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value) queryParams.append(key, value.toString());
      }

      const response = await fetch(`http://localhost:5001/api/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la recherche des artistes');
      }

      const data = await response.json();
      setArtists(data.artists);
      setPagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  useEffect(() => {
    if (token) {
      fetchArtists();
    }
  }, [fetchArtists, token]);

  const handleFilterChange = (name: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset page when filters change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: filters.limit,
    });
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="min-h-screen bg-oxford">
      {/* Hero section */}
      <div className="bg-space py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-quicksand text-5xl md:text-6xl font-bold text-white mb-6">
              Découvrez des artistes talentueux
            </h1>
            <p className="font-body text-xl text-white mb-10">
              Trouvez des collaborateurs pour vos projets musicaux
            </p>

            {/* Barre de recherche principale */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Rechercher par genre, instrument..."
                className="w-full bg-surface-white bg-opacity-10 backdrop-blur-sm text-surface-white border border-primary-light rounded-full py-4 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                onChange={(e) => handleFilterChange('genres', e.target.value)}
                value={filters.genres || ''}
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-light text-xl" />
              <button
                type="button"
                onClick={toggleFilters}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-light hover:text-accent-violet transition-colors"
              >
                <FiFilter className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filtres avancés - visible uniquement quand isFiltersOpen est true */}
        <div
          className={`mb-10 transition-all duration-300 ${isFiltersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        >
          <div className="bg-primary rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl text-surface-white">Filtres avancés</h2>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-primary-light hover:text-accent-violet transition-colors"
              >
                Réinitialiser
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="role-select" className="block text-sm text-primary-light font-body">
                  Rôle
                </label>
                <select
                  id="role-select"
                  className="w-full bg-primary-dark text-surface-light font-body px-4 py-3 rounded-lg border border-primary focus:outline-none focus:border-accent-violet"
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  value={filters.role || ''}
                >
                  <option value="">Tous les rôles</option>
                  <option value="chanteur">Chanteur</option>
                  <option value="musicien">Musicien</option>
                  <option value="producteur">Producteur</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm text-primary-light font-body"
                  htmlFor="music-genres-select"
                >
                  Genre musical
                </label>
                <div className="relative">
                  <FiMusic className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" />
                  <input
                    type="text"
                    placeholder="Pop, Rock, Jazz..."
                    className="w-full bg-primary-dark text-surface-light font-body pl-10 pr-4 py-3 rounded-lg border border-primary focus:outline-none focus:border-accent-violet"
                    onChange={(e) => handleFilterChange('genres', e.target.value)}
                    value={filters.genres || ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm text-primary-light font-body"
                  htmlFor="instrument choice"
                >
                  Instrument
                </label>
                <input
                  type="text"
                  placeholder="Guitare, Piano, Batterie..."
                  className="w-full bg-primary-dark text-surface-light font-body px-4 py-3 rounded-lg border border-primary focus:outline-none focus:border-accent-violet"
                  onChange={(e) => handleFilterChange('instruments', e.target.value)}
                  value={filters.instruments || ''}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-primary-light font-body" htmlFor="city choice">
                  Ville
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" />
                  <input
                    type="text"
                    placeholder="Paris, Lyon, Marseille..."
                    className="w-full bg-primary-dark text-surface-light font-body pl-10 pr-4 py-3 rounded-lg border border-primary focus:outline-none focus:border-accent-violet"
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    value={filters.city || ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm text-primary-light font-body"
                  htmlFor="country choice"
                >
                  Pays
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-light" />
                  <input
                    type="text"
                    placeholder="France, Belgique, Canada..."
                    className="w-full bg-primary-dark text-surface-light font-body pl-10 pr-4 py-3 rounded-lg border border-primary focus:outline-none focus:border-accent-violet"
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    value={filters.country || ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-primary-light font-body" htmlFor="results">
                  Résultats par page
                </label>
                <select
                  className="w-full bg-primary-dark text-surface-light font-body px-4 py-3 rounded-lg border border-primary focus:outline-none focus:border-accent-violet"
                  onChange={(e) => handleFilterChange('limit', e.target.value)}
                  value={filters.limit.toString()}
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={fetchArtists}
                className="bg-accent-violet hover:bg-accent-pink text-surface-white font-body font-medium py-2 px-6 rounded-full transition-colors duration-300 flex items-center"
              >
                <FiSearch className="mr-2" />
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Résultats et options d'affichage */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="font-heading text-2xl text-white">
              {loading
                ? 'Recherche en cours...'
                : `${pagination.total} artiste${pagination.total !== 1 ? 's' : ''} trouvé${pagination.total !== 1 ? 's' : ''}`}
            </h2>
          </div>

          <div className="text-white flex items-center space-x-4">
            <span className="text-primary-light font-body">Affichage:</span>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-accent-violet text--white' : 'text-lavender hover:text-white'}`}
              aria-label="Affichage en grille"
            >
              <FiGrid />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-accent-violet text-surface-white' : 'text-primary-light hover:text-surface-white'}`}
              aria-label="Affichage en liste"
            >
              <FiList />
            </button>
          </div>
        </div>

        {/* Gestion des erreurs */}
        {error && (
          <div className="mb-8 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
            <p className="text-red-500 font-body">{error}</p>
          </div>
        )}

        {/* Affichage des artistes */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-accent-violet border-t-transparent rounded-full animate-spin" />
              <div className="absolute top-2 left-2 w-16 h-16 border-4 border-accent-pink border-t-transparent rounded-full animate-spin animation-delay-150" />
            </div>
          </div>
        ) : (
          <>
            {/* Grille d'artistes */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artists.map((artist) => (
                  <UserCard key={artist.id} user={artist} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"
                  >
                    <div className="w-full md:w-48 h-48 relative">
                      {artist.photo_profil ? (
                        <Image
                          src={artist.photo_profil}
                          alt={artist.nom_utilisateur}
                          className="w-full h-full object-cover"
                          width={192}
                          height={192}
                          // priority // optionnel
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-dark flex items-center justify-center">
                          <span className="text-6xl text-primary-light opacity-50">
                            {artist.nom_utilisateur?.charAt(0).toUpperCase() ?? '?'}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-primary-dark px-2 py-1 rounded">
                        <span className="text-xs text-primary-light capitalize">{artist.role}</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1">
                      <h3 className="font-heading text-xl font-medium text-surface-white mb-2 capitalize">
                        {artist.nom_utilisateur}
                      </h3>
                      <div className="flex items-center text-sm text-primary-light mb-3">
                        <FiMapPin className="mr-1" />
                        <span>
                          {artist.city}, {artist.country}
                        </span>
                      </div>
                      <p className="text-surface-light line-clamp-2 mb-4">
                        {artist.biography || 'Aucune biographie disponible.'}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {artist.genres_musicaux.split(',').map((genre) => (
                          <span
                            key={genre.trim()}
                            className="bg-primary-dark px-2 py-1 rounded-full text-xs text-primary-light"
                          >
                            {genre.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-primary-light">
                            {artist.tracks_count} morceau{artist.tracks_count !== 1 ? 'x' : ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="bg-accent-violet hover:bg-accent-pink text-surface-white py-2 px-4 rounded-full text-sm transition-colors"
                        >
                          Voir profil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Aucun résultat */}
            {artists.length === 0 && !loading && (
              <div className="text-center py-16 bg-primary bg-opacity-30 rounded-xl">
                <div className="inline-block p-4 bg-primary-dark rounded-full mb-4">
                  <FiSearch className="text-4xl text-white" />
                </div>
                <h3 className="font-heading text-xl text-surface-white mb-2 text-white">
                  Aucun artiste trouvé
                </h3>
                <p className="text-primary-light max-w-md mx-auto text-white">
                  Essayez d&apos;ajuster vos filtres de recherche ou d&apos;élargir vos critères
                  pour obtenir plus de résultats.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 py-2 px-6 rounded-full text-sm inline-flex items-center text-white hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={filters.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
