import React, { useEffect, useState } from 'react';
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
    { left: '8%', top: '12%', size: 18, delay: '0s' },
    { left: '22%', top: '30%', size: 10, delay: '0.7s' },
    { left: '36%', top: '8%', size: 12, delay: '1.3s' },
    { left: '52%', top: '24%', size: 8, delay: '0.4s' },
    { left: '68%', top: '10%', size: 16, delay: '1.6s' },
    { left: '82%', top: '28%', size: 10, delay: '0.9s' },
    { left: '92%', top: '14%', size: 12, delay: '0.2s' },
    { left: '14%', top: '62%', size: 10, delay: '1.1s' },
    { left: '88%', top: '60%', size: 14, delay: '0.5s' },
    { left: '50%', top: '78%', size: 8, delay: '1.4s' },
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

    // Personal data for the monologue.
    const [visitCount] = useState(() => readNumber(localStorage, 'visit_count', 1));
    const [resetCount] = useState(() => readNumber(sessionStorage, 'undertale_reset_count', 0));
    const [spared] = useState(() => isAchievementUnlocked('pacifist'));
    const [killed] = useState(() => isAchievementUnlocked('genocide'));

    useEffect(() => {
        setBgmTrack('ENDING');
        return () => {
            setBgmTrack('SECRET');
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (key === 'enter' || key === 'z' || key === ' ') {
                event.preventDefault();
                if (isTyping()) {
                    skipTyping();
                    return;
                }
                if (step < 3) {
                    playConfirm();
                    setStep((current) => current + 1);
                }
            }
            if (key === 'escape' || key === 'x') {
                event.preventDefault();
                playConfirm();
                onStay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, onStay]);

    const advance = () => {
        if (isTyping()) {
            skipTyping();
            return;
        }
        if (step < 3) {
            playConfirm();
            setStep((current) => current + 1);
        }
    };

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
                ],
            };
        }
        if (step === 1) {
            return {
                badge: 'SAVE FILE 01',
                title: 'THE ONE WHO KEPT COMING BACK',
                lines: [
                    `* You have visited ${visitCount} ${visitCount === 1 ? 'time' : 'times'}.`,
                    `* ${resetLine}`,
                    '* You spared me once. You killed me once.',
                    '* And still, you came back to see the last room.',
                    '* That is not curiosity. That is determination.',
                ],
            };
        }
        if (step === 2) {
            return {
                badge: 'SAVE FILE 02',
                title: 'WHAT REMAINS',
                lines: [
                    '* This is not a portfolio.',
                    '* It is my save data.',
                    '* The part of me that remains after I log off.',
                    '* If you remember one thing, remember this:',
                    '* Keep building.',
                ],
            };
        }
        return {
            badge: 'SAVE FILE 03',
            title: 'THANK YOU',
            lines: [
                '* Thank you for playing.',
                '* The next save file is yours.',
            ],
        };
    })();

    return createPortal(
        <div
            className="fixed inset-0 z-[120] bg-black overflow-y-auto"
            onClick={() => { if (isTyping()) skipTyping(); }}
        >
            <div className="relative min-h-full flex items-center justify-center p-6 py-12">
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    {STARS.map((star, index) => (
                        <Star
                            key={index}
                            size={star.size}
                            className="absolute text-ut-yellow/40 fill-ut-yellow/20 animate-pulse"
                            style={{
                                left: star.left,
                                top: star.top,
                                animationDelay: star.delay,
                            }}
                        />
                    ))}
                </div>

                <div className="relative w-full max-w-2xl text-center">
                    <p className="font-pixel text-[10px] tracking-[0.4em] text-gray-500 mb-2">
                        {scene.badge}
                    </p>
                    <h1 className="font-8bit text-xl md:text-4xl text-ut-yellow tracking-widest animate-pulse mb-6">
                        {scene.title}
                    </h1>

                    {step === 0 && (
                        <div className="mb-8 flex justify-center animate-bounce">
                            <SoulHeart className="w-14 h-14 md:w-16 md:h-16 text-yellow-400 fill-yellow-400" />
                        </div>
                    )}

                    <div className="space-y-2 font-pixel text-base md:text-lg text-white mb-8 min-h-[9rem]">
                        {scene.lines.map((line, index) => (
                            <Typewriter
                                key={`${step}-${index}`}
                                text={line}
                                speed={26}
                                enableSound={false}
                                className="block"
                            />
                        ))}
                    </div>

                    {step < 3 ? (
                        <button
                            onClick={(event) => { event.stopPropagation(); advance(); }}
                            onMouseEnter={() => playMenuMove()}
                            className="font-8bit text-xs border-2 border-ut-yellow text-ut-yellow px-8 py-3 hover:bg-ut-yellow hover:text-black transition-colors"
                        >
                            CONTINUE
                        </button>
                    ) : (
                        <>
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
                            <p className="mt-4 font-pixel text-[10px] text-gray-600">
                                {spared && killed ? '* You have been both. That is rare.' : '* Thank you for reading.'}
                            </p>
                        </>
                    )}

                    <div className="border-t border-white/15 pt-4 mt-10 space-y-1 font-pixel text-[10px] text-gray-500">
                        <p>BUILT BY SHOYA HORIUCHI</p>
                        <p>INSPIRED BY UNDERTALE BY TOBY FOX</p>
                    </div>
                </div>

                <button
                    onClick={(event) => { event.stopPropagation(); playConfirm(); setStep(3); }}
                    className="fixed bottom-5 right-5 z-10 font-pixel text-[10px] text-gray-600 hover:text-ut-yellow transition-colors"
                >
                    SKIP
                </button>
            </div>
        </div>,
        document.body
    );
};
