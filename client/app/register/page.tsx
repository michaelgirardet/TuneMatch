'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import { ToasterError } from '@/components/Toast';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: '',
    nom_utilisateur: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const dataToSend = {
      role: formData.role,
      nom_utilisateur: formData.nom_utilisateur,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Erreur serveur:', errorData); // Pour débugger
        setError(errorData.error || "Erreur lors de l'inscription");
        <ToasterError message="🚨 🎵 Petit couac technique ! On réessaie ?" />;
      } else {
        toast.success(
          "🎧 Bienvenue dans le groove ! L'aventure musicale commence maintenant ! 🚀",
          {
            position: 'top-right',
            autoClose: 5000,
          }
        );
        router.push('/complete-profile');
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
      <div className="flex flex-col items-center justify-center h-[86vh]" id="register-form">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center pb-7 gap-5"
        >
          <h1 className="title font-quicksand text-4xl pb-10 text-center">Inscription</h1>
          {error && <p className="text-red-500">{error}</p>}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-[#101119] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
            required
          >
            <option value="">Tu es dans quel mood ? 😎</option>
            <option value="producteur">Producteur</option>
            <option value="musicien">Musicien</option>
            <option value="chanteur">Chanteur</option>
          </select>

          <input
            type="text"
            name="nom_utilisateur"
            value={formData.nom_utilisateur}
            onChange={handleChange}
            placeholder="Username"
            className="bg-[#101119] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="bg-[#101119] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-[#101119] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
            required
          />

          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="bg-[#101119] form-input font-sulphur flex w-[280px] self-center p-2 rounded"
            required
          />
          <Link
            href="/login"
            className="font-montserrat text-[#f3f3f7] text-xs hover:underline underline-offset-2"
          >
            Déjà enregistré ?
          </Link>
          <button
            type="submit"
            className="button font-sulphur text-red-100 p-5 w-[200px] rounded flex justify-center self-center item-center bg-[#51537B] hover:bg-[#595B88]"
          >
            S'inscrire
          </button>
        </form>
      </div>
      <footer>
        <Footer />
      </footer>
    </main>
  );
}
