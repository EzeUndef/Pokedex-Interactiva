// Retro 8-bit Sound Synthesizer & Chiptune BGM using Web Audio API

let audioCtx = null;
let sfxEnabled = true;
let bgmEnabled = false;
let bgmInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Reproduce un tono retro estilo Game Boy.
 */
function playTone(freq, duration = 0.1, type = 'square', gainLevel = 0.08) {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio autoplay restrictions if not yet interacted
  }
}

export const playSound = {
  // Clic de botón clásico de Pokédex
  click: () => {
    playTone(600, 0.04, 'square', 0.04);
  },

  // Selección de opción / abrir tarjeta
  select: () => {
    playTone(523.25, 0.06, 'square', 0.05);
    setTimeout(() => playTone(659.25, 0.08, 'square', 0.05), 50);
  },

  // Añadir al equipo o a favoritos
  add: () => {
    playTone(440, 0.05, 'triangle', 0.08);
    setTimeout(() => playTone(659.25, 0.06, 'triangle', 0.08), 50);
    setTimeout(() => playTone(880, 0.1, 'triangle', 0.08), 100);
  },

  // Quitar o cerrar
  remove: () => {
    playTone(659.25, 0.06, 'square', 0.05);
    setTimeout(() => playTone(440, 0.08, 'square', 0.05), 60);
  },

  // Fanfarria corta de victoria / comparación
  fanfare: () => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.09, 'square', 0.06), i * 70);
    });
  },

  // Bip de cambio de generación
  genSwitch: () => {
    playTone(330, 0.05, 'square', 0.04);
    setTimeout(() => playTone(493.88, 0.06, 'square', 0.04), 40);
  },
};

export function setSfxEnabled(enabled) {
  sfxEnabled = enabled;
  return sfxEnabled;
}

export function isSfxEnabled() {
  return sfxEnabled;
}

/* ── Chiptune BGM Generator (Melodía nostálgica de Pokémon) ── */

const MELODY = [
  { note: 523.25, dur: 0.18 }, // C5
  { note: 587.33, dur: 0.18 }, // D5
  { note: 659.25, dur: 0.18 }, // E5
  { note: 523.25, dur: 0.18 }, // C5
  { note: 659.25, dur: 0.18 }, // E5
  { note: 783.99, dur: 0.35 }, // G5
  { note: 659.25, dur: 0.18 }, // E5
  { note: 587.33, dur: 0.35 }, // D5

  { note: 523.25, dur: 0.18 }, // C5
  { note: 659.25, dur: 0.18 }, // E5
  { note: 587.33, dur: 0.18 }, // D5
  { note: 440.00, dur: 0.18 }, // A4
  { note: 493.88, dur: 0.18 }, // B4
  { note: 523.25, dur: 0.35 }, // C5
];

let melodyStep = 0;

function playNextNote() {
  if (!bgmEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const current = MELODY[melodyStep];
  melodyStep = (melodyStep + 1) % MELODY.length;

  try {
    // Voz Líder (onda cuadrada suave)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(current.note, ctx.currentTime);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + current.dur * 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + current.dur);

    // Bajo (onda triangular una octava abajo)
    if (melodyStep % 2 === 0) {
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'triangle';
      bass.frequency.setValueAtTime(current.note / 2, ctx.currentTime);

      bassGain.gain.setValueAtTime(0.025, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + current.dur * 1.8);

      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.start();
      bass.stop(ctx.currentTime + current.dur * 1.8);
    }
  } catch {
    // Ignore audio context autoplay
  }

  bgmInterval = setTimeout(playNextNote, current.dur * 1000 + 40);
}

export function toggleBgm() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }

  bgmEnabled = !bgmEnabled;
  if (bgmEnabled) {
    melodyStep = 0;
    playNextNote();
  } else {
    if (bgmInterval) {
      clearTimeout(bgmInterval);
      bgmInterval = null;
    }
  }
  return bgmEnabled;
}

export function isBgmPlaying() {
  return bgmEnabled;
}
