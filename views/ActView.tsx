import React from 'react';
import { SKILLS } from '../constants';
import { Typewriter } from '../components/Typewriter';

export const ActView: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-2">
        <Typewriter text="* You checked your STATS." speed={20} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4 overflow-y-auto custom-scrollbar pr-2">
        {SKILLS.map((skill) => (
          <div key={skill.name} className="mb-2">
            <div className="flex justify-between items-end mb-1">
              <span className="font-8bit text-ut-yellow text-xs md:text-sm">{skill.name}</span>
              <span className="font-pixel text-xs text-gray-400">LV {skill.level}</span>
            </div>
            <div className="w-full h-3 bg-red-900 border border-white/30 relative">
              <div 
                className="h-full bg-ut-yellow absolute top-0 left-0"
                style={{ width: `${(skill.level / 20) * 100}%` }}
              ></div>
            </div>
            <p className="font-pixel text-sm mt-1 text-gray-300">
              * {skill.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};