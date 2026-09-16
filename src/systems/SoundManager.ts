let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  try {
    ctx = new AudioContext();
    return ctx;
  } catch {
    return null;
  }
}

function ensureResumed(): AudioContext | null {
  const c = getCtx();
  if (c && c.state === 'suspended') c.resume();
  return c;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.15, detune = 0) {
  const c = ensureResumed();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(vol, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

function playNoise(duration: number, vol = 0.06) {
  const c = ensureResumed();
  if (!c) return;
  const bufferSize = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3000;
  gain.gain.setValueAtTime(vol, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  source.start(c.currentTime);
  source.stop(c.currentTime + duration);
}

export const SoundManager = {
  doorBell() {
    playTone(880, 0.15, 'sine', 0.12);
    setTimeout(() => playTone(1100, 0.2, 'sine', 0.1), 100);
    setTimeout(() => playTone(1320, 0.25, 'sine', 0.08), 200);
  },

  cashRegister() {
    playTone(600, 0.08, 'square', 0.08);
    setTimeout(() => playTone(800, 0.08, 'square', 0.08), 60);
    setTimeout(() => playTone(1200, 0.15, 'square', 0.1), 120);
    setTimeout(() => playNoise(0.08, 0.05), 180);
  },

  coinDrop() {
    playTone(1400, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(1800, 0.12, 'sine', 0.08), 80);
  },

  stockShelf() {
    playNoise(0.06, 0.04);
    setTimeout(() => playTone(300, 0.08, 'triangle', 0.06), 40);
    setTimeout(() => playNoise(0.05, 0.03), 100);
  },

  buttonClick() {
    playTone(700, 0.06, 'sine', 0.08);
  },

  customerSad() {
    playTone(400, 0.15, 'triangle', 0.08);
    setTimeout(() => playTone(300, 0.2, 'triangle', 0.06), 120);
  },

  footstep() {
    playNoise(0.04, 0.02);
    playTone(200 + Math.random() * 60, 0.04, 'sine', 0.02);
  },

  openPanel() {
    playTone(500, 0.06, 'sine', 0.06);
    setTimeout(() => playTone(700, 0.08, 'sine', 0.05), 50);
  },

  closePanel() {
    playTone(600, 0.06, 'sine', 0.05);
    setTimeout(() => playTone(400, 0.08, 'sine', 0.04), 50);
  },

  dayEnd() {
    playTone(523, 0.15, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 150);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.1), 300);
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.12), 450);
  },

  levelUp() {
    playTone(523, 0.1, 'square', 0.07);
    setTimeout(() => playTone(659, 0.1, 'square', 0.07), 100);
    setTimeout(() => playTone(784, 0.1, 'square', 0.07), 200);
    setTimeout(() => playTone(1047, 0.2, 'square', 0.09), 300);
    setTimeout(() => playTone(1319, 0.3, 'square', 0.1), 400);
  },
};
