'use client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ToasterError, ToasterSuccess } from '@/components/Toast';
import { toast } from 'react-toastify';
import { useState } from 'react';

const ErrModal = ({ message }: { message: string }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
    {message}
  </div>
);

const SuccessModal = ({ message }: { message: string }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
    {message}
  </div>
);

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
        toast.success('📩 Email envoyé ! Jette un œil à ta boîte de réception.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        setResetError(null);
      } else {
        setResetError(data.error);
        toast.error('❌ Oups ! Un problème est survenu. Essaie à nouveau.', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        });
        setResetSuccess(null);
      }
    } catch (error) {
      setResetError('🔌 Problème de connexion au serveur. Vérifie ta connexion et réessaie.');
      toast.error('🔌 Problème de connexion au serveur. Vérifie ta connexion et réessaie.', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
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
          <p className="font-quicksand px-4 text-center">
            Pas de panique, ça nous est tous arrivé au moins une fois
          </p>
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              className="bg-[#101119] font-quicksand form-input flex w-[280px] self-center p-2 rounded"
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
            className="button font-quicksand font-semibold text-red-100 p-5 w-[200px] rounded flex justify-center self-center item-center bg-charcoal hover:bg-[#595B88]"
          >
            {loading ? 'Envoi...' : 'Valider'}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}
