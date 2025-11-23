

import React, { useState } from 'react';
import { SoulHeart } from '../components/SoulHeart';
import { Typewriter } from '../components/Typewriter';
import { playConfirm, playMenuMove, playHeal } from '../utils/sound';
import { GameRoute } from '../types';

interface MercyViewProps {
  route: GameRoute;
  onPacifistTrigger: () => void;
}

export const MercyView: React.FC<MercyViewProps> = ({ route, onPacifistTrigger }) => {
  const [spared, setSpared] = useState(false);
  const isGenocide = route === GameRoute.GENOCIDE;

  const handleSpare = () => {
    if (isGenocide) return; // Cannot spare in genocide
    playHeal(); // Pacifist sound
    setSpared(true);
    onPacifistTrigger();
  };

  if (isGenocide) {
     return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="animate-glitch text-ut-red font-pixel text-3xl mb-8">
          * BUT NOBODY CAME.
        </div>
        {/* Still allow contact in Genocide, but it's scary */}
        <a 
          href="mailto:hello@example.com" 
          className="font-8bit text-gray-600 hover:text-ut-red text-xs transition-colors"
          onMouseEnter={() => playMenuMove()}
        >
          (send hate mail)
        </a>
      </div>
     );
  }

  if (spared) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="mb-6 animate-float">
           <SoulHeart className="w-16 h-16 text-blue-300 fill-blue-300" />
        </div>
        <Typewriter 
          text="* YOU WON! The developer is now your friend." 
          className="text-blue-300 text-center mb-4 block"
        />
        <p className="font-pixel text-white">
          (They look ready to join your party / company.)
        </p>
        <a 
          href="mailto:hello@example.com" 
          className="mt-8 font-8bit border-2 border-white px-4 py-2 bg-white text-black hover:bg-blue-100 transition-colors animate-pulse"
          onMouseEnter={() => playMenuMove()}
        >
          HIRE NOW!
        </a>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Typewriter text="* The developer is waiting for your input." />
      </div>

      <div className="flex flex-col gap-4 mt-8 overflow-y-auto custom-scrollbar">
        <div className="font-pixel text-gray-400 mb-2">* What will you do?</div>
        
        <a 
          href="mailto:hello@example.com" 
          className="group flex items-center gap-4 text-xl cursor-pointer"
          onMouseEnter={() => playMenuMove()}
        >
           <div className="w-6 opacity-0 group-hover:opacity-100">
             <SoulHeart />
           </div>
           <span className="font-8bit text-white group-hover:text-ut-yellow">
             ✉ EMAIL
           </span>
        </a>

        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer" 
          className="group flex items-center gap-4 text-xl cursor-pointer"
          onMouseEnter={() => playMenuMove()}
        >
           <div className="w-6 opacity-0 group-hover:opacity-100">
             <SoulHeart />
           </div>
           <span className="font-8bit text-white group-hover:text-ut-yellow">
             GITHUB
           </span>
        </a>

        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noreferrer" 
          className="group flex items-center gap-4 text-xl cursor-pointer"
          onMouseEnter={() => playMenuMove()}
        >
           <div className="w-6 opacity-0 group-hover:opacity-100">
             <SoulHeart />
           </div>
           <span className="font-8bit text-white group-hover:text-ut-yellow">
             LINKEDIN
           </span>
        </a>

        <button 
          onClick={handleSpare} 
          className="group flex items-center gap-4 text-xl cursor-pointer mt-8 text-ut-yellow"
          onMouseEnter={() => playMenuMove()}
        >
           <div className="w-6 opacity-0 group-hover:opacity-100">
             <SoulHeart />
           </div>
           <span className="font-8bit">
             ♥ SPARE
           </span>
        </button>
      </div>
    </div>
  );
};