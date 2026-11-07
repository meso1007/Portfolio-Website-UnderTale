import { ensureContext, getAudioContext } from './sound';

export type BgmTrack = 'NEUTRAL' | 'PACIFIST' | 'GENOCIDE' | 'SECRET';

const STORAGE_KEY = 'undertale_bgm_muted';
const MASTER_VOLUME = 0.16;

type Step = number | null;

interface TrackDefinition {
  bpm: number;
  lead: Step[];
  bass: Step[];
}

// Original chiptune loops, written in MIDI note numbers (null = rest).
const TRACKS: Record<BgmTrack, TrackDefinition> = {
  NEUTRAL: {
    bpm: 96,
    lead: [
      69, null, 72, null, 76, null, 74, null, 72, null, 69, null, 67, null, null, null,
      65, null, 69, null, 72, null, 74, null, 72, null, 69, null, 65, null, null, null,
    ],
    bass: [
      45, null, null, null, 52, null, null, null, 48, null, null, null, 43, null, null, null,
      41, null, null, null, 48, null, null, null, 45, null, null, null, 40, null, null, null,
    ],
  },
  PACIFIST: {
    bpm: 112,
    lead: [
      72, null, 76, null, 79, null, 76, null, 74, null, 72, null, 79, null, 76, null,
      77, null, 76, null, 74, null, 72, null, 74, null, 76, null, 79, null, 81, null,
    ],
    bass: [
      48, null, null, null, 55, null, null, null, 53, null, null, null, 60, null, null, null,
      50, null, null, null, 57, null, null, null, 55, null, null, null, 60, null, null, null,
    ],
  },
  GENOCIDE: {
    bpm: 64,
    lead: [
      57, null, null, null, 58, null, null, null, 57, null, null, null, 53, null, null, null,
      56, null, null, null, 57, null, null, null, 60, null, null, null, 58, null, null, null,
    ],
    bass: [
      33, null, null, null, 34, null, null, null, 33, null, null, null, 29, null, null, null,
      32, null, null, null, 33, null, null, null, 36, null, null, null, 34, null, null, null,
    ],
  },
  SECRET: {
    bpm: 84,
    lead: [
      84, null, 88, null, 91, null, 88, null, 86, null, 83, null, 79, null, null, null,
      84, null, 88, null, 93, null, 91, null, 88, null, 86, null, 83, null, null, null,
    ],
    bass: [
      40, null, null, null, 47, null, null, null, 45, null, null, null, 40, null, null, null,
      40, null, null, null, 47, null, null, null, 43, null, null, null, 38, null, null, null,
    ],
  },
};

const midiToFrequency = (midi: number): number => 440 * Math.pow(2, (midi - 69) / 12);

let masterGain: GainNode | null = null;
let schedulerId: number | null = null;
let currentTrack: BgmTrack | null = null;
let step = 0;
let nextStepTime = 0;
let muted = false;

const loadMuted = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

muted = loadMuted();

const getMasterGain = (ctx: AudioContext): GainNode => {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
    masterGain.connect(ctx.destination);
  }
  return masterGain;
};

const playNote = (
  ctx: AudioContext,
  destination: AudioNode,
  midi: number,
  start: number,
  duration: number,
  type: OscillatorType,
  volume: number,
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(midiToFrequency(midi), start);

  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.012);
  gain.gain.setValueAtTime(volume, start + duration * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
};

const scheduleAhead = () => {
  const ctx = getAudioContext();
  if (!ctx || !currentTrack) return;

  const track = TRACKS[currentTrack];
  const stepDuration = 60 / track.bpm / 4; // 16th notes
  const destination = getMasterGain(ctx);

  while (nextStepTime < ctx.currentTime + 0.25) {
    const index = step % track.lead.length;
    const lead = track.lead[index];
    const bass = track.bass[index % track.bass.length];

    if (lead !== null) {
      playNote(ctx, destination, lead, nextStepTime, stepDuration * 1.8, 'square', 0.05);
    }
    if (bass !== null) {
      playNote(ctx, destination, bass, nextStepTime, stepDuration * 3.4, 'triangle', 0.09);
    }

    nextStepTime += stepDuration;
    step += 1;
  }
};

const resetScheduler = () => {
  const ctx = getAudioContext();
  step = 0;
  nextStepTime = (ctx ? ctx.currentTime : 0) + 0.05;
};

export const isBgmMuted = (): boolean => muted;

export const setBgmMuted = (nextMuted: boolean): void => {
  muted = nextMuted;
  try {
    localStorage.setItem(STORAGE_KEY, String(nextMuted));
  } catch {
    // ignore storage errors
  }
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : MASTER_VOLUME;
  }
};

export const toggleBgmMuted = (): boolean => {
  setBgmMuted(!muted);
  return muted;
};

export const startBgm = async (track: BgmTrack): Promise<void> => {
  const ctx = await ensureContext();
  if (!ctx) return;

  currentTrack = track;
  getMasterGain(ctx);

  if (schedulerId === null) {
    resetScheduler();
    schedulerId = window.setInterval(scheduleAhead, 40);
  } else {
    resetScheduler();
  }
};

export const setBgmTrack = (track: BgmTrack): void => {
  if (currentTrack === track) return;
  currentTrack = track;
  if (schedulerId !== null) {
    resetScheduler();
  }
};

export const stopBgm = (): void => {
  if (schedulerId !== null) {
    window.clearInterval(schedulerId);
    schedulerId = null;
  }
  currentTrack = null;
};
