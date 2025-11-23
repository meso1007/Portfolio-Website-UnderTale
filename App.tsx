
import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { PLAYER_NAME, PLAYER_LV, PLAYER_ROLE, PLAYER_LOCATION, PLAYER_TRAITS } from './constants';
import { BattleButton } from './components/BattleButton';
import { DialogueBox } from './components/DialogueBox';
import { FightView } from './views/FightView';
import { ActView } from './views/ActView';
import { ItemView } from './views/ItemView';
import { MercyView } from './views/MercyView';
import { Typewriter } from './components/Typewriter';
import { playCancel, playEncounterSequence, playMenuMove, ensureContext, playDamage, playSave } from './utils/sound';
import { SoulHeart } from './components/SoulHeart';

const MAX_HP = 101;
const DAMAGE_PER_HIT = 25;

const WEB_DEV_PAINS = [
  "MERGE CONFLICT!",
  "PROD DB DELETED!",
  "NULL POINTER!",
  "404 NOT FOUND!",
  "LEGACY CODE!",
  "CSS OVERFLOW!",
  "GIT PUSH -F REJECTED!",
  "WIFI DISCONNECTED!",
  "NPM AUDIT FAILED!",
  "UNDEFINED IS NOT A FUNCTION!"
];

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.INTRO);
  const [showControls, setShowControls] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("./avatar.png");
  const [currentHpValue, setCurrentHpValue] = useState(MAX_HP);
  const [isAttacked, setIsAttacked] = useState(false);
  const [damageMsg, setDamageMsg] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const handleStart = async () => {
    // Resume audio context on first user interaction
    await ensureContext();
    setHasStarted(true);
    // Trigger the encounter sound sequence (Alert + Swoosh)
    playEncounterSequence();
  };

  // Simulate intro animation timeline
  useEffect(() => {
    if (hasStarted && view === ViewState.INTRO && !showControls && !isGameOver) {
      const timer = setTimeout(() => {
        setShowControls(true);
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [hasStarted, view, showControls, isGameOver]);

  const handleImageError = () => {
    setAvatarUrl(`https://api.dicebear.com/9.x/pixel-art/svg?seed=${PLAYER_NAME}`);
  };

  const handleHomeClick = () => {
    if (view !== ViewState.INTRO) {
      playCancel();
      setView(ViewState.INTRO);
    }
  };

  const handleAttack = () => {
    // Pick a random pain
    const pain = WEB_DEV_PAINS[Math.floor(Math.random() * WEB_DEV_PAINS.length)];
    setDamageMsg(pain);

    playDamage();
    setIsAttacked(true);
    
    const newHp = currentHpValue - DAMAGE_PER_HIT;
    setCurrentHpValue(newHp);

    if (newHp <= 0) {
      // Delay Game Over slightly to show the hit
      setTimeout(() => {
        setIsGameOver(true);
        setShowControls(false);
      }, 1000);
    }
    
    // Reset animation state after duration (longer now to read text)
    setTimeout(() => {
      setIsAttacked(false);
    }, 1200);
  };

  const handleRetry = () => {
    playSave();
    setIsGameOver(false);
    setCurrentHpValue(MAX_HP);
    setView(ViewState.INTRO);
    // Re-trigger intro sequence
    playEncounterSequence();
    setShowControls(false);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.INTRO:
        return (
          <div className={`flex flex-col h-full justify-center transition-all duration-100 ${isAttacked ? 'animate-shake' : ''}`}>
             <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-6">
               {/* Avatar Column */}
               <div className="flex flex-col items-center gap-6 shrink-0 mx-auto md:mx-0">
                 <div className="relative group">
                   <div 
                      className={`w-32 h-32 md:w-40 md:h-40 relative border-4 border-white bg-black p-2 transition-all duration-75`}
                      style={{
                        filter: isAttacked ? 'sepia(1) saturate(5) hue-rotate(-50deg) contrast(1.5)' : 'none',
                        transform: isAttacked ? 'translateX(-4px)' : 'none'
                      }}
                   >
                      <img 
                        src={avatarUrl}
                        onError={handleImageError}
                        alt="Player Avatar"
                        className={`w-full h-full object-contain ${!isAttacked ? 'animate-float' : ''}`}
                        style={{ imageRendering: 'pixelated' }}
                      />
                   </div>
                   {/* Name Tag */}
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border-2 border-white px-3 py-1 whitespace-nowrap z-10">
                      <span className="font-8bit text-xs text-ut-yellow uppercase">{PLAYER_ROLE}</span>
                   </div>
                 </div>

                 {/* FIGHT Button - Smooth Reveal */}
                 <div className={`w-full overflow-hidden transition-all duration-1000 ease-out ${showControls ? 'opacity-100 max-h-20 mt-2' : 'opacity-0 max-h-0 mt-0'}`}>
                   <button 
                     onClick={handleAttack}
                     className="border-2 border-ut-red px-6 py-2 hover:bg-ut-red group transition-colors flex items-center justify-center gap-2 w-full"
                     onMouseEnter={() => playMenuMove()}
                     tabIndex={showControls ? 0 : -1}
                   >
                     <span className="font-8bit text-ut-red group-hover:text-black text-sm md:text-base tracking-widest">
                       ⚔ FIGHT
                     </span>
                   </button>
                 </div>
               </div>

               {/* Stats / Bio Section */}
               <div className="flex-1 space-y-4 max-w-md w-full pt-2">
                  <div className="border-b border-white/20 pb-2">
                    <h1 className="font-8bit text-2xl md:text-3xl text-ut-yellow mb-2">
                      {PLAYER_NAME}
                    </h1>
                    <div className="flex justify-between font-pixel text-gray-400 text-sm md:text-base">
                      <span>LV {PLAYER_LV}</span>
                      <span>LOC: {PLAYER_LOCATION}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {PLAYER_TRAITS.map((trait, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="pt-1.5 shrink-0">
                          <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                        </div>
                        {/* NO SOUND for traits */}
                        <Typewriter 
                          text={trait} 
                          speed={30} 
                          className="text-sm md:text-lg text-white"
                          enableSound={false} 
                        />
                      </div>
                    ))}
                  </div>
               </div>
             </div>
             
             <div className="text-center border-t-2 border-dashed border-gray-700 pt-4 mt-auto min-h-[80px] flex flex-col justify-center">
               {/* SOUND ENABLED for encounter message */}
               {isAttacked ? (
                  <div className="flex flex-col items-center animate-pulse">
                    <span className="font-pixel text-ut-red text-lg md:text-xl whitespace-nowrap">
                      * {damageMsg}
                    </span>
                    <span className="font-8bit text-ut-red text-sm mt-1">
                      -{DAMAGE_PER_HIT} HP
                    </span>
                  </div>
               ) : (
                 <Typewriter 
                    text={`* You encountered a wild developer!`} 
                    speed={40}
                    className="text-ut-gray font-pixel"
                    enableSound={true}
                 />
               )}
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

  // Start Screen Overlay
  if (!hasStarted) {
    return (
      <div 
        className="min-h-screen bg-black text-white flex flex-col items-center justify-center cursor-pointer"
        onClick={handleStart}
      >
        <div className="animate-pulse text-center">
          <h1 className="font-8bit text-4xl text-ut-yellow mb-8">UNDERTALE PORTFOLIO</h1>
          <p className="font-8bit text-sm text-gray-400">[ CLICK TO START ]</p>
        </div>
      </div>
    );
  }

  // Game Over Screen Overlay
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center animate-pulse">
           {/* Broken Heart Visual */}
           <div className="relative mb-8">
             <SoulHeart className="w-24 h-24 text-ut-gray/50" />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-1 h-24 bg-black rotate-12 transform translate-x-1"></div>
             </div>
           </div>
           
           <h1 className="font-8bit text-4xl md:text-6xl text-white mb-8 tracking-widest">GAME OVER</h1>
           <p className="font-pixel text-gray-400 mb-12 text-center max-w-md">
             It cannot end like this...<br/>
             Stay determined!
           </p>

           <button 
             onClick={handleRetry}
             className="group flex items-center gap-4 border-2 border-white px-8 py-4 hover:bg-white transition-colors"
             onMouseEnter={() => playMenuMove()}
           >
             <SoulHeart className="opacity-0 group-hover:opacity-100 text-ut-red fill-ut-red transition-opacity" />
             <span className="font-8bit text-lg group-hover:text-black">CONTINUE</span>
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans ${isAttacked ? 'animate-shake' : ''}`}>
      
      {/* Main Container */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        
        {/* Top Stats Row - Smooth Reveal */}
        <div className={`overflow-hidden transition-all duration-1000 ease-out ${showControls ? 'opacity-100 max-h-20 mb-4' : 'opacity-0 max-h-0 mb-0'}`}>
          <div className="flex flex-wrap justify-between items-center font-8bit text-xs md:text-sm px-2 select-none">
            <div className="flex gap-4 md:gap-8">
               <button 
                 onClick={handleHomeClick}
                 onMouseEnter={() => playMenuMove()}
                 className="hover:text-ut-yellow transition-colors flex items-center gap-2 group cursor-pointer"
                 title="Return to Intro"
                 tabIndex={showControls ? 0 : -1}
               >
                 <span className="group-hover:animate-pulse underline decoration-dashed decoration-1 underline-offset-4">{PLAYER_NAME}</span>
               </button>
               <span>LV {PLAYER_LV}</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
               <span className="text-xs">HP</span>
               <div className="w-24 md:w-48 h-4 md:h-5 bg-ut-red flex items-center relative border-2 border-white/20">
                  <div 
                    className="absolute top-0 left-0 h-full bg-ut-yellow transition-all duration-300"
                    style={{ width: `${Math.max(0, (currentHpValue / MAX_HP) * 100)}%` }}
                  ></div>
                  <div className="z-10 text-[10px] text-black w-full text-center font-bold leading-none">
                    {Math.max(0, currentHpValue)} / {MAX_HP}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Main Display Area */}
        <DialogueBox title={view === ViewState.INTRO ? undefined : `MODE: ${view}`}>
          {renderContent()}
        </DialogueBox>

        {/* Control Menu */}
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
        
        {/* Footer Hint - Smooth Reveal */}
        <div className={`overflow-hidden transition-all duration-1000 ease-out ${showControls ? 'opacity-100 max-h-12 mt-8' : 'opacity-0 max-h-0 mt-0'}`}>
          <div className="text-center">
             <p className="font-pixel text-gray-500 text-sm animate-pulse">
               * (Click Name to Reset | Hover buttons to interact)
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
