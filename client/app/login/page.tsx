'use client';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const json = await response.json();

      if (response.ok) {
        login(json.accessToken || json.token, json.user);
        toast.success('🎸 Connexion réussie ! Prêt à faire du bruit ?', {
          position: 'bottom-right',
          autoClose: 5000,
        });
        router.push('/profile');
      } else {
        setError(json.error || 'Erreur lors de la connexion');
        toast.error('🚨 🎵 Petit couac technique ! On réessaie ?', {
          position: 'bottom-right',
          autoClose: 5000,
        });
        console.error(error);
      }
    } catch (err) {
      setError('🔌 Problème de connexion au serveur. Vérifie ta connexion et réessaie.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center bg-space w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center self-center gap-3 h-[80vh] w-full"
      >
        <h1 className="font-quicksand font-semibold text-4xl font py-5 text-center text-white">
          Connexion
        </h1>
        <div className="p-5 flex flex-col justify-center item-center">
          <label htmlFor="email" className="form-label" aria-label="email form" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-raisin text-white text-center form-input w-[90vw] md:w-[35vw] self-center p-5 rounded focus:outline-electric"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex flex-col justify-center item-center">
          <label htmlFor="password" className="form-label" aria-label="password-input" />
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-raisin text-white text-center form-input w-[90vw] md:w-[35vw] self-center p-5 rounded focus:outline-electric"
            required
          />
        </div>
        <div className="w-full flex items-center justify-evenly md:justify-center gap-56">
          <Link href="/forgot-password">
            <p className="font-quicksand font-thin text-white text-sm hover:underline underline-offset-2">
              Mot de passe oublié ?
            </p>
          </Link>
          <div className="flex items-center justyfy-center h-5">
            <Link href="/register">
              <p className="font-quicksand font-thin text-white text-sm hover:underline underline-offset-2">
                Pas encore inscrit ?
              </p>
            </Link>
          </div>
        </div>
        <button
          type="submit"
          className="bg-electric hover:bg-electrichover text-white button p-5 mt-12 w-[90vw] md:w-[35vw] rounded flex justify-center self-center item-center text-lg"
        >
          Connexion
        </button>
      </form>
    </div>
  );
}
