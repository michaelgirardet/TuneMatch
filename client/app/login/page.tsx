'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  console.error(error);

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
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user); // stocke le token et l'utilisateur dans Zustand/localStorage
        toast.success('🎸 Connexion réussie ! Prêt à faire du bruit ?', {
          position: 'top-right',
          autoClose: 5000,
        });
        router.push('/profile');
      } else {
        setError(data.error || 'Erreur lors de la connexion');
        toast.error('🚨 🎵 Petit couac technique ! On réessaie ?', {
          position: 'top-right',
          autoClose: 5000,
        });
        console.error(data.error);
      }
    } catch (_err) {
      setError('🔌 Problème de connexion au serveur. Vérifie ta connexion et réessaie.');
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col">
      <nav>
        <Navbar />
      </nav>
      <div className="flex flex-col items-center justify-center h-[86vh] bg-oxford">
        <h1 className="font-quicksand text-4xl font-semibold mb-20 text-center text-white">
          Connexion
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="email" className="form-label" aria-label="email form" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-space text-white text-center form-input flex w-[280px] self-center p-2 rounded focus:outline-electric"
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
              className="bg-space text-white text-center form-input flex w-[280px] self-center p-2 rounded focus:outline-electric"
              required
            />
          </div>
          <div className="w-full flex items-center justify-between">
            <Link href="/forgot-password">
              <p className="text-white text-xs font-quicksand hover:underline underline-offset-2">
                Mot de passe oublié ?
              </p>
            </Link>
            <div className="flex items-center justyfy-center h-5">
              <Link href="/register">
                <p className="text-white text-xs font-quicksand hover:underline underline-offset-2">
                  Pas encore inscrit ?
                </p>
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="bg-electric hover:bg-electrichover text-white button p-5 w-[200px] rounded flex justify-center self-center item-center"
          >
            Connexion
          </button>
        </form>
      </div>
      <footer>
        <Footer />
      </footer>
    </main>
  );
}
