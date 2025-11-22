import React, { useState } from 'react';
import { SoulHeart } from '../components/SoulHeart';
import { Typewriter } from '../components/Typewriter';

export const MercyView: React.FC = () => {
  const [spared, setSpared] = useState(false);

  const handleSpare = () => {
    setSpared(true);
  };

  if (spared) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="mb-6 animate-float">
           <SoulHeart className="w-16 h-16 text-ut-yellow fill-ut-yellow" />
        </div>
        <Typewriter 
          text="* YOU WON! You gained 0 XP and 150 gold." 
          className="text-ut-yellow text-center mb-4 block"
        />
        <p className="font-pixel text-gray-400">
          (The developer has been notified of your mercy. Or you can just email them.)
        </p>
        <a href="mailto:hello@example.com" className="mt-8 font-8bit border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">
          SEND EMAIL
        </a>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Typewriter text="* The developer is waiting for your input." />
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="font-pixel text-gray-400 mb-2">* What will you do?</div>
        
        <a href="mailto:hello@example.com" className="group flex items-center gap-4 text-xl cursor-pointer">
           <div className="w-6 opacity-0 group-hover:opacity-100">
             <SoulHeart />
           </div>
           <span className="font-8bit text-white group-hover:text-ut-yellow">
             ✉ EMAIL
           </span>
        </a>

        <a href="https://github.com" target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-xl cursor-pointer">
           <div className="w-6 opacity-0 group-hover:opacity-100">
             <SoulHeart />
           </div>
           <span className="font-8bit text-white group-hover:text-ut-yellow">
             GITHUB
           </span>
        </a>

        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-xl cursor-pointer">
           <div className="w-6 opacity-0 group-hover:opacity-100">
             <SoulHeart />
           </div>
           <span className="font-8bit text-white group-hover:text-ut-yellow">
             LINKEDIN
           </span>
        </a>

        <button onClick={handleSpare} className="group flex items-center gap-4 text-xl cursor-pointer mt-8 text-ut-yellow">
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