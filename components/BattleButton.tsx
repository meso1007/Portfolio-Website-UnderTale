
import React from 'react';
import { SoulHeart } from './SoulHeart';
import { playSelect, playMenuMove } from '../utils/sound';

interface BattleButtonProps {
  label: string;
  iconColor: string; // Used for active state styling differentiation
  isActive: boolean;
  onClick: () => void;
  colorClass?: string; // For the text color when active
}

export const BattleButton: React.FC<BattleButtonProps> = ({ 
  label, 
  isActive, 
  onClick,
  colorClass = "text-ut-yellow"
}) => {
  
  const handleClick = () => {
    playSelect();
    onClick();
  };

  const handleMouseEnter = () => {
    playMenuMove();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`
        group
        flex items-center justify-center 
        border-2 border-ut-yellow
        px-1 py-3 md:px-4 md:py-4
        w-full
        transition-all duration-75
        ${isActive ? 'bg-ut-gray/20' : 'hover:bg-ut-gray/10'}
      `}
    >
      {/* 
        Layout Strategy:
        Flex container centers the content.
        The heart icon has 0 width when inactive, preserving true center for text.
        When active, it expands, naturally pushing text to the right.
      */}
      <div className="flex items-center justify-center transition-all duration-200">
        
        {/* Heart Cursor Container */}
        <div className={`
          flex items-center justify-center overflow-hidden
          transition-all duration-200 ease-out
          ${isActive ? 'w-4 mr-2 opacity-100' : 'w-0 mr-0 opacity-0'}
        `}>
          <SoulHeart className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
        </div>

        {/* Text */}
        <span className={`
          font-8bit uppercase tracking-widest truncate
          text-[10px] sm:text-xs md:text-sm
          ${isActive ? colorClass : 'text-ut-yellow'}
        `}>
          {label}
        </span>
      </div>
    </button>
  );
};
