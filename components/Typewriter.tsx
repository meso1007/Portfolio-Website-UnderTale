import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 30, 
  onComplete,
  className = ""
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
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current += 1;
      } else {
        if (timerRef.current) window.clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [text, speed, onComplete]);

  return (
    <span className={`font-pixel text-xl md:text-2xl leading-relaxed whitespace-pre-wrap ${className}`}>
      {displayedText}
    </span>
  );
};