// pages/complete-profile.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    instruments: '',
    genres_musicaux: '',
    biography: '',
    youtube_link: '',
    instagram_link: '',
    soundcloud_link: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ou selon ton auth store
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil.');
      }

      router.push('/search'); // ou page d'accueil
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-[#0c0c15] text-white">
      <h1 className="text-3xl font-bold">Complète ton profil musical</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          name="instruments"
          placeholder="Tes instruments (ex : guitare, batterie)"
          value={formData.instruments}
          onChange={handleChange}
          className="p-2 rounded bg-[#1a1a2f]"
        />
        <input
          type="text"
          name="genres_musicaux"
          placeholder="Genres (rock, jazz, hip-hop...)"
          value={formData.genres_musicaux}
          onChange={handleChange}
          className="p-2 rounded bg-[#1a1a2f]"
        />
        <textarea
          name="biography"
          placeholder="Petite bio sympa"
          value={formData.biography}
          onChange={handleChange}
          className="p-2 rounded bg-[#1a1a2f]"
        />
        <input
          type="url"
          name="youtube_link"
          placeholder="Lien YouTube"
          value={formData.youtube_link}
          onChange={handleChange}
          className="p-2 rounded bg-[#1a1a2f]"
        />
        <input
          type="url"
          name="instagram_link"
          placeholder="Lien Instagram"
          value={formData.instagram_link}
          onChange={handleChange}
          className="p-2 rounded bg-[#1a1a2f]"
        />
        <input
          type="url"
          name="soundcloud_link"
          placeholder="Lien SoundCloud"
          value={formData.soundcloud_link}
          onChange={handleChange}
          className="p-2 rounded bg-[#1a1a2f]"
        />

        <button type="submit" className="bg-[#51537B] hover:bg-[#595B88] p-3 rounded font-bold">
          Enregistrer mon profil 🎶
        </button>
      </form>
    </main>
  );
}
