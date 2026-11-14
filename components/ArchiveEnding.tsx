import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Star } from 'lucide-react';
import { SoulHeart } from './SoulHeart';
import { Typewriter } from './Typewriter';
import { playConfirm, playHeal, playMenuMove, playSave } from '../utils/sound';
import { setBgmTrack } from '../utils/bgm';
import { isAchievementUnlocked } from '../utils/achievements';
import { isTyping, skipTyping } from '../utils/typing';

interface ArchiveEndingProps {
    onStay: () => void;
    onReturnTitle: () => void;
}

const STARS = [
    { left: '6%', top: '12%', size: 18, delay: '0s' },
    { left: '18%', top: '34%', size: 9, delay: '1.2s' },
    { left: '29%', top: '8%', size: 12, delay: '2.4s' },
    { left: '41%', top: '22%', size: 7, delay: '0.8s' },
    { left: '53%', top: '6%', size: 16, delay: '3.0s' },
    { left: '64%', top: '28%', size: 10, delay: '1.8s' },
    { left: '76%', top: '10%', size: 13, delay: '0.4s' },
    { left: '88%', top: '24%', size: 9, delay: '2.0s' },
    { left: '94%', top: '8%', size: 11, delay: '1.0s' },
    { left: '10%', top: '66%', size: 10, delay: '2.8s' },
    { left: '24%', top: '82%', size: 8, delay: '1.4s' },
    { left: '44%', top: '72%', size: 12, delay: '0.6s' },
    { left: '62%', top: '86%', size: 8, delay: '2.2s' },
    { left: '79%', top: '68%', size: 14, delay: '1.6s' },
    { left: '91%', top: '80%', size: 9, delay: '0.2s' },
];

const SHOOTING_STARS = [
    { left: '88%', top: '8%', delay: '0.6s', duration: '5.5s', width: '9rem', opacity: 0.9 },
    { left: '64%', top: '16%', delay: '3.2s', duration: '7s', width: '7rem', opacity: 0.55 },
    { left: '96%', top: '30%', delay: '6.0s', duration: '6s', width: '10rem', opacity: 0.8 },
    { left: '72%', top: '44%', delay: '9.4s', duration: '8s', width: '6rem', opacity: 0.45 },
    { left: '42%', top: '12%', delay: '12.0s', duration: '6.5s', width: '8rem', opacity: 0.7 },
    { left: '90%', top: '58%', delay: '15.5s', duration: '7.5s', width: '7rem', opacity: 0.5 },
    { left: '55%', top: '28%', delay: '18.0s', duration: '9s', width: '5rem', opacity: 0.4 },
    { left: '80%', top: '74%', delay: '21.0s', duration: '6s', width: '9rem', opacity: 0.85 },
];

const readNumber = (storage: Storage, key: string, fallback: number): number => {
    try {
        const value = Number(storage.getItem(key));
        return Number.isFinite(value) ? value : fallback;
    } catch {
        return fallback;
    }
};

const SaveRow: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
    <div className="flex items-baseline gap-3">
        <span className="font-pixel text-xs text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="flex-1 border-b border-dotted border-white/15" />
        <span className={`font-8bit text-[10px] ${accent ? 'text-ut-yellow' : 'text-gray-200'}`}>{value}</span>
    </div>
);

export const ArchiveEnding: React.FC<ArchiveEndingProps> = ({ onStay, onReturnTitle }) => {
    const [step, setStep] = useState(0);
    const [started, setStarted] = useState(false);
    const [sceneVisible, setSceneVisible] = useState(false);
    const transitioningRef = useRef(false);

    const [visitCount] = useState(() => readNumber(localStorage, 'visit_count', 1));
    const [resetCount] = useState(() => readNumber(sessionStorage, 'undertale_reset_count', 0));
    const [spared] = useState(() => isAchievementUnlocked('pacifist'));
    const [killed] = useState(() => isAchievementUnlocked('genocide'));
    const [leftMessage] = useState(() => isAchievementUnlocked('guestbook'));

    // Let the stars breathe before the story begins.
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setStarted(true);
            window.setTimeout(() => setSceneVisible(true), 250);
        }, 2400);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        setBgmTrack('ENDING');
        return () => {
            setBgmTrack('SECRET');
        };
    }, []);

    const advance = () => {
        if (!started || transitioningRef.current) return;
        if (isTyping()) {
            skipTyping();
            return;
        }
        if (step >= 3) return;

        transitioningRef.current = true;
        playConfirm();
        setSceneVisible(false);
        window.setTimeout(() => {
            setStep((current) => current + 1);
            transitioningRef.current = false;
            window.setTimeout(() => setSceneVisible(true), 120);
        }, 900);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (key === 'enter' || key === 'z' || key === ' ') {
                event.preventDefault();
                advance();
            }
            if (key === 'escape' || key === 'x') {
                event.preventDefault();
                playConfirm();
                onStay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    const resetLine = resetCount > 0
        ? `You reset me ${resetCount} ${resetCount === 1 ? 'time' : 'times'}.`
        : 'You never needed a reset.';

    const scene = (() => {
        if (step === 0) {
            return {
                badge: 'TRUE ENDING',
                title: 'THE LAST SAVE',
                lines: [
                    '* You have been merciful.',
                    '* You have been cruel.',
                    '* And still, you came back.',
                ],
            };
        }
        if (step === 1) {
            return {
                badge: 'SAVE FILE 03',
                title: 'THE ONE WHO STAYED',
                lines: [
                    `* You have visited ${visitCount} ${visitCount === 1 ? 'time' : 'times'}.`,
                    `* ${resetLine}`,
                    '* You spared me. You killed me. You came back anyway.',
                    '* Some people pass through and leave nothing.',
                    '* You stayed long enough to leave a light on.',
                ],
            };
        }
        return {
            badge: '',
            title: '',
            lines: [],
        };
    })();

    const showChoices = step === 3;

    return createPortal(
        <div
            className="fixed inset-0 z-[120] bg-black overflow-y-auto"
            onClick={() => { if (isTyping()) skipTyping(); }}
        >
            {/* Stars */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                {STARS.map((star, index) => (
                    <Star
                        key={index}
                        size={star.size}
                        className="absolute text-ut-yellow/50 fill-ut-yellow/20 animate-twinkle"
                        style={{
                            left: star.left,
                            top: star.top,
                            animationDelay: star.delay,
                        }}
                    />
                ))}
            </div>

            {/* Shooting stars */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                {SHOOTING_STARS.map((star, index) => (
                    <div
                        key={index}
                        className="absolute h-px animate-shoot"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: star.width,
                            opacity: star.opacity,
                            animationDelay: star.delay,
                            animationDuration: star.duration,
                            animationIterationCount: 'infinite',
                        }}
                    >
                        {/* Soft halo */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ut-yellow/25 via-ut-yellow/10 to-transparent blur-[2px]" />
                        {/* Tail */}
                        <div className="absolute inset-0 bg-gradient-to-r from-ut-yellow/90 via-ut-yellow/35 to-transparent" />
                        {/* Bright core near the head */}
                        <div className="absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 bg-gradient-to-r from-white via-white/70 to-transparent" />
                        {/* Head */}
                        <div className="absolute left-0 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_2px_rgba(250,204,21,0.55)]" />
                    </div>
                ))}
            </div>

            <div className="relative min-h-full flex items-center justify-center px-6 py-16">
                <div
                    className={`relative w-full max-w-2xl text-center transition-opacity duration-[1200ms] ${started && sceneVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Scene 0 — title */}
                    {step === 0 && (
                        <>
                            <p className="font-pixel text-[10px] tracking-[0.4em] text-gray-500 mb-3">
                                {scene.badge}
                            </p>
                            <h1 className="font-8bit text-xl md:text-4xl text-ut-yellow tracking-widest mb-8">
                                {scene.title}
                            </h1>
                            <div className="mb-8 flex justify-center">
                                <SoulHeart className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 fill-yellow-400 animate-float" />
                            </div>
                            <div className="space-y-3 font-pixel text-base md:text-lg text-white min-h-[7rem]">
                                {scene.lines.map((line, index) => (
                                    <Typewriter
                                        key={`0-${index}`}
                                        text={line}
                                        speed={48}
                                        enableSound={false}
                                        className="block"
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Scene 1 — save file */}
                    {step === 1 && (
                        <>
                            <p className="font-pixel text-[10px] tracking-[0.4em] text-gray-500 mb-3">
                                SAVE FILE 03
                            </p>
                            <h1 className="font-8bit text-lg md:text-3xl text-ut-yellow tracking-widest mb-8">
                                THE ONE WHO STAYED
                            </h1>

                            <div className="mx-auto max-w-md border-2 border-ut-yellow/60 bg-[#070a0d] p-6 text-left">
                                <div className="flex items-center justify-between border-b border-ut-yellow/25 pb-3 mb-5">
                                    <span className="font-8bit text-[9px] text-ut-yellow">SAVE DATA</span>
                                    <SoulHeart className="w-4 h-4" />
                                </div>
                                <div className="space-y-4">
                                    <SaveRow label="Visits" value={String(visitCount)} />
                                    <SaveRow label="Resets" value={String(resetCount)} />
                                    <SaveRow label="Routes" value="3 / 3" />
                                    <SaveRow label="Messages" value={leftMessage ? '1' : '0'} />
                                    <SaveRow label="Determination" value="MAX" accent />
                                </div>
                                <p className="mt-6 font-pixel text-[11px] text-gray-600">
                                    * The file is intact.
                                </p>
                            </div>

                            <p className="mt-6 font-pixel text-sm text-gray-400">
                                Some people pass through and leave nothing. You stayed long enough to leave a light on.
                            </p>
                        </>
                    )}

                    {/* Scene 2 — the message */}
                    {step === 2 && (
                        <>
                            <p className="font-pixel text-[10px] tracking-[0.4em] text-gray-500 mb-3">
                                SAVE FILE 03
                            </p>
                            <h1 className="font-8bit text-lg md:text-3xl text-ut-yellow tracking-widest mb-10">
                                WHAT REMAINS
                            </h1>

                            <div className="relative mx-auto max-w-xl">
                                {/* Soft light behind the file */}
                                <div className="pointer-events-none absolute -inset-8 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.10),transparent_65%)]" />

                                <div className="relative border border-ut-yellow/45 bg-[#060809]">
                                    {/* Inner hairline frame */}
                                    <div className="pointer-events-none absolute inset-[6px] border border-ut-yellow/15" />

                                    {/* Corner brackets */}
                                    <div className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-ut-yellow/70" />
                                    <div className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-ut-yellow/70" />
                                    <div className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b border-l border-ut-yellow/70" />
                                    <div className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b border-r border-ut-yellow/70" />

                                    {/* Header */}
                                    <div className="relative flex items-center justify-between border-b border-ut-yellow/20 px-7 py-4">
                                        <span className="font-8bit text-[8px] tracking-[0.2em] text-ut-yellow/80">
                                            FILE 03
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="h-px w-6 bg-ut-yellow/40" />
                                            <SoulHeart className="w-3 h-3" />
                                            <span className="font-8bit text-[8px] tracking-[0.2em] text-ut-yellow/80">
                                                A MESSAGE
                                            </span>
                                            <span className="h-px w-6 bg-ut-yellow/40" />
                                        </div>
                                        <span className="font-8bit text-[8px] tracking-[0.2em] text-ut-yellow/80">
                                            INTACT
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div className="relative px-7 py-9 md:px-10 md:py-11 text-center">
                                        <div className="mb-7 font-pixel text-xl md:text-2xl text-ut-yellow">
                                            <Typewriter
                                                text="Thank you for staying."
                                                speed={50}
                                                enableSound={false}
                                                className="block"
                                            />
                                        </div>

                                        <div className="mx-auto max-w-md space-y-4 font-pixel text-sm md:text-base leading-relaxed text-gray-200">
                                            <Typewriter
                                                text="You saw every room, every ending,"
                                                speed={38}
                                                enableSound={false}
                                                className="block"
                                            />
                                            <Typewriter
                                                text="every version of me."
                                                speed={38}
                                                enableSound={false}
                                                className="block"
                                            />
                                            <Typewriter
                                                text="I built this place because I was afraid"
                                                speed={38}
                                                enableSound={false}
                                                className="block"
                                            />
                                            <Typewriter
                                                text="that nothing I made would last."
                                                speed={38}
                                                enableSound={false}
                                                className="block"
                                            />
                                            <Typewriter
                                                text="You made it last for a little while."
                                                speed={38}
                                                enableSound={false}
                                                className="block"
                                            />
                                            <Typewriter
                                                text="Keep building."
                                                speed={38}
                                                enableSound={false}
                                                className="block text-ut-yellow/90"
                                            />
                                            <Typewriter
                                                text="The next save is yours."
                                                speed={38}
                                                enableSound={false}
                                                className="block text-ut-yellow/90"
                                            />
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="relative flex items-center justify-between border-t border-ut-yellow/15 px-7 py-4">
                                        <span className="font-pixel text-[10px] text-gray-600">
                                            SAVE 03 · DETERMINATION MAX
                                        </span>
                                        <span className="font-8bit text-[9px] text-ut-yellow">
                                            — SHOYA
                                        </span>
                                    </div>

                                    {/* Scanlines */}
                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-20" />
                                </div>

                                {/* Seal */}
                                <div className="absolute -bottom-5 -right-4 flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-full border border-ut-yellow/40 bg-[#0b0f14] text-ut-yellow shadow-[0_0_20px_rgba(250,204,21,0.12)]">
                                    <span className="font-8bit text-[7px] leading-tight text-center">
                                        DET.<br />MAX
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Scene 3 — farewell */}
                    {step === 3 && (
                        <>
                            <p className="font-pixel text-[10px] tracking-[0.4em] text-gray-500 mb-3">
                                SAVE FILE 03
                            </p>
                            <h1 className="font-8bit text-lg md:text-3xl text-ut-yellow tracking-widest mb-8">
                                IF YOU EVER COME BACK
                            </h1>
                            <div className="mb-8 flex justify-center">
                                <SoulHeart className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 fill-yellow-400 animate-float" />
                            </div>
                            <div className="space-y-3 font-pixel text-base md:text-lg text-white mb-10">
                                <Typewriter text="* The stars will remember you." speed={48} enableSound={false} className="block" />
                                <Typewriter text="* Thank you for playing." speed={48} enableSound={false} className="block" />
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={(event) => { event.stopPropagation(); playSave(); onStay(); }}
                                    onMouseEnter={() => playMenuMove()}
                                    className="w-full md:w-auto font-8bit text-xs border-2 border-ut-yellow text-ut-yellow px-8 py-3 hover:bg-ut-yellow hover:text-black transition-colors"
                                >
                                    KEEP THE SAVE
                                </button>
                                <button
                                    onClick={(event) => { event.stopPropagation(); playHeal(); onReturnTitle(); }}
                                    onMouseEnter={() => playMenuMove()}
                                    className="w-full md:w-auto font-8bit text-xs border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors"
                                >
                                    CLOSE THE FILE
                                </button>
                            </div>
                        </>
                    )}

                    {/* Progress + credits */}
                    {!showChoices && (
                        <div className="mt-10 flex items-center justify-center gap-2">
                            {[0, 1, 2, 3].map((dot) => (
                                <span
                                    key={dot}
                                    className={`h-1.5 w-1.5 rounded-full ${dot === step ? 'bg-ut-yellow' : 'bg-white/20'}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="border-t border-white/10 pt-4 mt-10 space-y-1 font-pixel text-[10px] text-gray-600">
                        <p>BUILT BY SHOYA HORIUCHI</p>
                        <p>INSPIRED BY UNDERTALE BY TOBY FOX</p>
                    </div>
                </div>

                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        playConfirm();
                        setStarted(true);
                        setSceneVisible(false);
                        window.setTimeout(() => {
                            setStep(3);
                            window.setTimeout(() => setSceneVisible(true), 120);
                        }, 500);
                    }}
                    className="fixed bottom-5 right-5 z-10 font-pixel text-[10px] text-gray-600 hover:text-ut-yellow transition-colors"
                >
                    SKIP
                </button>
            </div>
        </div>,
        document.body
    );
};
