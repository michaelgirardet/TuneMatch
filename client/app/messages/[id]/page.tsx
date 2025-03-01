'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ToasterError, ToasterSuccess } from '@/components/Toast';
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Message {
  id: number;
  contenu: string;
  date_envoi: string;
  id_expediteur: number;
  expediteur_nom: string;
  expediteur_photo: string;
}

interface Interlocutor {
  id: number;
  nom_utilisateur: string;
  photo_profil: string;
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [interlocutor, setInterlocutor] = useState<Interlocutor | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/messages/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }

      const data = await response.json();
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Erreur:', error);
      ToasterError('Erreur lors de la récupération des messages');
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
      // Rafraîchir les messages toutes les 5 secondes
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [token, params.id]);

  useEffect(() => {
    const fetchInterlocutor = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des informations de l\'interlocuteur');
        }

        const data = await response.json();
        setInterlocutor(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    if (token) {
      fetchInterlocutor();
    }
  }, [token, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('http://localhost:5001/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newMessage,
          recipientId: parseInt(params.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      setNewMessage('');
      await fetchMessages();
      ToasterSuccess('Message envoyé');
    } catch (error) {
      console.error('Erreur:', error);
      ToasterError('Erreur lors de l\'envoi du message');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      {/* En-tête de la conversation */}
      <div className="bg-[#212936] rounded-t-lg p-4 flex items-center gap-4 border-b border-gray-700">
        <button
          type="button"
          onClick={() => router.push('/messages')}
          className="p-2 hover:bg-[#2a344a] rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-6 w-6 text-white" />
        </button>
        {interlocutor && (
          <>
            {interlocutor.photo_profil ? (
              <Image
                src={interlocutor.photo_profil}
                alt={interlocutor.nom_utilisateur}
                width={40}
                height={40}
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-avatar.png';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#a71666] flex items-center justify-center text-white font-bold">
                {interlocutor.nom_utilisateur[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-white font-sulphur text-lg">{interlocutor.nom_utilisateur}</h2>
            </div>
          </>
        )}
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-[#1d1e2c] p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.id_expediteur === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[70%] ${
                message.id_expediteur === user?.id ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              {message.expediteur_photo ? (
                <Image
                  src={message.expediteur_photo}
                  alt={message.expediteur_nom}
                  width={32}
                  height={32}
                  className="rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#a71666] flex items-center justify-center text-white text-sm font-bold">
                  {message.expediteur_nom[0].toUpperCase()}
                </div>
              )}
              <div
                className={`rounded-lg p-3 ${
                  message.id_expediteur === user?.id
                    ? 'bg-[#a71666] text-white'
                    : 'bg-[#212936] text-gray-200'
                }`}
              >
                <p className="text-sm mb-1">{message.contenu}</p>
                <p className="text-xs opacity-75">
                  {formatDistanceToNow(new Date(message.date_envoi), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 bg-[#212936] rounded-b-lg p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 bg-[#2a344a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a71666]"
        />
        <button
          type="submit"
          className="bg-[#a71666] text-white p-2 rounded-lg hover:bg-[#8f1356] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newMessage.trim()}
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
} 