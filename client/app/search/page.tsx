'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ToasterError } from '@/components/Toast';
import { UserCard } from '@/components/UserCard';
import { Pagination } from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) queryParams.append(key, value.toString());
  }

  const fetchArtists = useCallback(async () => {
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
        throw new Error('Erreur lors de la recherche des artistes');
      }

      const data = await response.json();
      setArtists(data.artists);
      setPagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

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
  };

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Rechercher des artistes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="form-control">
            <span className="label-text">Type d'artiste</span>
            <select
              className="bg-[#0A0A0A] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              onChange={(e) => handleFilterChange('role', e.target.value)}
              value={filters.role || ''}
            >
              <option value="">Tous</option>
              <option value="musicien">Musicien</option>
              <option value="chanteur">Chanteur</option>
            </select>
          </div>

          <div className="form-control">
            <span className="label-text">Genre musical</span>
            <input
              type="text"
              placeholder="Rock, Jazz, Hip-hop..."
              className="bg-[#0A0A0A] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              onChange={(e) => handleFilterChange('genres', e.target.value)}
              value={filters.genres || ''}
            />
          </div>

          <div className="form-control">
            <span className="label-text">Ville</span>
            <input
              type="text"
              placeholder="Paris, Lyon..."
              className="bg-[#0A0A0A] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              onChange={(e) => handleFilterChange('city', e.target.value)}
              value={filters.city || ''}
            />
          </div>

          <div className="form-control">
            <span className="label-text">Pays</span>
            <input
              type="text"
              placeholder="France, Belgique..."
              className="bg-[#0A0A0A] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              onChange={(e) => handleFilterChange('country', e.target.value)}
              value={filters.country || ''}
            />
          </div>

          <div className="form-control">
            <span className="label-text">Instruments</span>
            <input
              type="text"
              placeholder="Guitare, Piano..."
              className="bg-[#0A0A0A] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              onChange={(e) => handleFilterChange('instruments', e.target.value)}
              value={filters.instruments || ''}
            />
          </div>
        </div>

        {error && <ToasterError message={error} />}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist) => (
                <UserCard key={artist.id} user={artist} />
              ))}
            </div>

            {artists.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun artiste trouvé</p>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="mt-8">
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
      <footer>
        <Footer />
      </footer>
    </>
  );
}
