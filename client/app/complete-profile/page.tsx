'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const GENRES = [
  'Pop',
  'Rock',
  'Jazz',
  'Classique',
  'Rap',
  'Électro',
  'Folk',
  'Blues',
  'Reggae',
  'Autre',
];

export default function CompleteArtistProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [formData, setFormData] = useState<{
    instruments: string;
    genres_musicaux: string[];
    biography: string;
    city: string;
    country: string;
    youtube_link: string;
    instagram_link: string;
    soundcloud_link: string;
  }>({
    instruments: '',
    genres_musicaux: [],
    biography: '',
    city: '',
    country: '',
    youtube_link: '',
    instagram_link: '',
    soundcloud_link: '',
  });
  const [error, setError] = useState('');

  // Pré-remplissage si user déjà existant
  useEffect(() => {
    if (user) {
      setFormData({
        instruments: user.instruments || '',
        genres_musicaux: user.genres_musicaux ? user.genres_musicaux.split(',') : [],
        biography: user.biography || '',
        city: user.city || '',
        country: user.country || '',
        youtube_link: user.youtube_link || '',
        instagram_link: user.instagram_link || '',
        soundcloud_link: user.soundcloud_link || '',
      });
    }
  }, [user]);

  const handleGenreChange = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres_musicaux: prev.genres_musicaux.includes(genre)
        ? prev.genres_musicaux.filter((g) => g !== genre)
        : [...prev.genres_musicaux, genre],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!token) {
      setError('Vous devez être connecté pour compléter votre profil.');
      return;
    }
    try {
      const response = await fetchWithAuth('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          genres_musicaux: formData.genres_musicaux.join(','),
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error || 'Erreur lors de la mise à jour du profil.');
        toast.error('🚨 Impossible de mettre à jour le profil !');
      } else {
        if (json.user) updateUser(json.user);
        toast.success('🎶 Profil complété avec succès !');
        router.push('/search');
      }
    } catch (err) {
      setError('🔌 Problème de connexion au serveur. Vérifie ta connexion et réessaie.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-oxford via-space to-[#23234a] py-8 px-2">
      <div className="bg-space/80 rounded-3xl shadow-2xl p-8 w-full max-w-xl flex flex-col items-center gap-6">
        {/* Header visuel */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <img
            src={user?.photo_profil || '/avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-electric shadow-lg object-cover"
          />
          <h1 className="font-quicksand text-3xl font-bold text-white mt-2 text-center">
            {user?.nom_utilisateur || 'Artiste'}
          </h1>
          <span className="text-electric uppercase tracking-widest font-semibold text-sm">
            {user?.role}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <h2 className="text-xl font-quicksand text-center text-white font-semibold mb-2">
            Complète ton profil artiste
          </h2>
          {error && <p className="text-red-400 text-center">{error}</p>}

          <div className="flex flex-col gap-2">
            <label className="text-lavender font-quicksand" htmlFor="instruments">
              Instruments pratiqués
            </label>
            <input
              type="text"
              name="instruments"
              id="instruments"
              placeholder="ex: guitare, piano"
              value={formData.instruments}
              onChange={handleChange}
              className="bg-space text-white font-quicksand text-center p-3 rounded-lg border border-lavender focus:outline-electric"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lavender font-quicksand" htmlFor="genres_musicaux">
              Genres musicaux
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center gap-1 text-white bg-[#23234a] px-3 py-1 rounded-full cursor-pointer hover:bg-electric/30 transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.genres_musicaux.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="accent-electric"
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lavender font-quicksand" htmlFor="biography">
              Biographie
            </label>
            <textarea
              name="biography"
              id="biography"
              placeholder="Parle-nous de toi, de ton parcours, de tes inspirations..."
              value={formData.biography}
              onChange={handleChange}
              className="bg-space text-white font-quicksand text-center p-3 rounded-lg border border-lavender focus:outline-electric min-h-[100px]"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-lavender font-quicksand" htmlFor="city">
                Ville
              </label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="Ville"
                value={formData.city}
                onChange={handleChange}
                className="bg-space text-white font-quicksand text-center p-3 rounded-lg border border-lavender focus:outline-electric"
                required
              />
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-lavender font-quicksand" htmlFor="country">
                Pays
              </label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="Pays"
                value={formData.country}
                onChange={handleChange}
                className="bg-space text-white font-quicksand text-center p-3 rounded-lg border border-lavender focus:outline-electric"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lavender font-quicksand" htmlFor="youtube_link">
              Lien YouTube
            </label>
            <input
              type="url"
              name="youtube_link"
              id="youtube_link"
              placeholder="Lien YouTube"
              value={formData.youtube_link}
              onChange={handleChange}
              className="bg-space text-white font-quicksand text-center p-3 rounded-lg border border-lavender focus:outline-electric"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lavender font-quicksand" htmlFor="instagram_link">
              Lien Instagram
            </label>
            <input
              type="url"
              name="instagram_link"
              id="instagram_link"
              placeholder="Lien Instagram"
              value={formData.instagram_link}
              onChange={handleChange}
              className="bg-space text-white font-quicksand text-center p-3 rounded-lg border border-lavender focus:outline-electric"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lavender font-quicksand" htmlFor="soundcloud_link">
              Lien SoundCloud
            </label>
            <input
              type="url"
              name="soundcloud_link"
              id="soundcloud_link"
              placeholder="Lien SoundCloud"
              value={formData.soundcloud_link}
              onChange={handleChange}
              className="bg-space text-white font-quicksand text-center p-3 rounded-lg border border-lavender focus:outline-electric"
            />
          </div>

          <button
            type="submit"
            className="bg-electric hover:bg-electrichover text-white font-quicksand text-lg font-semibold w-full p-4 rounded-xl mt-4 shadow-lg transition"
          >
            🎤 Enregistrer mon profil
          </button>
        </form>
      </div>
    </div>
  );
}
