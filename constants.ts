
import { Project, Skill, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'E-COMMERCE APP',
    description: 'A full-stack shopping platform. It smells like new shoes.',
    tech: ['React', 'Node.js', 'Stripe'],
    stats: { atk: 15, def: 10 },
    link: '#',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
  },
  {
    id: 'p2',
    name: 'TASK MANAGER',
    description: 'Helps organize chaos. Determination increases by 10.',
    tech: ['TypeScript', 'Firebase'],
    stats: { atk: 8, def: 20 },
    link: '#',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
  },
  {
    id: 'p3',
    name: 'AI CHATBOT',
    description: 'It speaks in riddles. Very intelligent.',
    tech: ['Python', 'OpenAI', 'Socket.io'],
    stats: { atk: 99, def: 5 },
    link: '#',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80',
  },
];

export const SKILLS: Skill[] = [
  { name: 'REACT', level: 18, description: 'Summons components from the void.', type: 'FRONT' },
  { name: 'TYPESCRIPT', level: 16, description: 'Prevents runtime errors. Usually.', type: 'FRONT' },
  { name: 'NODE.JS', level: 14, description: 'Backend wizardry.', type: 'BACK' },
  { name: 'TAILWIND', level: 19, description: 'Style with speed.', type: 'FRONT' },
  { name: 'GIT', level: 12, description: 'Time travel capability.', type: 'TOOL' },
];

export const HISTORY: Experience[] = [
  {
    role: 'SENIOR DEV',
    company: 'TECH CORP',
    year: '2022-NOW',
    description: 'Leading the royal guard of developers.',
  },
  {
    role: 'FRONTEND DEV',
    company: 'STARTUP INC',
    year: '2019-2022',
    description: 'Survived the crunch time dungeon.',
  },
];

export const PLAYER_NAME = "SHOYA";
export const PLAYER_ROLE = "WEB DEVELOPER";
export const PLAYER_LOCATION = "TOKYO, NET";
export const PLAYER_LV = 19;
export const PLAYER_HP = "101/101";

// Intro "Check" stats
export const PLAYER_TRAITS = [
  "* Loves pixel art and clean code.",
  "* Can survive on coffee alone.",
  "* Looking for new adventures.",
];