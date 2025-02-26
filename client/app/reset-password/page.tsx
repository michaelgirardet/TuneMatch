'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ToasterError, ToasterSuccess } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SuccessModal, ErrModal } from '../components/Modals';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      setResetError('Lien de réinitialisation invalide');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetSuccess(data.message);
        ToasterSuccess('🎵 Mot de passe réinitialisé avec succès !');
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
      <div className="flex flex-col items-center justify-center h-[85vh]">
        {email && token ? (
          <>
            <h1 className="title font-quicksand pb-10 text-center">
              Réinitialisation du mot de passe
            </h1>
            {resetError && <ErrModal message={resetError} />}
            {resetSuccess && <SuccessModal message={resetSuccess} />}
            <form
              onSubmit={handleReset}
              className="flex flex-col justify-center items-center gap-5"
            >
              <p className="font-montserrat px-4 text-center">
                Veuillez entrer votre nouveau mot de passe
              </p>
              <div className="p-5 flex flex-col justify-center items-center gap-2">
                <label htmlFor="password" className="sr-only">
                  Nouveau mot de passe
                </label>
                <input
                  className="font-sulphur form-input flex w-[280px] self-center p-2 rounded"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Entrez votre nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="button font-sulphur font-semibold text-red-100 p-5 w-[200px] rounded flex justify-center self-center items-center disabled:opacity-50"
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center p-5">
            <h1 className="title font-quicksand pb-5">Lien invalide</h1>
            <p className="font-montserrat">Le lien de réinitialisation est invalide ou a expiré.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
