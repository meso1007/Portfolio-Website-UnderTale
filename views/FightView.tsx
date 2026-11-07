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
  const projects = PROJECTS;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const isGenocide = route === GameRoute.GENOCIDE;
  const isPacifist = route === GameRoute.PACIFIST;

  const handleProjectClick = (p: Project) => {
    if (isGenocide) return;
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
        <div className={`flex items-baseline justify-between mb-4 border-b-2 ${isPacifist ? 'border-yellow-400 border-solid' : 'border-dashed border-gray-600'} pb-2 shrink-0`}>
          <h2 className="font-8bit text-ut-yellow text-lg md:text-xl animate-pulse">
            * {selectedProject.name}
          </h2>
          <div className="font-pixel text-gray-400 text-sm">
            ATK {selectedProject.stats.atk} | DEF {selectedProject.stats.def}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
          {/* Project Image Frame */}
          <div className="w-full flex justify-center mb-6">
            <div className="border-4 border-white bg-gray-900 p-1 group relative overflow-hidden max-w-xs w-full">
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  src={selectedProject.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
              </div>
            </div>
          </div>

          <div className="mb-4 font-pixel text-xl md:text-2xl text-white">
            <Typewriter text={`* ${selectedProject.description}`} />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedProject.tech.map(t => (
              <span key={t} className="border border-white text-ut-yellow px-2 py-1 text-xs font-8bit">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 pt-4 border-t border-gray-800 mt-auto bg-black shrink-0 flex-wrap">
          <a
            href={selectedProject.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-ut-yellow group cursor-pointer"
            onMouseEnter={() => playMenuMove()}
            onClick={() => playConfirm()}
          >
            <SoulHeart className="opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="font-8bit text-sm underline decoration-2">VIEW ON GITHUB</span>
          </a>
          {selectedProject.demo && (
            <a
              href={selectedProject.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-ut-yellow group cursor-pointer"
              onMouseEnter={() => playMenuMove()}
              onClick={() => playConfirm()}
            >
              <SoulHeart className="opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-8bit text-sm underline decoration-2">LIVE DEMO</span>
            </a>
          )}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 hover:text-ut-yellow group ml-auto"
            onMouseEnter={() => playMenuMove()}
          >
            <SoulHeart className="opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="font-8bit text-sm">BACK</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className={`mb-4 font-pixel ${isGenocide ? 'text-ut-red' : 'text-gray-400'}`}>
        {isGenocide ? "* But nobody came." : "* You encounter various projects!"}
      </div>
      <ul className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {projects.map((p) => (
          <li
            key={p.id}
            className={`group flex items-center gap-3 pl-2 py-2 transition-colors ${isGenocide ? 'cursor-default' : 'cursor-pointer hover:bg-gray-900'}`}
            onClick={() => handleProjectClick(p)}
            onMouseEnter={() => { if (!isGenocide) playMenuMove(); }}
          >
            <div className={`w-4 transition-opacity ${isGenocide ? 'text-ut-red' : 'opacity-0 group-hover:opacity-100'}`}>
              {isGenocide && <SoulHeart />}
            </div>
            <div className="flex-1 flex justify-between items-center pr-4">
              <span className={`font-8bit text-sm md:text-base uppercase tracking-wider ${isGenocide ? 'text-gray-500 line-through' : 'text-white group-hover:text-ut-yellow'}`}>
                {p.name}
              </span>
              {!isGenocide && (
                <div className="hidden md:block w-24 h-4 bg-red-900 border border-gray-600 relative">
                  <div
                    className="h-full bg-green-500 absolute top-0 left-0"
                    style={{ width: `${(p.stats.def / 100) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {isPacifist && (
        <div className="mt-6 font-pixel text-yellow-400 animate-pulse">
          * Every project has been saved.
        </div>
      )}
    </div>
  );
};
