
import React, { useState, useEffect, useRef } from 'react';
import { playText } from '../utils/sound';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  enableSound?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 30, 
  onComplete,
  className = "",
  enableSound = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    if (timerRef.current) window.clearInterval(timerRef.current);
    
    timerRef.current = window.setInterval(() => {
      if (indexRef.current < text.length) {
        const char = text.charAt(indexRef.current);
        setDisplayedText((prev) => prev + char);
        indexRef.current += 1;
        
        // Play sound for non-space characters if enabled
        if (enableSound && char.trim() !== '') {
          playText();
        }
      } else {
        if (timerRef.current) window.clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [text, speed, onComplete, enableSound]);

  return (
    <span className={`font-pixel text-xl md:text-2xl leading-relaxed whitespace-pre-wrap ${className}`}>
      {displayedText}
    </span>
  );
};
