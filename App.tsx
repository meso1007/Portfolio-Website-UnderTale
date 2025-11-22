import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { PLAYER_NAME, PLAYER_LV, PLAYER_HP, PLAYER_ROLE, PLAYER_LOCATION, PLAYER_TRAITS } from './constants';
import { BattleButton } from './components/BattleButton';
import { DialogueBox } from './components/DialogueBox';
import { FightView } from './views/FightView';
import { ActView } from './views/ActView';
import { ItemView } from './views/ItemView';
import { MercyView } from './views/MercyView';
import { Typewriter } from './components/Typewriter';
import { SoulHeart } from './components/SoulHeart';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.INTRO);
  const [showControls, setShowControls] = useState(false);

  // Simulate intro animation
  useEffect(() => {
    if (view === ViewState.INTRO && !showControls) {
      const timer = setTimeout(() => {
        setShowControls(true);
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [view, showControls]);

  const renderContent = () => {
    switch (view) {
      case ViewState.INTRO:
        return (
          <div className="flex flex-col h-full justify-center">
             <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-6">
               {/* Avatar Section */}
               <div className="relative group">
                 <div className="w-32 h-32 md:w-40 md:h-40 relative animate-float border-4 border-white bg-black p-2">
                    <img 
                      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${PLAYER_NAME}`}
                      alt="Player Avatar"
                      className="w-full h-full object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                 </div>
                 {/* Name Tag */}
                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border-2 border-white px-3 py-1 whitespace-nowrap">
                    <span className="font-8bit text-xs text-ut-yellow uppercase">{PLAYER_ROLE}</span>
                 </div>
               </div>

               {/* Stats / Bio Section */}
               <div className="flex-1 space-y-4 max-w-md">
                  <div>
                    <h1 className="font-8bit text-2xl md:text-3xl text-ut-yellow mb-2">
                      {PLAYER_NAME}
                    </h1>
                    <div className="flex gap-4 font-pixel text-gray-400 text-sm md:text-base">
                      <span>LV {PLAYER_LV}</span>
                      <span>LOC: {PLAYER_LOCATION}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {PLAYER_TRAITS.map((trait, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="pt-1.5">
                          <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                        </div>
                        <Typewriter 
                          text={trait} 
                          speed={30} 
                          className="text-sm md:text-lg text-white"
                        />
                      </div>
                    ))}
                  </div>
               </div>
             </div>
             
             <div className="text-center border-t-2 border-dashed border-gray-700 pt-4 mt-auto">
               <Typewriter 
                  text={`* You encountered a wild developer!`} 
                  speed={40}
                  className="text-ut-gray font-pixel"
               />
             </div>
          </div>
        );
      case ViewState.FIGHT:
        return <FightView />;
      case ViewState.ACT:
        return <ActView />;
      case ViewState.ITEM:
        return <ItemView />;
      case ViewState.MERCY:
        return <MercyView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      
      {/* Main Container */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        
        {/* Top Stats Row (like Undertale battle header) */}
        {showControls && (
          <div className="flex flex-wrap justify-between items-center font-8bit text-xs md:text-sm px-2 mb-4">
            <div className="flex gap-4 md:gap-8 select-none">
               {/* Clickable Name to return Home/Intro */}
               <button 
                 onClick={() => setView(ViewState.INTRO)}
                 className="hover:text-ut-yellow transition-colors flex items-center gap-2 group"
                 title="Reset / Home"
               >
                 <span className="group-hover:animate-pulse">{PLAYER_NAME}</span>
               </button>
               <span>LV {PLAYER_LV}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
               <span className="text-xs">HP</span>
               <div className="w-24 md:w-48 h-4 md:h-5 bg-ut-red flex items-center relative border-2 border-white/20">
                  <div className="absolute top-0 left-0 h-full bg-ut-yellow w-full animate-pulse"></div>
                  <div className="z-10 text-[10px] text-black w-full text-center font-bold leading-none">
                    {PLAYER_HP}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Main Display Area */}
        <DialogueBox title={view === ViewState.INTRO ? undefined : `MODE: ${view}`}>
          {renderContent()}
        </DialogueBox>

        {/* Control Menu (Only show after intro) */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-opacity duration-1000 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <BattleButton 
            label="PROJECTS" 
            iconColor="text-ut-red"
            isActive={view === ViewState.FIGHT}
            onClick={() => setView(ViewState.FIGHT)}
            colorClass="text-ut-red"
          />
          <BattleButton 
            label="SKILLS" 
            iconColor="text-blue-400"
            isActive={view === ViewState.ACT}
            onClick={() => setView(ViewState.ACT)}
            colorClass="text-blue-400"
          />
          <BattleButton 
            label="HISTORY" 
            iconColor="text-orange-400"
            isActive={view === ViewState.ITEM}
            onClick={() => setView(ViewState.ITEM)}
            colorClass="text-orange-400"
          />
          <BattleButton 
            label="CONTACT" 
            iconColor="text-ut-yellow"
            isActive={view === ViewState.MERCY}
            onClick={() => setView(ViewState.MERCY)}
            colorClass="text-ut-yellow"
          />
        </div>
        
        {/* Footer Hint */}
        {showControls && (
          <div className="text-center mt-8">
             <p className="font-pixel text-gray-500 text-sm animate-pulse">
               * (Click Name to Reset | Hover buttons to interact)
             </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;