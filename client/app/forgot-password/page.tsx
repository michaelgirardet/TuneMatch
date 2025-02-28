'use client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { ToasterError, ToasterSuccess } from '@/components/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess(data.message);
        ToasterSuccess('🎵 Email envoyé ! Vérifiez votre boîte de réception.');
        setResetError(null);
      } else {
        setResetError(data.error);
        ToasterError(data.error || 'Une erreur est survenue');
        setResetSuccess(null);
      }
    } catch (error) {
      setResetError('Erreur de connexion au serveur');
      ToasterError('Erreur de connexion au serveur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[86vh]">
        <h1 className="title font-quicksand pb-10 text-center">Mot de passe oublié</h1>
        {resetError && <ErrModal message={resetError} />}
        {resetSuccess && <SuccessModal message={resetSuccess} />}
        <form onSubmit={handleForgot} className="flex flex-col justify-center items-center gap-5">
          <p className="font-montserrat px-4 text-center">
            Pas de panique, ça nous est tous arrivé au moins une fois
          </p>
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              className="font-sulphur form-input flex w-[280px] self-center p-2 rounded"
              type="email"
              name="email"
              id="email"
              placeholder="Entrez votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="button font-sulphur font-semibold text-red-100 p-5 w-[200px] rounded flex justify-center self-center items-center disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Valider'}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
