'use client';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface Conversation {
  id: number;
  nom_utilisateur: string;
  photo_profil: string;
  dernier_message: string;
  derniere_date: string;
}

export default function MessagesPage() {
  const { token } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:5001/api/messages/conversations');

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des conversations');
        }

        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    if (token) {
      fetchConversations();
    }
  }, [token]);

  return (
    <>
      <div className="flex flex-col items-center justify-center p-2 bg-raisin rounded-md font-quicksand">
        <div className="w-[80vw] flex gap-5">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8 text-white"
            >
              <title>return</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-quicksand text-white mb-6">Mes conversations</h1>
        </div>
        <div className="space-y-4">
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-center">Aucune conversation</p>
          ) : (
            conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="block bg-[#282A3E] rounded-lg p-4 hover:bg-raisinhover transition-colors"
              >
                <div className="text-white flex items-center space-x-4  min-w-[80vw]">
                  {conversation.photo_profil ? (
                    <Image
                      src={conversation.photo_profil}
                      alt={conversation.nom_utilisateur}
                      width={48}
                      height={48}
                      className="rounded-full h-10 w-10"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-charcoal flex items-center justify-center text-white font-bold">
                      {conversation.nom_utilisateur[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-quicksand capitalize">
                      {conversation.nom_utilisateur}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">{conversation.dernier_message}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(conversation.derniere_date), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
