
import { Project, Skill, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'OTODOKE LIFE',
    description: 'Encodes heartfelt messages into QR codes for the future. (only in Japanese)',
    tech: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    stats: { atk: 30, def: 80 },
    link: "https://www.otodokelife.com/",
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', // 手紙やアートっぽい画像
  },
  {
    id: 'p2',
    name: 'GAS INSIGHT',
    description: 'Analyzes news via Gemini AI. Reads the market\'s mind.',
    tech: ['Go', 'Gemini API', 'SQLite', 'Docker', 'NEXT.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    stats: { atk: 55, def: 15 },
    link: 'https://github.com/meso1007/Gas-app',
    image: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?w=800&q=80',
  },
  {
    id: 'p3',
    name: 'TAGOLY (CLI)',
    description: 'Interactive CLI. Auto-detects scopes to keep history shiny.',
    tech: ['Go', 'CLI', 'Git', "Homebrew", "Scoop"],
    stats: { atk: 20, def: 90 },
    link: 'https://github.com/meso1007/Tagoly',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
  },
];

export const SKILLS: Skill[] = [
  {
    name: 'GO',
    level: 76,
    description: 'Summons Goroutines for high-speed concurrency.',
    type: 'BACK'
  },
  {
    name: 'PYTHON',
    level: 74,
    description: 'Mines data & calculates fluid dynamics.', // スクレイピングと流体力学の両方
    type: 'BACK'
  },
  {
    name: 'NEXT.JS',
    level: 88,
    description: 'Server-side rendering with Determination.', // SSRと「決意」をかけた
    type: 'FRONT'
  },
  {
    name: 'TYPESCRIPT',
    level: 88,
    description: 'Equips a static type shield against bugs.', // 静的型付けの「盾」を装備
    type: 'FRONT'
  },
  {
    name: 'GIT',
    level: 62,
    description: 'Time travel capability (Save/Load).', // 時間旅行能力
    type: 'TOOL'
  },
  {
    name: 'COFFEE',
    level: 99,
    description: 'Restores HP. Essential for survival.', // HP回復アイテム
    type: 'ITEM'
  },
];
export const HISTORY: Experience[] = [
  {
    role: 'WEB APP ENGINEER',
    company: '??????',
    year: '2026 APR',
    description: 'Accepted the offer. Determination filled.',
  },
  {
    role: 'STARTUP DEV INTERN',
    company: 'Vancouver, CANADA',
    year: '2024 AUG',
    description: 'Built UI with React. Mined data with Python.',
  },
  {
    role: 'MECH MAJOR',
    company: 'UNIVERSITY',
    year: '2021-2025',
    description: 'Majoring in Mechanical Engineering. Researching Plasma Actuators.',
  },
];

export const PLAYER_NAME = "SHOYA";
export const PLAYER_ROLE = "WEB DEVELOPER";
export const PLAYER_LOCATION = "FUJISAWA, JAPAN";
export const PLAYER_LV = 23;
export const PLAYER_HP = "101/101";

// Intro "Check" stats
export const PLAYER_TRAITS = [
  "* A multi-class Creator: Code, Art, and Music.",
  "* Master of both Piano keys and Keyboard keys.",
  "* Diving into the world of OSS.",
  "* Seeking inspiration in foreign lands."
];