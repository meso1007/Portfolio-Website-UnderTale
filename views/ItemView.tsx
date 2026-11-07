
import React from 'react';
import { HISTORY } from '../constants';
import { SoulHeart } from '../components/SoulHeart';
import { playMenuMove, playSave } from '../utils/sound';
import { GameRoute } from '../types';

interface ItemViewProps {
  route: GameRoute;
}

export const ItemView: React.FC<ItemViewProps> = ({ route }) => {
  const isGenocide = route === GameRoute.GENOCIDE;
  const isPacifist = route === GameRoute.PACIFIST;

  if (isGenocide) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="animate-glitch text-ut-red font-pixel text-2xl md:text-3xl mb-6">
          * FILE CORRUPTED.
        </div>
        <p className="font-pixel text-ut-red/70 text-sm">
          * No records remain.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
       <div className={`mb-6 font-pixel ${isPacifist ? 'text-yellow-400' : 'text-gray-400'}`}>
        * You opened your INVENTORY.
      </div>

      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
        {HISTORY.map((item, idx) => (
          <div key={idx} className="flex gap-4 group" onMouseEnter={() => playMenuMove()}>
            <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <SoulHeart />
            </div>
            <div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                <span className={`font-8bit text-sm ${isPacifist ? 'text-yellow-400' : 'text-ut-yellow'}`}>{item.role}</span>
                <span className="font-8bit text-white text-xs">@ {item.company}</span>
              </div>
              <div className="font-pixel text-gray-500 text-sm mb-1">{item.year}</div>
              <div className="font-pixel text-white text-lg leading-snug">
                * {item.description}
              </div>
            </div>
          </div>
        ))}

        {isPacifist && (
          <div className="font-pixel text-yellow-400 text-sm">
            * Everyone you met is cheering for you.
          </div>
        )}

        <div className="mt-8 border-t border-white/20 pt-4 pb-4">
           <div
             className="flex gap-4 group cursor-pointer"
             onMouseEnter={() => playMenuMove()}
             onClick={() => playSave()}
           >
             <div className="pt-1 opacity-0 group-hover:opacity-100">
               <SoulHeart />
             </div>
             <span className="font-8bit text-ut-yellow text-sm hover:underline">
               USE ITEM: DOWNLOAD RESUME (PDF)
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};
