

import React, { useState, useEffect, useRef } from 'react';
import { ViewState, GameRoute } from './types';
import { PLAYER_NAME, PLAYER_LV, PLAYER_ROLE, PLAYER_LOCATION, PLAYER_TRAITS, INTRO_TITLE, INTRO_SUBTITLE, INTRO_START_TEXT } from './constants';
import { BattleButton } from './components/BattleButton';
import { DialogueBox } from './components/DialogueBox';
import { FightView } from './views/FightView';
import { ActView } from './views/ActView';
import { ItemView } from './views/ItemView';
import { MercyView } from './views/MercyView';
import { SecretView } from './views/SecretView';
import pixelUser from './assets/pixel-user.png';
import { Typewriter } from './components/Typewriter';
import { playCancel, playEncounterSequence, playMenuMove, ensureContext, playDamage, playSave, playGlitch } from './utils/sound';
import { SoulHeart } from './components/SoulHeart';
import { SavePoint } from './components/SavePoint';

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
  const [visitCount, setVisitCount] = useState<number>(0);
  const [city, setCity] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(''); // Initial avatar URL
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [view, setView] = useState<ViewState>(ViewState.INTRO);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isAttacked, setIsAttacked] = useState<boolean>(false);
  const [damageMsg, setDamageMsg] = useState<string>('');
  const [currentHpValue, setCurrentHpValue] = useState<number>(MAX_HP);
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(true);

  // Secret route sequence tracking
  const [buttonSequence, setButtonSequence] = useState<ViewState[]>([]);
  const [secretUnlocked, setSecretUnlocked] = useState<boolean>(false);

  // Ref to prevent double-counting in React Strict Mode
  const hasIncrementedRef = useRef(false);

  // Load visit count and city from localStorage, and fetch city if not found
  useEffect(() => {
    // Visit Count Logic - increment only once (prevent double-counting in Strict Mode)
    if (!hasIncrementedRef.current) {
      const storedVisitCount = localStorage.getItem('visit_count');
      const count = storedVisitCount ? parseInt(storedVisitCount, 10) : 0;
      const newCount = count + 1;
      setVisitCount(newCount);
      localStorage.setItem('visit_count', newCount.toString());
      hasIncrementedRef.current = true;
    } else {
      // Just load the count without incrementing
      const storedVisitCount = localStorage.getItem('visit_count');
      const count = storedVisitCount ? parseInt(storedVisitCount, 10) : 1;
      setVisitCount(count);
    }

    // City Logic
    const storedCity = localStorage.getItem('user_city');
    if (storedCity) {
      setCity(storedCity);
    } else {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.city) {
            setCity(data.city);
            localStorage.setItem('user_city', data.city);
          }
        })
        .catch(err => console.error('Failed to fetch city:', err));
    }

    // Set initial avatar URL
    setAvatarUrl(`https://api.dicebear.com/9.x/pixel-art/svg?seed=${PLAYER_NAME}`);
  }, []);

  // Auto-hide speech bubble after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const getVisitMessage = (count: number) => {
    if (count === 1) return 'Greetings. I see you have fallen into my code.';
    if (count === 2) return 'You came back. I knew you would.';
    if (count === 3) return 'Third time. Looking for secrets?';
    if (count === 4) return 'Four times. Don\'t you have work to do?';
    if (count === 5) return 'Five times? You really like checking my stats.';
    if (count < 10) return `Visit #${count}. You are filled with DETERMINATION.`;
    if (count < 20) return `${count} times... I guess we're friends now.`;
    if (count < 50) return 'You know this portfolio better than I do.';
    return '...You really have nothing better to do, do you?';
  };

  // Avatar source - always use user's image
  const avatarSrc = pixelUser;

  // Speech bubble for visit count
  const renderSpeechBubble = (
    <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-black border border-white px-3 py-1 rounded-md text-xs whitespace-nowrap">
      {getVisitMessage(visitCount)}
    </div>
  );

  // Route State
  const [gameRoute, setGameRoute] = useState<GameRoute>(GameRoute.NEUTRAL);
  const isGenocide = gameRoute === GameRoute.GENOCIDE;
  const isPacifist = gameRoute === GameRoute.PACIFIST;

  const handleStart = async () => {
    // Resume audio context on first user interaction
    await ensureContext();
    setHasStarted(true);
    // Trigger the encounter sound sequence (Alert + Swoosh)
    playEncounterSequence();
  };

  // Simulate intro animation timeline
  useEffect(() => {
    if (hasStarted && view === ViewState.INTRO && !showControls && gameRoute !== GameRoute.GENOCIDE) {
      const timer = setTimeout(() => {
        setShowControls(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, view, showControls, gameRoute]);

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
    if (isGenocide) return;

    // Pick a random pain
    const pain = WEB_DEV_PAINS[Math.floor(Math.random() * WEB_DEV_PAINS.length)];
    setDamageMsg(pain);

    playDamage();
    setIsAttacked(true);

    const newHp = currentHpValue - DAMAGE_PER_HIT;
    setCurrentHpValue(newHp);

    if (newHp <= 0) {
      // Trigger GENOCIDE Route
      setTimeout(() => {
        setGameRoute(GameRoute.GENOCIDE);
        playGlitch();
        setShowControls(true); // Keep controls shown in Genocide
        setView(ViewState.INTRO);
      }, 1000);
    }

    // Reset animation state after duration (longer now to read text)
    setTimeout(() => {
      setIsAttacked(false);
    }, 1200);
  };

  const handleRetry = () => {
    playSave();
    setGameRoute(GameRoute.NEUTRAL);
    setCurrentHpValue(MAX_HP);
    setView(ViewState.INTRO);
    playEncounterSequence();
    setShowControls(false);
  };

  const handlePacifistTrigger = () => {
    setGameRoute(GameRoute.PACIFIST);
  };

  // Handle view change with sequence tracking
  const handleViewChange = (newView: ViewState) => {
    // Don't track if already unlocked or if it's the secret view
    if (secretUnlocked || newView === ViewState.SECRET) {
      setView(newView);
      return;
    }

    // Add to sequence
    const newSequence = [...buttonSequence, newView];
    setButtonSequence(newSequence);

    // Check if the correct sequence is completed: ACT → ITEM → MERCY → FIGHT
    const correctSequence = [ViewState.ACT, ViewState.ITEM, ViewState.MERCY, ViewState.FIGHT];
    const lastFour = newSequence.slice(-4);

    if (lastFour.length === 4 &&
      lastFour[0] === correctSequence[0] &&
      lastFour[1] === correctSequence[1] &&
      lastFour[2] === correctSequence[2] &&
      lastFour[3] === correctSequence[3]) {
      // Secret unlocked!
      setSecretUnlocked(true);
      setView(ViewState.SECRET);
      playGlitch(); // Play special sound
      return;
    }

    // Normal view change
    setView(newView);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.INTRO:
        return (
          <div className={`flex flex-col h-full justify-center transition-all duration-100 ${isAttacked ? 'animate-shake' : ''}`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-6 overflow-visible">
              {/* Avatar Column */}
              <div className="flex flex-col items-center gap-6 shrink-0 mx-auto md:mx-0 overflow-visible">
                <div className="relative group overflow-visible">
                  <div
                    className={`w-40 h-40 md:w-52 md:h-52 relative border-4 ${isGenocide ? 'border-ut-red' : 'border-white'} bg-black p-2 transition-all duration-75`}
                    style={{
                      filter: isAttacked ? 'sepia(1) saturate(5) hue-rotate(-50deg) contrast(1.5)' : 'none',
                      transform: isAttacked ? 'translateX(-4px)' : 'none'
                    }}
                  >
                    {/* Avatar logic: Disappear on Genocide, Happy on Pacifist */}
                    {isGenocide ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <span className="font-pixel text-ut-red text-xs animate-pulse">NO SIGNAL</span>
                      </div>
                    ) : (
                      <img
                        src={avatarSrc}
                        onError={handleImageError}
                        alt="Player Avatar"
                        className={`w-full h-full object-contain ${!isAttacked ? 'animate-float' : ''}`}
                        style={{
                          imageRendering: 'pixelated',
                          filter: isPacifist ? 'brightness(1.2) sepia(0.2)' : 'none'
                        }}
                      />
                    )}
                  </div>

                  {/* Speech Bubble - Undertale Style (Absolute positioned) */}
                  {!isGenocide && showSpeechBubble && (
                    <div className={`absolute left-full ml-4 top-0 hidden md:block z-20 pointer-events-none transition-opacity duration-500 ${showSpeechBubble ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="bg-black border-2 border-white px-4 py-2 rounded-lg min-w-[200px] shadow-lg">
                        <span className="font-pixel text-white text-sm">
                          * {getVisitMessage(visitCount)}
                        </span>
                      </div>
                      {/* Triangle pointer (pointing left) */}
                      <div className="absolute left-0 top-4 -translate-x-2">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>
                        <div className="absolute left-[2px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-black border-b-[6px] border-b-transparent"></div>
                      </div>
                    </div>
                  )}

                  {/* Name Tag */}
                  <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border-2 ${isGenocide ? 'border-ut-red' : 'border-white'} px-3 py-1 whitespace-nowrap z-10`}>
                    <span className={`font-8bit mb-4 text-xs ${isGenocide ? 'text-ut-red' : 'text-ut-yellow'} uppercase`}>
                      {isGenocide ? 'ENEMY' : PLAYER_ROLE}
                    </span>
                  </div>
                </div>

                {/* FIGHT Button */}
                {!isGenocide && !isPacifist && (
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
                )}
              </div>

              {/* Stats / Bio Section */}
              <div className="flex-1 space-y-4 max-w-md w-full pt-2">
                <div className={`border-b ${isGenocide ? 'border-ut-red' : 'border-white/20'} pb-2`}>
                  <h1 className={`font-8bit text-2xl md:text-3xl ${isGenocide ? 'text-ut-red animate-glitch' : 'text-ut-yellow'} mb-2`}>
                    {isGenocide ? 'UNKNOWN' : PLAYER_NAME}
                  </h1>
                  <div className={`flex justify-between font-pixel ${isGenocide ? 'text-ut-red' : 'text-gray-400'} text-sm md:text-base`}>
                    <span>{isGenocide ? 'LV 99' : `LV ${PLAYER_LV}`}</span>
                    <span>{isGenocide ? 'LOC: VOID' : `LOC: ${city || PLAYER_LOCATION}`}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {isGenocide ? (
                    <div className="font-pixel text-ut-red animate-pulse">
                      * DETERMINATION EXTRACTED.<br />
                      * FILE CORRUPTED.
                    </div>
                  ) : PLAYER_TRAITS.map((trait, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="pt-1.5 shrink-0">
                        <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                      </div>
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
                  text={isGenocide
                    ? "* (The developer turned to dust.)"
                    : (isPacifist ? "* The developer is happy!" : "* You encountered a wild developer!")
                  }
                  speed={40}
                  className={`font-pixel ${isGenocide ? 'text-ut-red' : 'text-ut-gray'}`}
                  enableSound={true}
                />
              )}
            </div>
          </div>
        );
      case ViewState.FIGHT:
        return <FightView route={gameRoute} />;
      case ViewState.ACT:
        return <ActView route={gameRoute} />;
      case ViewState.ITEM:
        return <ItemView />;
      case ViewState.MERCY:
        return <MercyView route={gameRoute} onPacifistTrigger={handlePacifistTrigger} />;
      case ViewState.SECRET:
        return <SecretView route={gameRoute} />;
      default:
        return null;
    }
  };

  if (!hasStarted) {
    return (
      <div
        className="min-h-screen bg-black text-white flex flex-col items-center justify-center cursor-pointer select-none"
        onClick={handleStart}
      >
        <div className="text-center space-y-6">
          <p className="font-8bit text-gray-500 text-xs tracking-widest mb-4">
            {INTRO_TITLE}
          </p>

          <h1 className="font-8bit text-xl md:text-5xl text-ut-yellow tracking-wider animate-pulse">
            THE FALLEN ENGINEER
          </h1>

          <p className="font-8bit text-sm text-white mt-4">
            {INTRO_SUBTITLE}
          </p>

          <div className="mt-16 animate-bounce">
            <p className="font-8bit text-xs text-gray-400">
              <span className="text-red-500 mr-2 text-base">❤</span>
              {INTRO_START_TEXT}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans ${isAttacked ? 'animate-shake' : ''}`}>

      {isGenocide && <div className="scanlines"></div>}

      {/* Save Point (Guestbook) */}
      <SavePoint />

      {/* Main Container */}
      <div className="w-full max-w-4xl flex flex-col gap-6 relative z-10">

        {/* Top Stats Row */}
        <div className={`overflow-hidden transition-all duration-1000 ease-out ${showControls ? 'opacity-100 max-h-20 mb-4' : 'opacity-0 max-h-0 mb-0'}`}>
          <div className="flex flex-wrap justify-between items-center font-8bit text-xs md:text-sm px-2 select-none">
            <div className="flex gap-4 md:gap-8">
              <button
                onClick={handleHomeClick}
                onMouseEnter={() => playMenuMove()}
                className={`${isGenocide ? 'text-ut-red' : 'hover:text-ut-yellow'} transition-colors flex items-center gap-2 group cursor-pointer`}
                title="Return to Intro"
                tabIndex={showControls ? 0 : -1}
              >
                <span className="group-hover:animate-pulse underline decoration-dashed decoration-1 underline-offset-4">
                  {isGenocide ? 'RESET' : PLAYER_NAME}
                </span>
              </button>
              <span className={isGenocide ? 'text-ut-red' : ''}>
                {isGenocide ? 'LV 99' : `LV ${PLAYER_LV}`}
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className={`text-xs ${isGenocide ? 'text-ut-red' : ''}`}>HP</span>
              <div className={`w-24 md:w-48 h-4 md:h-5 ${isGenocide ? 'bg-ut-red border-ut-red' : 'bg-ut-red border-white/20'} flex items-center relative border-2`}>
                <div
                  className={`absolute top-0 left-0 h-full ${isGenocide ? 'bg-black' : 'bg-ut-yellow'} transition-all duration-300`}
                  style={{ width: `${Math.max(0, (currentHpValue / MAX_HP) * 100)}%` }}
                ></div>
                <div className="z-10 text-[10px] text-white mix-blend-difference w-full text-center font-bold leading-none">
                  {Math.max(0, currentHpValue)} / {MAX_HP}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Display Area */}
        <div className={`relative w-full border-4 ${isGenocide ? 'border-ut-red animate-pulse' : 'border-white'} min-h-[300px] md:min-h-[400px] p-6 bg-black overflow-hidden`}>
          {(view !== ViewState.INTRO) && (
            <div className={`absolute top-0 left-0 ${isGenocide ? 'bg-ut-red text-black' : 'bg-white text-black'} px-2 py-1 font-8bit text-xs`}>
              MODE: {isGenocide ? 'EXECUTION' : view}
            </div>
          )}
          <div className="font-pixel text-xl md:text-2xl leading-loose text-white h-full overflow-y-auto pr-2 custom-scrollbar">
            {renderContent()}
          </div>
        </div>

        {/* Control Menu */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-opacity duration-1000 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <BattleButton
            label={isGenocide ? "VICTIMS" : "PROJECTS"}
            iconColor="text-ut-red"
            isActive={view === ViewState.FIGHT}
            onClick={() => handleViewChange(ViewState.FIGHT)}
            colorClass="text-ut-red"
          />
          <BattleButton
            label={isGenocide ? "EXP" : "SKILLS"}
            iconColor="text-blue-400"
            isActive={view === ViewState.ACT}
            onClick={() => handleViewChange(ViewState.ACT)}
            colorClass="text-blue-400"
          />
          <BattleButton
            label={isGenocide ? "LV" : "HISTORY"}
            iconColor="text-orange-400"
            isActive={view === ViewState.ITEM}
            onClick={() => handleViewChange(ViewState.ITEM)}
            colorClass="text-orange-400"
          />
          <BattleButton
            label={isGenocide ? "NOBODY" : "CONTACT"}
            iconColor="text-ut-yellow"
            isActive={view === ViewState.MERCY}
            onClick={() => handleViewChange(ViewState.MERCY)}
            colorClass="text-ut-yellow"
          />
        </div>

        {/* Footer Hint */}
        <div className={`overflow-hidden transition-all duration-1000 ease-out ${showControls ? 'opacity-100 max-h-12 mt-8' : 'opacity-0 max-h-0 mt-0'}`}>
          <div className="text-center">
            <p className={`font-pixel text-sm animate-pulse ${isGenocide ? 'text-ut-red' : 'text-gray-500'}`}>
              {isGenocide
                ? "* (Nothing left to see here.)"
                : "* (Click Name to Reset | Look for the Star to Save)"
              }
            </p>
          </div>
        </div>

        {/* Undertale Tribute */}
        <div className={`overflow-hidden transition-all duration-1000 ease-out ${showControls ? 'opacity-100 max-h-8 mt-4' : 'opacity-0 max-h-0 mt-0'}`}>
          <div className="text-center">
            <p className={`font-pixel text-xs ${isGenocide ? 'text-ut-red/50' : 'text-gray-600'}`}>
              Inspired by UNDERTALE by Toby Fox
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;