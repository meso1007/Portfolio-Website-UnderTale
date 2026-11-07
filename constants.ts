
import { Project, Skill, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'TAGOLY (CLI)',
    description: 'The smarter Git commit CLI. Detects scopes from staged files, lints messages, and ships via Homebrew and Scoop.',
    tech: ['Go', 'CLI', 'Git', 'GoReleaser', 'Homebrew', 'Scoop'],
    stats: { atk: 20, def: 90 },
    link: 'https://github.com/meso1007/Tagoly',
    image: 'https://raw.githubusercontent.com/meso1007/Tagoly/main/assets/readme/demo-crop.gif',
  },
  {
    id: 'p2',
    name: 'OTODOKE LIFE',
    description: 'Turns heartfelt messages into QR-coded letters you can keep. Built for simple writing and calm reading. (Japanese)',
    tech: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    stats: { atk: 30, def: 80 },
    link: 'https://next-qrcode-message-web-app.vercel.app',
    image: 'https://raw.githubusercontent.com/meso1007/NEXT-QRcodeMessage-WebApp/main/public/readme/topPage.png',
  },
  {
    id: 'p3',
    name: 'CARTES',
    description: 'An AI that reverse-engineers your goal into a learning roadmap, then quizzes you at every step.',
    tech: ['Next.js', 'TypeScript', 'Go', 'Echo', 'PostgreSQL', 'Supabase', 'Gemini API', 'Docker'],
    stats: { atk: 85, def: 70 },
    link: 'https://cartes-three.vercel.app',
    image: 'https://raw.githubusercontent.com/meso1007/logic-latch/main/frontend/public/logo.png',
  },
  {
    id: 'p4',
    name: 'DURIAN-MAP',
    description: 'A map for finding independent cafés, with chain-store filtering and photos proxied through the API.',
    tech: ['Next.js', 'TypeScript', 'Cloudflare Workers', 'Hono', 'Google Places API'],
    stats: { atk: 70, def: 60 },
    link: 'https://github.com/meso1007/Durian-Map',
    image: 'https://raw.githubusercontent.com/meso1007/Durian-Map/main/designs/durian-map-tropical.png',
  },
  {
    id: 'p5',
    name: 'GAS INSIGHT',
    description: 'Analyzes news via Gemini AI. Reads the market\'s mind.',
    tech: ['Go', 'Gemini API', 'SQLite', 'Docker', 'Next.js', 'TypeScript'],
    stats: { atk: 55, def: 15 },
    link: 'https://github.com/meso1007/Gas-app',
    image: '',
  },
];

export const SKILLS: Skill[] = [
  {
    name: 'JAVA / SPRING BOOT',
    level: 84,
    description: 'Casts enterprise-grade magic. Built for long battles.',
    type: 'BACK'
  },
  {
    name: 'GO',
    level: 80,
    description: 'Summons Goroutines for high-speed concurrency.',
    type: 'BACK'
  },
  {
    name: 'TYPESCRIPT',
    level: 88,
    description: 'Equips a static type shield against bugs.',
    type: 'FRONT'
  },
  {
    name: 'NEXT.JS',
    level: 86,
    description: 'Server-side rendering with Determination.',
    type: 'FRONT'
  },
  {
    name: 'VUE.JS',
    level: 78,
    description: 'A lighter blade that reacts to every move.',
    type: 'FRONT'
  },
  {
    name: 'KUBERNETES',
    level: 72,
    description: 'Commands a fleet of containers. Auto-heals the party.',
    type: 'TOOL'
  },
  {
    name: 'DOCKER',
    level: 82,
    description: 'Seals the party in a portable box.',
    type: 'TOOL'
  },
  {
    name: 'COFFEE',
    level: 99,
    description: 'Restores HP. Essential for survival.',
    type: 'ITEM'
  },
];
export const HISTORY: Experience[] = [
  {
    role: 'FULL-STACK ENGINEER',
    company: 'IN-HOUSE WEB SERVICE',
    year: '2026 APR',
    description: 'Ships features end to end: Java / Spring Boot APIs, Vue.js UI, Kubernetes and CI/CD.',
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
export const PLAYER_ROLE = "FULL-STACK ENGINEER";
export const PLAYER_LOCATION = "FUJISAWA, JAPAN";
export const PLAYER_LV = 23;
export const PLAYER_HP = "101/101";

// Intro "Check" stats
export const PLAYER_TRAITS = [
  "* A full-stack builder: backend, frontend, infra, and DevOps.",
  "* Master of both Piano keys and Keyboard keys.",
  "* Shipping OSS: Tagoly, a Git commit CLI.",
  "* Seeking inspiration in foreign lands."
];

// Intro Screen Text
export const INTRO_TITLE = `LONG AGO, IN ${new Date().getFullYear()}...`;
export const INTRO_SUBTITLE = "The story of SHOYA HORIUCHI";
export const INTRO_START_TEXT = "[ CLICK TO START ]";
