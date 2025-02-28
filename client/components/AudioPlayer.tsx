import PlayRose from '@/public/circle-play-solid.svg';
import PauseRose from '@/public/circle-pause-solid.svg';
import Image from 'next/image';
import { useState, useEffect } from 'react';

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

function AudioPlayer({ tracks = [], onAddTrack, onDeleteTrack }: AudioPlayerProps) {
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);

  const handlePlay = (trackId: number) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      {tracks.length === 0 ? (
        <div className="bg-[#1D1E2C] w-full p-6 rounded-lg text-center">
          {onAddTrack && tracks.length < 3 && (
            <button
              type="submit"
              onClick={onAddTrack}
              className="bg-[#a71666] text-[#F2F6FF] px-4 py-2 rounded hover:bg-[#8f1357] transition-colors font-montserrat"
            >
              Ajouter un morceau
            </button>
          )}
        </div>
      ) : (
        <>
          {tracks.map((track) => (
            <div key={track.id} className="bg-[#1D1E2C] w-full rounded-lg p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[#F2F6FF] font-montserrat">
                  {track.artist} - {track.title}
                </h3>
                <div className="flex items-center gap-4">
                  {onDeleteTrack && (
                    <button
                      type="submit"
                      onClick={() => onDeleteTrack(track.id)}
                      className="text-[#F2F6FF] hover:text-red-500 transition-colors"
                      aria-label="Supprimer le morceau"
                    >
                      ×
                    </button>
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
              type="submit"
              onClick={onAddTrack}
              className="bg-[#a71666] text-[#F2F6FF] px-4 py-2 rounded hover:bg-[#8f1357] transition-colors self-center font-sulphur"
            >
              Ajouter un morceau
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default AudioPlayer;
