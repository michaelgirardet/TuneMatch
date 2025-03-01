'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from '../../components/Footer';
import { ToasterError, ToasterSuccess } from '@/components/Toast';
import Link from 'next/link';

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
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        router.push('/profile');
        ToasterSuccess('🔥 Vous êtes branché ! Prêt à faire vibrer la scène ?');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la connexion');
        ToasterError('🚨 Oups, fausse note ! Quelque chose a cloché. Réessaie !');
        console.error(error);
      }
    } catch (_err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col">
      <nav>
        <Navbar />
      </nav>
      <div className="flex flex-col items-center justify-center h-[86vh]">
        <h1 className="title font-quicksand pb-10 text-center">Connexion</h1>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="email" className="form-label" aria-label="email form" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#0A0A0A] font-sulphur form-input flex w-[280px] self-center p-2 rounded"
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
              className="bg-[#0A0A0A] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <Link href="/forgot-password">
              <p className="text-[#F2F6FF] text-xs font-montserrat mr-10 hover:text-[#a71666]">
                Mot de passe oublié ?
              </p>
            </Link>
            <div className="flex items-center justyfy-center h-5">
              <Link href="/register">
                <p className="text-[#F2F6FF] text-xs font-montserrat mr-10 hover:text-[#a71666]">
                  Pas encore inscrit ?
                </p>
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="button font-sulphur font-semibold text-red-100 p-5 w-[200px] rounded flex justify-center self-center item-center bg-[#a71666] hover:bg-[#a23e75]"
          >
            Submit
          </button>
        </form>
      </div>
      <footer>
        <Footer />
      </footer>
    </main>
  );
}
