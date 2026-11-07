import React from 'react';
import {
    MessageSquare, BarChart3, Code2, Sparkles, Trophy,
    Github, ArrowLeft, CheckCircle2, Terminal
} from 'lucide-react';
import { Typewriter } from '../components/Typewriter';
import { playConfirm, playMenuMove } from '../utils/sound';
import { GameRoute } from '../types';

interface SecretViewProps {
    route: GameRoute;
    onClose?: () => void;
}

const STATS = [
    { label: 'PROJECTS SHIPPED', value: 5, display: '5' },
    { label: 'ROUTES', value: 3, display: '3' },
    { label: 'SOUND EFFECTS', value: 11, display: '11' },
    { label: 'BGM TRACKS', value: 3, display: '3' },
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

const Panel: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <section className="border-2 border-white/20 bg-gray-950/60 p-5">
        <h3 className="flex items-center gap-3 font-8bit text-sm md:text-base text-ut-yellow mb-4">
            <span className="text-ut-yellow">{icon}</span>
            {title}
        </h3>
        {children}
    </section>
);

export const SecretView: React.FC<SecretViewProps> = ({ route, onClose }) => {
    const isGenocide = route === GameRoute.GENOCIDE;

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

    return (
        <div className="space-y-6 pb-4">
            {/* Header */}
            <div className="relative border-4 border-ut-yellow bg-gradient-to-b from-yellow-400/10 to-transparent p-6 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-2 bg-ut-yellow" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-ut-yellow" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-ut-yellow" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-ut-yellow" />

                <p className="font-pixel text-[10px] tracking-[0.3em] text-gray-500 mb-2">
                    HIDDEN FILE 01
                </p>
                <h2 className="font-8bit text-xl md:text-3xl text-ut-yellow mb-3 animate-pulse">
                    ??? SECRET ROUTE ???
                </h2>
                <p className="font-pixel text-gray-300 text-sm">
                    * You found the path that isn't on the map.
                </p>
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

            {/* Footer actions */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-2">
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
