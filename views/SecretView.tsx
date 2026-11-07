import React, { useState } from 'react';
import {
    MessageSquare, BarChart3, Code2, Sparkles, Trophy,
    Github, ArrowLeft, CheckCircle2, Terminal, Lock, Unlock, Music
} from 'lucide-react';
import { Typewriter } from '../components/Typewriter';
import { playConfirm, playGlitch, playMenuMove } from '../utils/sound';
import { GameRoute } from '../types';

interface SecretViewProps {
    route: GameRoute;
    onClose?: () => void;
}

const STATS = [
    { label: 'PROJECTS SHIPPED', value: 5, display: '5' },
    { label: 'ROUTES', value: 3, display: '3' },
    { label: 'SOUND EFFECTS', value: 11, display: '11' },
    { label: 'BGM TRACKS', value: 4, display: '4' },
    { label: 'SECRETS FOUND', value: 100, display: '1 / 1' },
    { label: 'DETERMINATION', value: 100, display: 'MAX' },
];

const TECH = [
    'React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Go', 'fly.io', 'Vercel'
];

const FACTS = [
    'The pixel avatar was generated with AI.',
    'Every sound effect is synthesized with the Web Audio API.',
    'The BGM is generated in code — there are no audio files.',
    'Your visit count lives in localStorage, not on a server.',
    'The Genocide route rewrites the entire interface.',
];

const LOG = [
    'Found the hidden path (SKILLS → HISTORY → CONTACT → PROJECTS)',
    'Heard the original chiptune',
    'Read the developer\'s notes',
];

const STARS = [
    { left: '6%', top: '8%', size: 14, delay: '0s' },
    { left: '18%', top: '22%', size: 10, delay: '0.6s' },
    { left: '32%', top: '6%', size: 8, delay: '1.2s' },
    { left: '48%', top: '16%', size: 12, delay: '0.3s' },
    { left: '64%', top: '7%', size: 9, delay: '1.5s' },
    { left: '78%', top: '20%', size: 13, delay: '0.9s' },
    { left: '90%', top: '10%', size: 8, delay: '0.2s' },
    { left: '12%', top: '48%', size: 9, delay: '1.1s' },
    { left: '88%', top: '46%', size: 10, delay: '0.5s' },
];

const HIDDEN_NOTE = `* The best portfolios are the ones you can play.
* Thanks for making it all the way here.
* — Shoya`;

const Panel: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <section className="relative border-2 border-ut-yellow/40 bg-gray-950/70 p-5">
        <h3 className="flex items-center gap-3 font-8bit text-sm md:text-base text-ut-yellow mb-4">
            <span className="text-ut-yellow">{icon}</span>
            {title}
        </h3>
        {children}
    </section>
);

export const SecretView: React.FC<SecretViewProps> = ({ route, onClose }) => {
    const isGenocide = route === GameRoute.GENOCIDE;
    const [decrypted, setDecrypted] = useState(false);

    if (isGenocide) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="animate-glitch text-ut-red font-pixel text-2xl md:text-3xl mb-6">
                    * NO ONE LEFT.
                </div>
                <p className="font-pixel text-ut-red/70 text-sm">
                    * The secret route has been erased.
                </p>
            </div>
        );
    }

    const handleDecrypt = () => {
        if (decrypted) return;
        playGlitch();
        setDecrypted(true);
    };

    return (
        <div className="relative space-y-6 pb-4">
            {/* Star field */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                {STARS.map((star, index) => (
                    <span
                        key={index}
                        className="absolute text-ut-yellow/40 animate-pulse"
                        style={{
                            left: star.left,
                            top: star.top,
                            fontSize: `${star.size}px`,
                            animationDelay: star.delay,
                        }}
                    >
                        ✦
                    </span>
                ))}
            </div>

            {/* Header */}
            <div className="relative border-4 border-ut-yellow bg-gradient-to-b from-yellow-400/15 via-transparent to-transparent p-6 text-center shadow-[0_0_40px_rgba(250,204,21,0.15)]">
                <div className="absolute top-0 left-0 w-2 h-2 bg-ut-yellow" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-ut-yellow" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-ut-yellow" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-ut-yellow" />

                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="font-8bit text-[9px] tracking-[0.25em] text-black bg-ut-yellow px-2 py-1">
                        ACCESS GRANTED
                    </span>
                    <span className="font-8bit text-[9px] tracking-[0.25em] text-ut-yellow border border-ut-yellow px-2 py-1 flex items-center gap-1">
                        <Music size={10} /> SECRET TRACK
                    </span>
                </div>

                <p className="font-pixel text-[10px] tracking-[0.35em] text-gray-500 mb-2">
                    HIDDEN FILE 01
                </p>
                <h2 className="font-8bit text-xl md:text-3xl text-ut-yellow mb-3 animate-pulse">
                    ??? DEVELOPER ROOM ???
                </h2>
                <p className="font-pixel text-gray-300 text-sm">
                    * A page that technically does not exist.
                </p>
            </div>

            {/* Terminal */}
            <div className="border-2 border-ut-yellow bg-black p-4 font-pixel text-sm">
                <div className="flex items-center justify-between text-gray-500 text-[10px] mb-3 border-b border-white/10 pb-2">
                    <span>shoya@portfolio</span>
                    <span>secret.log</span>
                </div>
                <p className="text-ut-yellow">$ cat secret.log</p>
                <p className="text-white">ACCESS GRANTED.</p>
                <p className="text-white">ROUTE: SECRET</p>
                <p className="text-gray-400">Loading the part of me that isn't on the resume...</p>
                <p className="text-ut-yellow mt-1 animate-pulse">_</p>
            </div>

            {/* Developer message */}
            <Panel icon={<MessageSquare size={18} />} title="DEVELOPER'S MESSAGE">
                <div className="space-y-2 font-pixel text-white text-sm md:text-base">
                    <Typewriter text="* Thanks for exploring every corner of this portfolio." speed={24} className="block" enableSound={false} />
                    <Typewriter text="* It is a small site, but every screen was hand-built." speed={24} className="block" enableSound={false} />
                    <Typewriter text="* The best part of engineering is still the people you meet." speed={24} className="block" enableSound={false} />
                    <Typewriter text="* If you want to build something, my inbox is open." speed={24} className="block" enableSound={false} />
                </div>
            </Panel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hidden statistics */}
                <Panel icon={<BarChart3 size={18} />} title="HIDDEN STATISTICS">
                    <div className="space-y-3">
                        {STATS.map((stat) => (
                            <div key={stat.label}>
                                <div className="flex justify-between items-baseline font-pixel text-xs text-gray-400 mb-1">
                                    <span>{stat.label}</span>
                                    <span className="text-ut-yellow">{stat.display}</span>
                                </div>
                                <div className="h-2 bg-red-900/60 border border-white/10">
                                    <div
                                        className="h-full bg-ut-yellow"
                                        style={{ width: `${stat.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Panel>

                {/* Tech stack */}
                <Panel icon={<Code2 size={18} />} title="TECH STACK">
                    <div className="flex flex-wrap gap-2">
                        {TECH.map((name) => (
                            <span
                                key={name}
                                className="border border-ut-blue/70 text-ut-blue px-2 py-1 font-8bit text-[10px]"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                    <div className="mt-5 flex items-start gap-2 font-pixel text-xs text-gray-400">
                        <Terminal size={14} className="mt-0.5 shrink-0" />
                        <span>Hand-written. No template, no page builder.</span>
                    </div>
                </Panel>
            </div>

            {/* Fun facts */}
            <Panel icon={<Sparkles size={18} />} title="FUN FACTS">
                <ul className="space-y-2 font-pixel text-white text-sm">
                    {FACTS.map((fact) => (
                        <li key={fact} className="flex gap-2">
                            <span className="text-ut-yellow">*</span>
                            <span>{fact}</span>
                        </li>
                    ))}
                </ul>
            </Panel>

            {/* Secret log */}
            <Panel icon={<Trophy size={18} />} title="SECRET LOG">
                <ul className="space-y-2 font-pixel text-white text-sm">
                    {LOG.map((entry) => (
                        <li key={entry} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="mt-0.5 text-green-400 shrink-0" />
                            <span>{entry}</span>
                        </li>
                    ))}
                </ul>
            </Panel>

            {/* Locked file */}
            <section className="relative border-2 border-dashed border-ut-yellow/50 bg-black p-5">
                <h3 className="flex items-center gap-3 font-8bit text-sm md:text-base text-ut-yellow mb-4">
                    {decrypted ? <Unlock size={18} /> : <Lock size={18} />}
                    HIDDEN FILE 02
                </h3>
                {decrypted ? (
                    <div className="space-y-2 font-pixel text-yellow-200 text-sm animate-pulse">
                        {HIDDEN_NOTE.split('\n').map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className="font-pixel text-gray-500 text-sm">* The file is locked.</p>
                        <button
                            onClick={handleDecrypt}
                            onMouseEnter={() => playMenuMove()}
                            className="font-8bit text-[10px] border border-ut-yellow text-ut-yellow px-4 py-2 hover:bg-ut-yellow hover:text-black transition-colors"
                        >
                            DECRYPT
                        </button>
                    </div>
                )}
            </section>

            {/* Footer actions */}
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 pt-2">
                <a
                    href="https://github.com/meso1007/Portfolio-Website-UnderTale"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => playMenuMove()}
                    onClick={() => playConfirm()}
                    className="flex items-center gap-2 font-8bit text-xs border-2 border-white text-white px-5 py-3 hover:bg-white hover:text-black transition-colors"
                >
                    <Github size={14} /> VIEW SOURCE
                </a>
                {onClose && (
                    <button
                        onClick={() => { playConfirm(); onClose(); }}
                        onMouseEnter={() => playMenuMove()}
                        className="flex items-center gap-2 font-8bit text-xs border-2 border-ut-yellow text-ut-yellow px-5 py-3 hover:bg-ut-yellow hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} /> RETURN
                    </button>
                )}
            </div>
        </div>
    );
};
