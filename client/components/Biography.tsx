'use client';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Biography() {
  const [biography, setBiography] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, user, updateUser } = useAuthStore();

  useEffect(() => {
    if (user?.biography) {
      setBiography(user.biography);
    }
  }, [user?.biography]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/users/biography', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ biography }),
      });

      if (response.ok) {
        updateUser?.({ ...user, biography });
        toast.success('📖 Bio mise à jour ! Ton histoire est prête à être lue.');
        setIsEditing(false);
      } else {
        toast.error('Erreur lors de la mise à jour de la biographie');
      }
    } catch (error) {
      console.error(error);
      toast.error('🔐 Connexion impossible ! Vérifie tes identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-oxford rounded-2xl p-6 mt-6 w-full shadow-md">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            onChange={(e) => setBiography(e.target.value)}
            className="p-4 bg-[#1a1a2f] rounded-lg text-white font-montserrat min-h-[120px] resize-none"
            placeholder="Écrivez votre biographie ici..."
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-md border border-[#444] text-white hover:bg-[#222]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[#51537B] text-white disabled:opacity-50"
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-[#f3f3f7] whitespace-pre-wrap font-montserrat">
          {biography || "Aucune biographie pour l'instant."}
        </p>
      )}
    </section>
  );
}
