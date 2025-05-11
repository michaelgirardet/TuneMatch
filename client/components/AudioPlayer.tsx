import { useAuthStore } from '@/store/authStore';
import PauseRose from '@/public/circle-pause-solid.svg';
import PlayRose from '@/public/circle-play-solid.svg';
import CloseIcon from '@/public/circle-xmark-solid.svg';
import Image from 'next/image';
import { useState } from 'react';

interface TrackProps {
  id: number;
  title: string;
  artist: string;
  url: string;
}

interface AudioPlayerProps {
  tracks: TrackProps[];
  onAddTrack?: () => void;
  onDeleteTrack?: (trackId: number) => void;
}

export default function AudioPlayer({ tracks = [], onAddTrack, onDeleteTrack }: AudioPlayerProps) {
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);

  const handlePlay = (trackId: number) => {
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  return (
    <div className="flex flex-col gap-4 w-full text-white">
      {tracks.length === 0 ? (
        <div className="w-full p-6 rounded-lg">
          {onAddTrack && (
            <button
              type="button"
              onClick={onAddTrack}
              className="btn btn-wide bg-electric hover:bg-electrichover font-semibold px-10 py-5 rounded-lg flex items-center justify-center gap-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-white"
              >
                <title>add track</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
                />
              </svg>
              Ajouter un morceau
            </button>
          )}
        </div>
      ) : (
        <>
          {Array.isArray(tracks) &&
            tracks.map((track) => (
              <div
                key={track.id}
                className="w-full rounded-lg p-6 flex flex-col gap-4 bg-[#101119]"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-quicksand">
                    {track.artist} - {track.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    {onDeleteTrack && (
                      <Image
                        src={CloseIcon}
                        alt="Supprimer le morceau"
                        className="w-8 cursor-pointer"
                        onClick={() => onDeleteTrack(track.id)}
                      />
                    )}
                    <Image
                      src={playingTrackId === track.id ? PauseRose : PlayRose}
                      className="w-8 cursor-pointer"
                      alt={playingTrackId === track.id ? 'Pause' : 'Play'}
                      onClick={() => handlePlay(track.id)}
                    />
                  </div>
                </div>
                {playingTrackId === track.id && (
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${track.url}?autoplay=1`}
                      title={`${track.artist} - ${track.title}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            ))}
          {onAddTrack && tracks.length < 3 && (
            <button
              type="button"
              onClick={onAddTrack}
              className="btn btn-wide bg-electric hover:bg-electrichover font-semibold px-10 py-5 rounded-lg flex items-center justify-center gap-5"
            >
              Ajouter un morceau
            </button>
          )}
        </>
      )}
    </div>
  );
}
