import React from 'react';
import { Heart } from 'lucide-react';

interface SoulHeartProps {
  className?: string;
}

export const SoulHeart: React.FC<SoulHeartProps> = ({ className = "" }) => {
  return (
    <Heart 
      className={`fill-ut-red text-ut-red ${className}`} 
      size={16} 
      strokeWidth={0}
    />
  );
};