import React from 'react';
import { SoulHeart } from './SoulHeart';

interface BattleButtonProps {
  label: string;
  iconColor: string; // Actually just used for active state styling differentiation if needed
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
  return (
    <button
      onClick={onClick}
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
      {/* Content Container */}
      <div className={`
        flex items-center justify-center 
        w-full max-w-full
        transition-all duration-200 ease-out
        ${isActive ? 'gap-1.5 md:gap-3' : 'gap-0'}
      `}>
        
        {/* Heart Cursor: Collapses to 0 width when inactive */}
        <div className={`
          flex-shrink-0 flex items-center justify-center overflow-hidden
          transition-all duration-200 ease-out
          ${isActive ? 'w-3 h-3 md:w-4 md:h-4 opacity-100' : 'w-0 opacity-0'}
        `}>
          <SoulHeart className="w-full h-full animate-pulse" />
        </div>

        {/* Text */}
        <span className={`
          font-8bit uppercase tracking-widest truncate
          text-[10px] sm:text-xs md:text-sm lg:text-base
          ${isActive ? colorClass : 'text-ut-yellow'}
        `}>
          {label}
        </span>
      </div>
    </button>
  );
};