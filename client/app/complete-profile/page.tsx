'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

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
  const [error, setError] = useState('');

  const _handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour compléter votre profil.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || 'Erreur lors de la mise à jour du profil.');
        toast.error('🚨 Impossible de mettre à jour le profil !', {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.success('🎶 Profil complété avec succès !', {
          position: 'top-right',
          autoClose: 5000,
        });
        router.push('/search');
      }
    } catch (_err) {
      setError('🔌 Problème de connexion au serveur. Vérifie ta connexion et réessaie.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-oxford">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center pb-7 gap-5"
      >
        <h1 className="font-quicksand text-4xl font-semibold pb-10 text-center text-white">
          Complète ton profil musical
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        {/* ...inputs... */}
        <button
          type="submit"
          className="bg-electric hover:bg-electrichover text-white button p-5 w-[200px] rounded flex justify-center self-center item-center"
        >
          Enregistrer mon profil
        </button>
      </form>
    </div>
  );
}
