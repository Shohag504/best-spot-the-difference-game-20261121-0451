// audio.js — all of Dhaka Days' sounds are synthesized with WebAudio, so
// the game ships no sound files. Each effect is a short oscillator phrase
// with a gain envelope; nothing plays before the first user gesture.

let context = null;
let muted = false;

function ensureContext() {
  if (!context) {
    const AudioContext = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContext) return null;
    context = new AudioContext();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(freq, at, dur, type, vol) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + at);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + at);
  osc.stop(ctx.currentTime + at + dur + 0.05);
}

export function unlockAudio() {
  ensureContext();
}

export function playFind() {
  tone(659, 0, 0.16, 'sine', 0.22);
  tone(880, 0.09, 0.24, 'sine', 0.22);
}

export function playWrong() {
  tone(160, 0, 0.22, 'square', 0.1);
  tone(110, 0.08, 0.26, 'square', 0.08);
}

export function playClick() {
  tone(520, 0, 0.07, 'triangle', 0.12);
}

export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.28, 'sine', 0.2));
}

export function playHint() {
  tone(440, 0, 0.12, 'sine', 0.14);
  tone(587, 0.1, 0.18, 'sine', 0.14);
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}
