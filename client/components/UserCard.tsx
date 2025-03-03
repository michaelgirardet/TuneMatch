'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MusicalNoteIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface User {
  id: number;
  nom_utilisateur: string;
  photo_profil: string | null;
  role: string;
  city: string;
  country: string;
  genres_musicaux: string;
  biography: string;
  instruments_pratiques?: string;
  tracks_count: number;
}

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="relative h-48">
        {user.photo_profil ? (
          <Image
            src={user.photo_profil}
            alt={user.nom_utilisateur}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        )}
      </figure>
      
      <div className="card-body">
        <h2 className="card-title">
          {user.nom_utilisateur}
          <div className="badge badge-secondary">{user.role}</div>
        </h2>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span>{user.city}, {user.country}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MusicalNoteIcon className="w-4 h-4" />
          <span>{user.genres_musicaux}</span>
        </div>
        
        {user.instruments_pratiques && (
          <p className="text-sm">
            <strong>Instruments:</strong> {user.instruments_pratiques}
          </p>
        )}
        
        <p className="text-sm text-gray-700 line-clamp-2">{user.biography}</p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="badge badge-outline">{user.tracks_count} morceaux</div>
          <Link href={`/profile/${user.id}`} className="btn btn-primary btn-sm">
            Voir le profil
          </Link>
        </div>
      </div>
    </div>
  );
} 