import React from 'react';

interface DialogueBoxProps {
  children: React.ReactNode;
  title?: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ children, title }) => {
  return (
    <div className="relative w-full border-4 border-white min-h-[300px] md:min-h-[400px] p-6 bg-black overflow-hidden">
      {title && (
        <div className="absolute top-0 left-0 bg-white text-black px-2 py-1 font-8bit text-xs">
          {title}
        </div>
      )}
      <div className="font-pixel text-xl md:text-2xl leading-loose text-white h-full overflow-y-auto pr-2 custom-scrollbar">
        {children}
      </div>
    </div>
  );
};