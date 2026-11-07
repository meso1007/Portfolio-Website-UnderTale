import React from 'react';
import { Star } from 'lucide-react';
import { SoulHeart } from './SoulHeart';
import { Typewriter } from './Typewriter';
import { playConfirm, playMenuMove } from '../utils/sound';

interface ArchiveEndingProps {
  onStay: () => void;
  onReturnTitle: () => void;
}

const STARS = [
  { left: '8%', top: '12%', size: 18, delay: '0s' },
  { left: '22%', top: '30%', size: 10, delay: '0.7s' },
  { left: '36%', top: '8%', size: 12, delay: '1.3s' },
  { left: '52%', top: '24%', size: 8, delay: '0.4s' },
  { left: '68%', top: '10%', size: 16, delay: '1.6s' },
  { left: '82%', top: '28%', size: 10, delay: '0.9s' },
  { left: '92%', top: '14%', size: 12, delay: '0.2s' },
  { left: '14%', top: '62%', size: 10, delay: '1.1s' },
  { left: '88%', top: '60%', size: 14, delay: '0.5s' },
  { left: '50%', top: '78%', size: 8, delay: '1.4s' },
];

export const ArchiveEnding: React.FC<ArchiveEndingProps> = ({ onStay, onReturnTitle }) => {
  return (
    <div className="fixed inset-0 z-[120] bg-black overflow-y-auto">
      <div className="relative min-h-full flex items-center justify-center p-6 py-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {STARS.map((star, index) => (
            <Star
              key={index}
              size={star.size}
              className="absolute text-ut-yellow/40 fill-ut-yellow/20 animate-pulse"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        <div className="relative w-full max-w-2xl text-center">
          <p className="font-pixel text-[10px] tracking-[0.4em] text-gray-500 mb-3">
            TRUE ENDING
          </p>
          <h1 className="font-8bit text-2xl md:text-5xl text-ut-yellow tracking-widest animate-pulse mb-6">
            THE ARCHIVE
          </h1>

          <div className="mb-8 flex justify-center animate-bounce">
            <SoulHeart className="w-14 h-14 md:w-16 md:h-16 text-yellow-400 fill-yellow-400" />
          </div>

          <div className="space-y-2 font-pixel text-base md:text-lg text-white mb-8">
            <Typewriter text="* You found every secret." speed={28} enableSound={false} className="block" />
            <Typewriter text="* Every route. Every file. Every quiet corner." speed={28} enableSound={false} className="block" />
            <Typewriter text="* Not many visitors make it this far." speed={28} enableSound={false} className="block" />
            <Typewriter text="* Thank you for playing." speed={28} enableSound={false} className="block" />
          </div>

          <div className="border-t border-white/20 pt-5 space-y-2 font-pixel text-xs text-gray-400">
            <p>BUILT BY SHOYA HORIUCHI</p>
            <p>INSPIRED BY UNDERTALE BY TOBY FOX</p>
            <p>MUSIC &amp; SOUND GENERATED WITH THE WEB AUDIO API</p>
          </div>

          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={() => { playConfirm(); onStay(); }}
              onMouseEnter={() => playMenuMove()}
              className="w-full md:w-auto font-8bit text-xs border-2 border-ut-yellow text-ut-yellow px-6 py-3 hover:bg-ut-yellow hover:text-black transition-colors"
            >
              STAY IN THE ROOM
            </button>
            <button
              onClick={() => { playConfirm(); onReturnTitle(); }}
              onMouseEnter={() => playMenuMove()}
              className="w-full md:w-auto font-8bit text-xs border-2 border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
            >
              RETURN TO TITLE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
