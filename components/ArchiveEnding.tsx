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

const readNumber = (storage: Storage, key: string, fallback: number): number => {
    try {
        const value = Number(storage.getItem(key));
        return Number.isFinite(value) ? value : fallback;
    } catch {
        return fallback;
    }
};

export const ArchiveEnding: React.FC<ArchiveEndingProps> = ({ onStay, onReturnTitle }) => {
    const [step, setStep] = useState(0);
    const [started, setStarted] = useState(false);
    const [sceneVisible, setSceneVisible] = useState(false);
    const transitioningRef = useRef(false);

    const [visitCount] = useState(() => readNumber(localStorage, 'visit_count', 1));
    const [resetCount] = useState(() => readNumber(sessionStorage, 'undertale_reset_count', 0));
    const [spared] = useState(() => isAchievementUnlocked('pacifist'));
    const [killed] = useState(() => isAchievementUnlocked('genocide'));

    // Let the stars breathe before the story begins.
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setStarted(true);
            window.setTimeout(() => setSceneVisible(true), 250);
        }, 2600);
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
        }, 950);
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
                badge: 'SAVE FILE 01',
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
        if (step === 2) {
            return {
                badge: 'SAVE FILE 02',
                title: 'WHAT REMAINS',
                lines: [
                    '* This is not a portfolio.',
                    '* It is the place I built so that someone might find me.',
                    '* Every reset. Every ending. Every quiet message.',
                    '* I kept them all.',
                    '* If you remember one thing, remember this: keep building.',
                ],
            };
        }
        return {
            badge: 'SAVE FILE 03',
            title: 'IF YOU EVER COME BACK',
            lines: [
                '* The stars will remember you.',
                '* Thank you for playing.',
            ],
        };
    })();

    return createPortal(
        <div
            className="fixed inset-0 z-[120] bg-black overflow-y-auto"
            onClick={() => { if (isTyping()) skipTyping(); }}
        >
            {/* Slow vignette */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(250,204,21,0.05),transparent_55%)]" />

            {/* Stars — always visible, slowly twinkling */}
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

            <div className="relative min-h-full flex items-center justify-center p-6 py-12">
                <div
                    className={`relative w-full max-w-2xl text-center transition-opacity duration-[1400ms] ${started && sceneVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    <p className="font-pixel text-[10px] tracking-[0.4em] text-gray-500 mb-2">
                        {scene.badge}
                    </p>
                    <h1 className="font-8bit text-xl md:text-4xl text-ut-yellow tracking-widest mb-6">
                        {scene.title}
                    </h1>

                    {step === 0 && (
                        <div className="mb-8 flex justify-center animate-float">
                            <SoulHeart className="w-12 h-12 md:w-14 md:h-14 text-yellow-400 fill-yellow-400" />
                        </div>
                    )}

                    <div className="space-y-3 font-pixel text-base md:text-lg text-white mb-10 min-h-[12rem]">
                        {scene.lines.map((line, index) => (
                            <Typewriter
                                key={`${step}-${index}`}
                                text={line}
                                speed={44}
                                enableSound={false}
                                className="block"
                            />
                        ))}
                    </div>

                    {step < 3 ? (
                        <button
                            onClick={(event) => { event.stopPropagation(); advance(); }}
                            onMouseEnter={() => playMenuMove()}
                            className="font-8bit text-xs border-2 border-ut-yellow/80 text-ut-yellow px-8 py-3 hover:bg-ut-yellow hover:text-black transition-colors"
                        >
                            CONTINUE
                        </button>
                    ) : (
                        <>
                            <div className={`flex flex-col md:flex-row items-center justify-center gap-4 transition-opacity duration-1000 ${sceneVisible ? 'opacity-100' : 'opacity-0'}`}>
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
                            <p className="mt-5 font-pixel text-[10px] text-gray-500">
                                {spared && killed ? '* You have been both. That is rare.' : '* Thank you for reading.'}
                            </p>
                        </>
                    )}

                    <div className="border-t border-white/10 pt-4 mt-12 space-y-1 font-pixel text-[10px] text-gray-600">
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
