import React, { useCallback, useEffect, useState } from 'react';
import { Typewriter } from './Typewriter';
import { onSkipTyping } from '../utils/typing';

interface SequentialTypingProps {
  lines: string[];
  speed?: number;
  className?: string;
  lineClassName?: string;
  accentFrom?: number;
  accentClassName?: string;
  start?: boolean;
}

// Reveals one line at a time. A global skip reveals the whole block at once.
export const SequentialTyping: React.FC<SequentialTypingProps> = ({
  lines,
  speed = 38,
  className = '',
  lineClassName = '',
  accentFrom,
  accentClassName = 'text-ut-yellow/90',
  start = true,
}) => {
  const [revealed, setRevealed] = useState(0);

  const handleComplete = useCallback(() => {
    setRevealed((current) => Math.min(current + 1, lines.length));
  }, [lines.length]);

  useEffect(() => {
    const unsubscribe = onSkipTyping(() => setRevealed(lines.length));
    return unsubscribe;
  }, [lines.length]);

  if (!start) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      {lines.map((line, index) => {
        const lineClass = `block ${lineClassName} ${accentFrom !== undefined && index >= accentFrom ? accentClassName : ''}`;

        if (index < revealed) {
          return (
            <span key={index} className={lineClass}>
              {line}
            </span>
          );
        }

        if (index === revealed) {
          return (
            <Typewriter
              key={index}
              text={line}
              speed={speed}
              enableSound={false}
              className={lineClass}
              onComplete={handleComplete}
            />
          );
        }

        return null;
      })}
    </div>
  );
};
