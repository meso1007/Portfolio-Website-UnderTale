export enum ViewState {
  INTRO = 'INTRO',
  FIGHT = 'FIGHT', // Projects
  ACT = 'ACT',     // Skills
  ITEM = 'ITEM',   // Experience/Resume
  MERCY = 'MERCY', // Contact
  SECRET = 'SECRET', // Hidden Route
}

export enum GameRoute {
  NEUTRAL = 'NEUTRAL',
  PACIFIST = 'PACIFIST',
  GENOCIDE = 'GENOCIDE'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  stats: {
    atk: number; // Complexity
    def: number; // Maintenance
  };
  link?: string;
  image?: string; // Optional image URL
}

export interface Skill {
  name: string;
  level: number; // 1-20
  description: string;
  type: 'FRONT' | 'BACK' | 'TOOL' | 'ITEM';
}

export interface Experience {
  role: string;
  company: string;
  year: string;
  description: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
}