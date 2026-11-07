import React from 'react';
import { SKILLS } from '../constants';
import { Typewriter } from '../components/Typewriter';
import { GameRoute } from '../types';

interface ActViewProps {
  route: GameRoute;
}

export const ActView: React.FC<ActViewProps> = ({ route }) => {
  const isGenocide = route === GameRoute.GENOCIDE;
  const isPacifist = route === GameRoute.PACIFIST;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2">
        <Typewriter
          text={
            isGenocide
              ? "* EXECUTION POINTS (EXP) list."
              : isPacifist
                ? "* You checked your STATS. They shine a little brighter."
                : "* You checked your STATS."
          }
          speed={20}
          className={isGenocide ? 'text-ut-red' : isPacifist ? 'text-yellow-400' : ''}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4 overflow-y-auto custom-scrollbar pr-2">
        {SKILLS.map((skill) => (
          <div key={skill.name} className="mb-2">
            <div className="flex justify-between items-end mb-1">
              <span className={`font-8bit text-xs md:text-sm ${isGenocide ? 'text-ut-red line-through' : 'text-ut-yellow'}`}>
                {skill.name}
              </span>
              <span className={`font-pixel text-xs ${isGenocide ? 'text-ut-red' : 'text-gray-400'}`}>
                {isGenocide ? 'LOVE' : 'LV'} {isGenocide ? '??' : skill.level}
              </span>
            </div>
            <div className={`w-full h-3 border relative ${isGenocide ? 'bg-black border-ut-red' : isPacifist ? 'bg-red-900 border-yellow-400' : 'bg-red-900 border-white/30'}`}>
              <div
                className={`h-full absolute top-0 left-0 ${isGenocide ? 'bg-ut-red animate-pulse' : 'bg-ut-yellow'}`}
                style={{ width: `${isGenocide ? 100 : skill.level}%` }}
              ></div>
            </div>
            <p className={`font-pixel text-sm mt-1 ${isGenocide ? 'text-ut-red opacity-70' : isPacifist ? 'text-yellow-200' : 'text-gray-300'}`}>
              * {isGenocide ? 'DATA CORRUPTED.' : skill.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
