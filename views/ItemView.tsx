import React from 'react';
import { HISTORY } from '../constants';
import { SoulHeart } from '../components/SoulHeart';

export const ItemView: React.FC = () => {
  return (
    <div className="h-full">
       <div className="mb-6 font-pixel text-gray-400">
        * You opened your INVENTORY.
      </div>

      <div className="space-y-6">
        {HISTORY.map((item, idx) => (
          <div key={idx} className="flex gap-4 group">
            <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <SoulHeart />
            </div>
            <div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                <span className="font-8bit text-ut-yellow text-sm">{item.role}</span>
                <span className="font-8bit text-white text-xs">@ {item.company}</span>
              </div>
              <div className="font-pixel text-gray-500 text-sm mb-1">{item.year}</div>
              <div className="font-pixel text-white text-lg leading-snug">
                * {item.description}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-8 border-t border-white/20 pt-4">
           <div className="flex gap-4 group cursor-pointer">
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