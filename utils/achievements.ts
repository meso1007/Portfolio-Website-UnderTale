export interface Achievement {
  id: string;
  title: string;
  description: string;
  hint: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'secret-route',
    title: 'TRUE EXPLORER',
    description: 'Found the path that is not on the map.',
    hint: 'The menu has a hidden order.',
  },
  {
    id: 'pacifist',
    title: 'MERCY',
    description: 'Spared the developer and reached THE END.',
    hint: 'There is another way to win.',
  },
  {
    id: 'genocide',
    title: 'NO ONE LEFT',
    description: 'Defeated the developer and flipped the world.',
    hint: 'Keep attacking.',
  },
  {
    id: 'guestbook',
    title: 'SAVE POINT',
    description: 'Signed the guestbook.',
    hint: 'Find the star at the bottom right.',
  },
  {
    id: 'terminal',
    title: 'ROOT ACCESS',
    description: 'Used the developer room terminal.',
    hint: 'Type something in the terminal.',
  },
  {
    id: 'jukebox',
    title: 'DJ',
    description: 'Played a track on the jukebox.',
    hint: 'The room has a jukebox.',
  },
  {
    id: 'decrypted',
    title: 'DECRYPTED',
    description: 'Opened hidden file 02.',
    hint: 'Locked files do not open themselves.',
  },
  {
    id: 'secret-bgm',
    title: 'SECRET TRACK',
    description: 'Heard the track that only plays in the hidden room.',
    hint: 'Listen closely in the hidden room.',
  },
  {
    id: 'reset-repeat',
    title: 'HOW MANY TIMES?',
    description: 'Reset the timeline three times.',
    hint: 'TRUE RESET is a choice.',
  },
  {
    id: 'true-secret',
    title: 'TRUE SECRET',
    description: 'Completed every activity in the developer room.',
    hint: 'Complete the room objectives.',
  },
];

const STORAGE_KEY = 'undertale_achievements';
const EVENT_NAME = 'undertale-achievements-changed';

const readUnlocked = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

export const getUnlockedAchievements = (): string[] => readUnlocked();

export const isAchievementUnlocked = (id: string): boolean => readUnlocked().includes(id);

export const unlockAchievement = (id: string): void => {
  const current = readUnlocked();
  if (current.includes(id)) return;
  const next = [...current, id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const onAchievementsChanged = (listener: () => void): (() => void) => {
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
};
