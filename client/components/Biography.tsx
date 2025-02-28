'use client';
import { useState, useEffect } from 'react';
import { ToasterError, ToasterSuccess } from './Toast';
import { useAuthStore } from '@/store/authStore';
import EditIcon from '@/public/pen-to-square-solid.svg';
import Image from 'next/image';

export default function Biography() {
  const [biography, setBiography] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, user, updateUser } = useAuthStore();

  useEffect(() => {
    if (user?.biography) {
      setBiography(user.biography);
    }
  }, [user]);

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
        if (user) {
          updateUser({ ...user, biography });
        }
        ToasterSuccess('Biographie mise à jour !');
        setIsEditing(false);
      } else {
        const error = await response.json();
        ToasterError(error.message || 'Erreur lors de la mise à jour de la biographie');
      }
    } catch (error) {
      ToasterError('Erreur de connexion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="p-4 bg-[#0A0A0A] rounded-lg text-[#F2F6FF] font-montserrat min-h-[200px] w-[65vw] resize-none"
            placeholder="Écrivez votre biographie ici..."
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg bg-[#OAOAOA] border text-[#F2F6FF] font-sulphur"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[#a71666] text-[#F2F6FF] disabled:opacity-50 font-sulphur"
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="relative p-5 ">
      <p
        className="font-montserrat p-7 bg-[#0A0A0A] text-[#F2F6FF] w-[80vw] md:w-[60vw] "
        onClick={() => {
          setBiography(user?.biography || '');
          setIsEditing(true);
        }}
        onKeyDown={() => {
          setBiography(user?.biography || '');
          setIsEditing(true);
        }}
      >
        {biography ||
          "Aucune biographie pour l'instant. Cliquez sur Modifier pour en ajouter une !"}
      </p>
    </div>
  );
}
