'use client';

import { MapPinIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

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
    <div className="card w-full shadow-xl bg-space p-5 rounded-xl">
      <figure className="relative h-48">
        {user.photo_profil ? (
          <Link href={`/profile/${user.id}`}>
            <Image
              src={user.photo_profil}
              alt={user.nom_utilisateur}
              fill
              className="object-cover"
            />
          </Link>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title capitalize font-quicksand font-bold text-3xl mt-5 text-white">
          {user.nom_utilisateur}
          <div className="badge badge-secondary font-quicksand font-light text-2xl text-white tracking-wide">
            {user.role}
          </div>
        </h2>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPinIcon className="w-4 h-4" />
          <span className="font-quicksand">
            {user.city}, {user.country}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MusicalNoteIcon className="w-4 h-4" />
          <span className="font-quicksand">{user.genres_musicaux}</span>
        </div>

        {user.instruments_pratiques && (
          <p className="text-sm font-quicksand text-gray-500">
            <strong>Instruments:</strong> {user.instruments_pratiques}
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 font-quicksand">{user.biography}</p>

        <div className="flex justify-between items-center mt-4">
          <div className="badge font-quicksand badge-outline text-white">
            {user.tracks_count} morceaux
          </div>
          <Link
            href={`/profile/${user.id}`}
            className="btn btn-primary btn-sm font-quicksand text-white hover:text-charcoalhover font-light underline cursor-pointer"
          >
            Voir le profil
          </Link>
        </div>
      </div>
    </div>
  );
}
