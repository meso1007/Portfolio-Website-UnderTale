

import React, { useState } from 'react';
import { Mail, Github, Linkedin, Instagram } from 'lucide-react';
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
    if (isGenocide) return;
    playHeal();
    setSpared(true);
    onPacifistTrigger();
  };

  if (isGenocide) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="animate-glitch text-ut-red font-pixel text-3xl mb-8">
          * BUT NOBODY CAME.
        </div>
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
      <div className="h-full flex flex-col items-center justify-center text-center pt-10">
        <div className="mb-6 animate-bounce">
          <SoulHeart className="w-16 h-16 text-yellow-400 fill-yellow-400" />
        </div>

        <Typewriter
          text="* YOU WON! The developer is now your friend."
          className="text-yellow-400 text-center mb-4 block text-xl"
        />

        <p className="font-pixel text-gray-300 mb-8 text-sm">
          (They look ready to join your party / company.)
        </p>

        <a
          href="mailto:diegoshoya2017@gmail.com"
          className="font-8bit border-4 border-yellow-400 px-6 py-3 bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors animate-pulse"
          onMouseEnter={() => playMenuMove()}
          onClick={() => playHeal()}
        >
          SEND OFFER LETTER
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
          href="mailto:diegoshoya2017@gmail.com"
          className="group flex items-center gap-4 text-xl cursor-pointer"
          onMouseEnter={() => playMenuMove()}
        >
          <div className="w-6 opacity-0 group-hover:opacity-100">
            <SoulHeart />
          </div>
          <span className="font-8bit text-white group-hover:text-ut-yellow flex items-center gap-2">
            <Mail size={16} /> EMAIL
          </span>
        </a>

        <a
          href="https://github.com/meso1007"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-4 text-xl cursor-pointer"
          onMouseEnter={() => playMenuMove()}
        >
          <div className="w-6 opacity-0 group-hover:opacity-100">
            <SoulHeart />
          </div>
          <span className="font-8bit text-white group-hover:text-ut-yellow flex items-center gap-2">
            <Github size={16} /> GITHUB
          </span>
        </a>

        <a
          href="https://www.linkedin.com/in/shoya-horiuchi-83b785278/"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-4 text-xl cursor-pointer"
          onMouseEnter={() => playMenuMove()}
        >
          <div className="w-6 opacity-0 group-hover:opacity-100">
            <SoulHeart />
          </div>
          <span className="font-8bit text-white group-hover:text-ut-yellow flex items-center gap-2">
            <Linkedin size={16} /> LINKEDIN
          </span>
        </a>

        <a
          href="https://www.instagram.com/sh02__nmi/"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-4 text-xl cursor-pointer"
          onMouseEnter={() => playMenuMove()}
        >
          <div className="w-6 opacity-0 group-hover:opacity-100">
            <SoulHeart />
          </div>
          <span className="font-8bit text-white group-hover:text-ut-yellow flex items-center gap-2">
            <Instagram size={16} /> INSTAGRAM
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