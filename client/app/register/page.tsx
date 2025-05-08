'use client';
import { useAuthStore } from '@/store/authStore'; // adapte le chemin
// import jwt_decode from 'jwt-decode';
// import { ToasterError } from '@/components/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Register() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
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

      const json = await response.json();

      if (!response.ok) {
        setError(json.message || json.error || "Erreur lors de l'inscription");
        toast.error('🚨 🎵 Petit couac technique ! On réessaie ?');
      } else {
        login(json.accessToken || json.token, json.user);
        toast.success(
          "🎧 Bienvenue dans le groove ! L'aventure musicale commence maintenant ! 🚀",
          {
            position: 'bottom-right',
            autoClose: 5000,
          }
        );
        router.push('/profile');
      }
    } catch (err) {
      setError('🔌 Problème de connexion au serveur. Vérifie ta connexion et réessaie.');
      console.error(err);
      toast.error('🔌 Problème de connexion au serveur. Vérifie ta connexion et réessaie.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-oxford" id="register-form">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center pb-7 gap-5"
      >
        <h1 className="font-quicksand text-4xl font-semibold pb-10 text-center text-white">
          Inscription
        </h1>
        {error && <p className="text-red-500">{error}</p>}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="bg-space text-white text-center form-input flex w-[280px] self-center p-2 rounded"
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
          className="bg-space text-white text-center form-input flex w-[280px] self-center p-2 rounded focus:outline-electric"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="bg-space text-white text-center form-input flex w-[280px] self-center p-2 rounded focus:outline-electric"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="bg-space text-white text-center form-input flex w-[280px] self-center p-2 rounded focus:outline-electric"
          required
        />

        <input
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="bg-space text-white text-center form-input  flex w-[280px] self-center p-2 rounded focus:outline-electric"
          required
        />
        <Link
          href="/login"
          className="font-quicksand font-thin text-white text-xs hover:underline underline-offset-2"
        >
          Déjà enregistré ?
        </Link>
        <button
          type="submit"
          className="bg-electric hover:bg-electrichover text-white button p-5 w-[200px] rounded flex justify-center self-center item-center"
        >
          S&apos;inscrire
        </button>
      </form>
    </div>
  );
}
