import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../constants';
import { SoulHeart } from '../components/SoulHeart';
import { Typewriter } from '../components/Typewriter';

export const FightView: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 mb-4 border-b-2 border-dashed border-gray-600 pb-4">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-8bit text-ut-yellow text-lg md:text-xl animate-pulse">
              * {selectedProject.name}
            </h2>
            <div className="font-pixel text-gray-400 text-sm">
              ATK {selectedProject.stats.atk} | DEF {selectedProject.stats.def}
            </div>
          </div>
          
          <div className="mb-4 font-pixel text-xl">
            <Typewriter text={`* ${selectedProject.description}`} />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedProject.tech.map(t => (
              <span key={t} className="border border-white px-2 py-1 text-xs font-8bit text-ut-yellow">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-auto">
           <a 
             href={selectedProject.link}
             className="flex items-center gap-2 hover:text-ut-yellow group cursor-pointer"
           >
             <SoulHeart className="opacity-0 group-hover:opacity-100" />
             <span className="font-8bit text-sm underline decoration-2">CHECK SOURCE</span>
           </a>
           <button 
             onClick={() => setSelectedProject(null)}
             className="flex items-center gap-2 hover:text-ut-yellow group"
           >
             <SoulHeart className="opacity-0 group-hover:opacity-100" />
             <span className="font-8bit text-sm">BACK</span>
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 font-pixel text-gray-400">
        * You encounter various projects!
      </div>
      <ul className="space-y-4">
        {PROJECTS.map((p) => (
          <li 
            key={p.id} 
            className="group cursor-pointer flex items-center gap-3 pl-2 hover:bg-gray-900 py-2"
            onClick={() => setSelectedProject(p)}
          >
            <div className="w-4 opacity-0 group-hover:opacity-100">
              <SoulHeart />
            </div>
            <div className="flex-1 flex justify-between items-center pr-4">
              <span className="font-8bit text-sm md:text-base uppercase tracking-wider">
                {p.name}
              </span>
              {/* HP Bar simulation for the project */}
              <div className="hidden md:block w-24 h-4 bg-red-900 border border-gray-600">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                ></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};