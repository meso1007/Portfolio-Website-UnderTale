

// Web Audio API Context
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    // Cross-browser compatibility
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  return audioContext;
};

// Helper to ensure context is running (needed for Chrome/Edge autoplay policies)
export const ensureContext = async () => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    await ctx.resume().catch(() => {});
  }
  return ctx;
};

// 1. The Alert Sound (!)
export const playEncounter = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const t = ctx.currentTime;

  // Two oscillators for thickness and dissonance
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  // Sawtooth for sharp sound
  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';

  const freq = 880; 

  // Pitch envelope: Scoop up slightly
  osc1.frequency.setValueAtTime(freq - 100, t);
  osc1.frequency.linearRampToValueAtTime(freq, t + 0.05);
  
  // Detune second oscillator for dissonance
  osc2.frequency.setValueAtTime(freq - 100, t);
  osc2.frequency.linearRampToValueAtTime(freq + 15, t + 0.05);

  // LFO for vibrato/alarm feel
  const lfo = ctx.createOscillator();
  lfo.type = 'square';
  lfo.frequency.value = 30; // Fast vibrato
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 50; // Vibrato depth
  
  lfo.connect(lfoGain);
  lfoGain.connect(osc1.frequency);
  lfoGain.connect(osc2.frequency);
  lfo.start(t);

  // Volume envelope - Lowered from 0.5 to 0.15
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  // Start both oscillators immediately for the chord effect
  osc1.start(t);
  osc2.start(t); 
  
  osc1.stop(t + 0.4);
  osc2.stop(t + 0.4);
  lfo.stop(t + 0.4);
};

// 2. The Battle Start Swoosh
export const playBattleStart = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const t = ctx.currentTime;
            
  // Noise component
  const bufferSize = ctx.sampleRate * 1.0;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  const noiseFilter = ctx.createBiquadFilter();

  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(1000, t);
  noiseFilter.frequency.exponentialRampToValueAtTime(100, t + 0.8); // Close filter

  noiseGain.gain.setValueAtTime(0.5, t);
  noiseGain.gain.linearRampToValueAtTime(0, t + 0.8);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(t);

  // Tone component (Falling pitch)
  const swooshOsc = ctx.createOscillator();
  const swooshGain = ctx.createGain();
  
  swooshOsc.type = 'square';
  swooshOsc.frequency.setValueAtTime(800, t);
  swooshOsc.frequency.exponentialRampToValueAtTime(50, t + 0.8); // Drop pitch

  swooshGain.gain.setValueAtTime(0.2, t);
  swooshGain.gain.linearRampToValueAtTime(0, t + 0.8);

  swooshOsc.connect(swooshGain);
  swooshGain.connect(ctx.destination);
  swooshOsc.start(t);
  swooshOsc.stop(t + 0.8);
};

// Combined Sequence
export const playEncounterSequence = async () => {
  await ensureContext();
  playEncounter();
  // Removed playBattleStart call as requested
};

// 3. Select/Decision Sound (Piko)
export const playSelect = () => {
  ensureContext().then(ctx => {
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.setValueAtTime(680, now + 0.03);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  });
};

// 4. Confirm/Major Action (Pirorin)
export const playConfirm = () => {
  ensureContext().then(ctx => {
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      
      gain.gain.setValueAtTime(0.1, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.02, now + i * 0.08 + 0.15);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  });
};

// 5. Text Sound (Classic RPG Blip)
export const playText = () => {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return; // Don't force resume on every char
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square'; 
  osc.frequency.setValueAtTime(700, now); 
  
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.03);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
};

// 6. Save/Special Item (Chime)
export const playSave = () => {
  ensureContext().then(ctx => {
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const notes = [392, 523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      
      gain.gain.setValueAtTime(0.1, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.05, now + i * 0.12 + 0.2);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.12 + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.45);
    });
  });
};

// 7. Menu Move/Hover (Pi)
export const playMenuMove = () => {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return; // Only play hover if context is active
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, now);
  
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.035);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
};

// 8. Cancel (Falling pitch)
export const playCancel = () => {
  ensureContext().then(ctx => {
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.setValueAtTime(400, now + 0.03);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  });
};

// 9. Damage Sound (Zuba!)
export const playDamage = () => {
  ensureContext().then(ctx => {
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Sawtooth with rapid pitch drop for impact
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.1);
    
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    
    // Add noise burst for "crunch"
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.linearRampToValueAtTime(0, now + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
    
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  });
};