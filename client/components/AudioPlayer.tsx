import PlayRose from '@/public/circle-play-solid.svg';
import PauseRose from '@/public/circle-pause-solid.svg';
import Image from 'next/image';
import { useState } from 'react';

function AudioPlayer() {
  const [isPlayed, setIsPlayed] = useState(false);

  const handlePlay = () => {
    setIsPlayed(!isPlayed);
  };

  return (
    <div className="bg-[#1d1e2c] w-[100%] h-[10vh] flex flex-col justify-center items-start rounded-[16px] p-10">
      <h3 className="text-white text-xs">Nom de l'artiste - Titre du Morceau</h3>
      <div className="flex flex-row justify-between items-center py-2 w-[100%]">
        <Image
          src={isPlayed ? PauseRose : PlayRose}
          className="w-8 cursor-pointer"
          alt="Bouton Play"
          aria-label="Bouton play du lecteur de musique"
          onClick={handlePlay}
          onKeyDown={handlePlay}
        />
        <progress className="cursor-pointer" id="file" max="100" value="30">
          30%
        </progress>
      </div>
    </div>
  );
}

export default AudioPlayer;
