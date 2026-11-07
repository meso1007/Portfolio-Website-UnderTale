import React, { useEffect, useRef, useState } from 'react';
import {
    MessageSquare, BarChart3, Code2, Sparkles, Trophy,
    Github, ArrowLeft, CheckCircle2, Circle, Terminal,
    Lock, Unlock, Music, PlayCircle
} from 'lucide-react';
import { Typewriter } from '../components/Typewriter';
import { playConfirm, playGlitch, playHeal, playMenuMove } from '../utils/sound';
import { BgmTrack, setBgmTrack } from '../utils/bgm';
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

const TRACKS: BgmTrack[] = ['NEUTRAL', 'PACIFIST', 'GENOCIDE', 'SECRET'];

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

const TERMINAL_INTRO = [
    'shoya@portfolio:~$ help',
    'Available: help, whoami, ls, cat <file>, projects, skills, contact, bgm <track>, clear, exit',
];

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
    const [usedTerminal, setUsedTerminal] = useState(false);
    const [usedJukebox, setUsedJukebox] = useState(false);
    const [trueSecretShown, setTrueSecretShown] = useState(false);
    const [playing, setPlaying] = useState<BgmTrack>('SECRET');
    const [history, setHistory] = useState<string[]>(TERMINAL_INTRO);
    const [command, setCommand] = useState('');
    const terminalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        if (usedTerminal && usedJukebox && decrypted && !trueSecretShown) {
            setTrueSecretShown(true);
            playHeal();
        }
    }, [usedTerminal, usedJukebox, decrypted, trueSecretShown]);

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

    const selectTrack = (track: BgmTrack) => {
        playConfirm();
        setBgmTrack(track);
        setPlaying(track);
        setUsedJukebox(true);
    };

    const handleDecrypt = () => {
        if (decrypted) return;
        playGlitch();
        setDecrypted(true);
    };

    const runCommand = (raw: string) => {
        const cmd = raw.trim();
        if (!cmd) return;

        const lower = cmd.toLowerCase();
        const output: string[] = [`shoya@portfolio:~$ ${cmd}`];

        if (lower === 'help') {
            output.push('Available: help, whoami, ls, cat <file>, projects, skills, contact, bgm <track>, clear, exit');
        } else if (lower === 'whoami') {
            output.push('shoya — full-stack engineer. Currently in a room that does not exist.');
        } else if (lower === 'ls') {
            output.push('about.txt   projects.log   secret.key   credits.md');
        } else if (lower === 'cat about.txt') {
            output.push('Backend, frontend, infra, DevOps. Bilingual EN/JP. Shipping Tagoly.');
        } else if (lower === 'cat projects.log') {
            output.push('Tagoly / OTODOKE LIFE / Cartes / Durian-Map / GAS INSIGHT — see PROJECTS.');
        } else if (lower === 'cat secret.key') {
            output.push('The key is not a file. Try the jukebox and the locked file.');
        } else if (lower === 'cat credits.md') {
            output.push('Built by Shoya Horiuchi. Inspired by UNDERTALE by Toby Fox.');
        } else if (lower === 'projects') {
            output.push('Tagoly, OTODOKE LIFE, Cartes, Durian-Map, GAS INSIGHT');
        } else if (lower === 'skills') {
            output.push('Java / Spring Boot, TypeScript, Go, Python, Kubernetes, Jenkins, English');
        } else if (lower === 'contact') {
            output.push('diegoshoya2017@gmail.com  ·  github.com/meso1007');
        } else if (lower.startsWith('bgm')) {
            const requested = lower.split(/\s+/)[1]?.toUpperCase();
            if (requested && (TRACKS as string[]).includes(requested)) {
                selectTrack(requested as BgmTrack);
                output.push(`Now playing: ${requested}`);
            } else {
                output.push('Usage: bgm <neutral|pacifist|genocide|secret>');
            }
        } else if (lower === 'clear') {
            setHistory([]);
            setCommand('');
            setUsedTerminal(true);
            return;
        } else if (lower === 'exit') {
            output.push('There is no exit. Only RETURN.');
        } else if (lower === 'sudo') {
            output.push('Nice try. You are not the administrator of this timeline.');
        } else if (lower === 'rm -rf /') {
            output.push('Not in this timeline.');
        } else if (lower === 'secret') {
            output.push('You are standing in it.');
        } else {
            output.push(`command not found: ${cmd}. Type \`help\`.`);
        }

        setHistory((prev) => [...prev, ...output]);
        setCommand('');
        setUsedTerminal(true);
    };

    const objectives = [
        { done: usedTerminal, label: 'Use the terminal' },
        { done: usedJukebox, label: 'Play a track on the jukebox' },
        { done: decrypted, label: 'Decrypt hidden file 02' },
    ];

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
            <Panel icon={<Terminal size={18} />} title="TERMINAL">
                <div
                    ref={terminalRef}
                    className="h-48 overflow-y-auto custom-scrollbar bg-black border border-white/10 p-3 font-pixel text-xs md:text-sm leading-relaxed"
                >
                    {history.map((line, index) => (
                        <p key={index} className={line.startsWith('shoya@') ? 'text-ut-yellow' : 'text-gray-300'}>
                            {line}
                        </p>
                    ))}
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        runCommand(command);
                    }}
                    className="flex items-center gap-2 mt-3 font-pixel text-sm"
                >
                    <span className="text-ut-yellow shrink-0">shoya@portfolio:~$</span>
                    <input
                        value={command}
                        onChange={(event) => setCommand(event.target.value)}
                        placeholder="type a command..."
                        autoComplete="off"
                        spellCheck={false}
                        className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none border-b border-white/20 focus:border-ut-yellow py-1"
                    />
                </form>
            </Panel>

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

            {/* Jukebox */}
            <Panel icon={<Music size={18} />} title="JUKEBOX">
                <div className="grid grid-cols-2 gap-2">
                    {TRACKS.map((track) => (
                        <button
                            key={track}
                            onClick={() => selectTrack(track)}
                            onMouseEnter={() => playMenuMove()}
                            className={`flex items-center justify-center gap-2 font-8bit text-[10px] px-3 py-3 border transition-colors ${playing === track
                                ? 'bg-ut-yellow text-black border-ut-yellow'
                                : 'bg-black text-ut-yellow border-ut-yellow/50 hover:bg-ut-yellow/10'
                                }`}
                        >
                            <PlayCircle size={12} />
                            {track}
                        </button>
                    ))}
                </div>
                <p className="font-pixel text-xs text-gray-500 mt-3">
                    * Leaving this room restores the track for the current route.
                </p>
            </Panel>

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

            {/* Objectives */}
            <Panel icon={<Trophy size={18} />} title="ROOM OBJECTIVES">
                <ul className="space-y-2 font-pixel text-white text-sm">
                    {objectives.map((objective) => (
                        <li key={objective.label} className="flex items-start gap-2">
                            {objective.done ? (
                                <CheckCircle2 size={14} className="mt-0.5 text-green-400 shrink-0" />
                            ) : (
                                <Circle size={14} className="mt-0.5 text-gray-600 shrink-0" />
                            )}
                            <span className={objective.done ? 'text-green-300' : 'text-gray-400'}>
                                {objective.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </Panel>

            {/* True secret */}
            {trueSecretShown && (
                <section className="relative border-4 border-ut-yellow bg-yellow-400/10 p-6 text-center animate-pulse">
                    <h3 className="font-8bit text-sm md:text-lg text-ut-yellow mb-3">
                        ✦ TRUE SECRET UNLOCKED ✦
                    </h3>
                    <div className="space-y-2 font-pixel text-yellow-100 text-sm">
                        <p>* You did everything in the room.</p>
                        <p>* The real secret was the time you spent here.</p>
                        <p>* Now go build something. — Shoya</p>
                    </div>
                </section>
            )}

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
