
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { SoulHeart } from './SoulHeart';
import { Typewriter } from './Typewriter';
import { playConfirm, playHeal, playMenuMove, playSave } from '../utils/sound';

type EndingType = 'PACIFIST' | 'GENOCIDE';

interface EndingProps {
  type: EndingType;
  onReturnTitle: () => void;
}

export const Ending: React.FC<EndingProps> = ({ type, onReturnTitle }) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const isGenocide = type === 'GENOCIDE';

  const handleReset = () => {
    if (isGenocide && !confirmReset) {
      playConfirm();
      setConfirmReset(true);
      return;
    }
    playSave();
    onReturnTitle();
  };

  return createPortal(
    <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 ${isGenocide ? 'scanlines' : ''}`}>
      <div className="w-full max-w-xl text-center">
        {isGenocide ? (
          <>
            <div className="mb-8 animate-glitch">
              <h1 className="font-8bit text-3xl md:text-5xl text-ut-red tracking-widest">
                GAME OVER
              </h1>
            </div>
            <div className="space-y-3 font-pixel text-ut-red text-lg md:text-xl mb-10">
              <p>* But nobody came.</p>
              <p>* The repository is empty.</p>
              <p>* There is nothing left to save.</p>
            </div>
            <button
              onClick={handleReset}
              onMouseEnter={() => playMenuMove()}
              className="font-8bit text-sm md:text-base border-2 border-ut-red text-ut-red px-6 py-3 hover:bg-ut-red hover:text-black transition-colors"
            >
              {confirmReset ? 'ARE YOU SURE? PRESS AGAIN' : 'TRUE RESET'}
            </button>
            {confirmReset && (
              <p className="font-pixel text-xs text-gray-500 mt-4 animate-pulse">
                * This will erase everything.
              </p>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-center animate-bounce">
              <SoulHeart className="w-16 h-16 text-yellow-400 fill-yellow-400" />
            </div>
            <h1 className="font-8bit text-3xl md:text-5xl text-yellow-400 tracking-widest mb-8">
              THE END
            </h1>
            <div className="space-y-3 font-pixel text-white text-lg md:text-xl mb-10">
              <Typewriter text="* You spared the developer." speed={28} enableSound={false} className="block" />
              <Typewriter text="* The timeline is filled with DETERMINATION." speed={28} enableSound={false} className="block" />
              <Typewriter text="* Every project has been saved." speed={28} enableSound={false} className="block" />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a
                href="mailto:diegoshoya2017@gmail.com"
                onMouseEnter={() => playMenuMove()}
                onClick={() => playHeal()}
                className="font-8bit text-sm md:text-base border-2 border-yellow-400 text-yellow-400 px-6 py-3 hover:bg-yellow-400 hover:text-black transition-colors"
              >
                SEND OFFER LETTER
              </a>
              <button
                onClick={handleReset}
                onMouseEnter={() => playMenuMove()}
                className="font-8bit text-sm md:text-base border-2 border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
              >
                RETURN TO TITLE
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
