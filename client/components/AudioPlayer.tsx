import PlayRose from '@/public/circle-play-solid.svg';
import PauseRose from '@/public/circle-pause-solid.svg';
import Image from 'next/image';
import { useState } from 'react';
import CloseIcon from '@/public/circle-xmark-solid.svg';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

interface AudioPlayerProps {
  tracks: Track[];
  onAddTrack?: () => void;
  onDeleteTrack?: (trackId: number) => void;
}

export default function AudioPlayer({ tracks = [], onAddTrack, onDeleteTrack }: AudioPlayerProps) {
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);

  const handlePlay = (trackId: number) => {
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {tracks.length === 0 ? (
        <div className="w-full p-6 rounded-lg text-center">
          {onAddTrack && (
            <button
              type="button"
              onClick={onAddTrack}
              className="bg-electric text-[#f3f3f7] px-8 py-4 rounded hover:bg-electrichover transition-colors self-center font-montserrat"
            >
              Ajouter un morceau
            </button>
          )}
        </div>
      ) : (
        <>
          {tracks.map((track) => (
            <div key={track.id} className="w-full rounded-lg p-6 flex flex-col gap-4 bg-[#101119]">
              <div className="flex justify-between items-center">
                <h3 className="text-[#f3f3f7] font-montserrat">
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
              className="bg-[#51537B] text-[#f3f3f7] px-8 py-4 rounded hover:bg-[#595B88] transition-colors self-center font-sulphur"
            >
              Ajouter un morceau
            </button>
          )}
        </>
      )}
    </div>
  );
}
