

import React, { useState } from 'react';
import { Project, GameRoute } from '../types';
import { PROJECTS } from '../constants';
import { SoulHeart } from '../components/SoulHeart';
import { Typewriter } from '../components/Typewriter';
import { playConfirm, playMenuMove, playCancel } from '../utils/sound';

interface FightViewProps {
  route: GameRoute;
}

export const FightView: React.FC<FightViewProps> = ({ route }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const isGenocide = route === GameRoute.GENOCIDE;

  const handleProjectClick = (p: Project) => {
    playConfirm();
    setSelectedProject(p);
  };

  const handleBack = () => {
    playCancel();
    setSelectedProject(null);
  };

  if (selectedProject) {
    return (
      <div className="flex flex-col h-full relative">
        {/* Header Stats */}
        <div className={`flex items-baseline justify-between mb-4 border-b-2 ${isGenocide ? 'border-ut-red border-solid' : 'border-dashed border-gray-600'} pb-2 shrink-0`}>
          <h2 className={`font-8bit ${isGenocide ? 'text-ut-red' : 'text-ut-yellow'} text-lg md:text-xl animate-pulse`}>
            * {selectedProject.name}
          </h2>
          <div className="font-pixel text-gray-400 text-sm">
            ATK {selectedProject.stats.atk} | DEF {selectedProject.stats.def}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
          {/* Project Image Frame - Smaller and Centered */}
          {selectedProject.image && (
            <div className="w-full flex justify-center mb-6">
              <div className={`border-4 ${isGenocide ? 'border-ut-red' : 'border-white'} bg-gray-900 p-1 group relative overflow-hidden max-w-xs w-full`}>
                <div className="aspect-video w-full overflow-hidden relative">
                   <img 
                    src={selectedProject.image} 
                    alt={selectedProject.name}
                    className={`w-full h-full object-cover ${isGenocide ? 'grayscale contrast-200 brightness-50' : 'grayscale group-hover:grayscale-0'} transition-all duration-500 ease-in-out`}
                  />
                  {/* Scanline effect overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
                </div>
              </div>
            </div>
          )}

          <div className={`mb-4 font-pixel text-xl md:text-2xl ${isGenocide ? 'text-ut-red' : 'text-white'}`}>
            <Typewriter text={`* ${selectedProject.description}`} />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedProject.tech.map(t => (
              <span key={t} className={`border ${isGenocide ? 'border-ut-red text-ut-red' : 'border-white text-ut-yellow'} px-2 py-1 text-xs font-8bit`}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-4 pt-4 border-t border-gray-800 mt-auto bg-black shrink-0">
           <a 
             href={selectedProject.link}
             className={`flex items-center gap-2 ${isGenocide ? 'hover:text-ut-red' : 'hover:text-ut-yellow'} group cursor-pointer`}
             onMouseEnter={() => playMenuMove()}
             onClick={() => playConfirm()}
           >
             <SoulHeart className={`opacity-0 group-hover:opacity-100 transition-opacity ${isGenocide ? 'text-ut-red fill-ut-red' : ''}`} />
             <span className="font-8bit text-sm underline decoration-2">CHECK SOURCE</span>
           </a>
           <button 
             onClick={handleBack}
             className={`flex items-center gap-2 ${isGenocide ? 'hover:text-ut-red' : 'hover:text-ut-yellow'} group ml-auto`}
             onMouseEnter={() => playMenuMove()}
           >
             <SoulHeart className={`opacity-0 group-hover:opacity-100 transition-opacity ${isGenocide ? 'text-ut-red fill-ut-red' : ''}`} />
             <span className="font-8bit text-sm">BACK</span>
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className={`mb-4 font-pixel ${isGenocide ? 'text-ut-red' : 'text-gray-400'}`}>
        {isGenocide ? "* IN MY WAY." : "* You encounter various projects!"}
      </div>
      <ul className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {PROJECTS.map((p) => (
          <li 
            key={p.id} 
            className="group cursor-pointer flex items-center gap-3 pl-2 hover:bg-gray-900 py-2 transition-colors"
            onClick={() => handleProjectClick(p)}
            onMouseEnter={() => playMenuMove()}
          >
            <div className={`w-4 opacity-0 group-hover:opacity-100 transition-opacity ${isGenocide ? 'text-ut-red' : ''}`}>
              <SoulHeart />
            </div>
            <div className="flex-1 flex justify-between items-center pr-4">
              <span className={`font-8bit text-sm md:text-base uppercase tracking-wider ${isGenocide ? 'text-gray-500 group-hover:text-ut-red line-through' : 'text-white group-hover:text-ut-yellow'}`}>
                {p.name}
              </span>
              {/* HP Bar simulation for the project */}
              <div className="hidden md:block w-24 h-4 bg-red-900 border border-gray-600 relative">
                {isGenocide ? (
                   <div className="h-full bg-gray-600 absolute top-0 left-0 w-0"></div>
                ) : (
                   <div 
                    className="h-full bg-green-500 absolute top-0 left-0" 
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                   ></div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};