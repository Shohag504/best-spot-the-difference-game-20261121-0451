// main.js — Dhaka Days, a spot-the-difference game in three hand-drawn
// scenes. Owns the game state, the timer, scoring, hints and the screen
// flow (title → playing → level complete → next scene → win), and drives
// the render loop. Play with mouse or keyboard: H hints, M mutes,
// R restarts the scene, Enter starts.

import { LEVELS } from './levels.js';
import { render, CANVAS_W, CANVAS_H } from './render.js';
import { attachInput } from './input.js';
import { applyShotPreset } from './shots.js';
import {
  unlockAudio,
  playFind,
  playWrong,
  playClick,
  playWin,
  playHint,
  setMuted,
  isMuted,
} from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  screen: 'title',
  levelIndex: 0,
  level: LEVELS[0],
  found: new Set(),
  score: 0,
  timeLeft: LEVELS[0].timeLimit,
  hintsLeft: 3,
  hintTarget: null,
  hintUntil: 0,
  flashes: [],
  toast: null,
  lastBonus: 0,
  frozen: false,
};

const hud = {
  level: document.getElementById('hud-level'),
  timer: document.getElementById('hud-timer'),
  score: document.getElementById('hud-score'),
  left: document.getElementById('hud-left'),
  hints: document.getElementById('hud-hints'),
  mute: document.getElementById('btn-mute'),
};

function updateHud() {
  hud.level.textContent = `${state.level.name} — Scene ${state.levelIndex + 1} of 3`;
  hud.timer.textContent = `${Math.max(0, Math.ceil(state.timeLeft))}s`;
  hud.timer.classList.toggle('low', state.timeLeft <= 10 && state.screen === 'playing');
  hud.score.textContent = `${state.score}`;
  hud.left.textContent = `${state.level.differences.length - state.found.size} left`;
  hud.hints.textContent = `Hints: ${state.hintsLeft}`;
  hud.mute.textContent = isMuted() ? 'Sound: off' : 'Sound: on';
  document.getElementById('btn-start').style.display = state.screen === 'playing' ? 'none' : '';
}

function startLevel(index) {
  state.levelIndex = index;
  state.level = LEVELS[index];
  state.found = new Set();
  state.timeLeft = state.level.timeLimit;
  state.hintsLeft = 3;
  state.hintTarget = null;
  state.hintUntil = 0;
  state.flashes = [];
  state.toast = null;
  state.lastBonus = 0;
  state.screen = 'playing';
  updateHud();
}

function showLevel(index) {
  state.levelIndex = index;
  state.level = LEVELS[index];
  state.found = new Set();
  state.timeLeft = state.level.timeLimit;
  state.hintsLeft = 3;
  state.hintTarget = null;
  state.screen = 'title';
  updateHud();
}

function nearestUnfound(x, y) {
  let best = null;
  let bestDist = Infinity;
  state.level.differences.forEach((d, i) => {
    if (state.found.has(i)) return;
    const dist = Math.hypot(d.x - x, d.y - y);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  if (best === null) return null;
  const d = state.level.differences[best];
  return bestDist <= d.r + 10 ? best : null;
}

const game = {
  state,
  startLevel,
  showLevel,

  clickPanel(panel, x, y) {
    if (state.screen !== 'playing' || state.frozen) return;
    unlockAudio();
    const id = nearestUnfound(x, y);
    if (id !== null) {
      state.found.add(id);
      state.score += 100;
      const label = state.level.differences[id].label;
      state.toast = { text: `Found ${label}! +100`, at: Date.now() };
      playFind();
      if (state.found.size === state.level.differences.length) {
        const bonus = Math.ceil(state.timeLeft) * 5;
        state.lastBonus = bonus;
        state.score += bonus;
        state.screen = 'levelComplete';
        playWin();
      }
    } else {
      state.flashes.push({ panel, x, y, at: Date.now() });
      state.score = Math.max(0, state.score - 25);
      state.timeLeft = Math.max(0, state.timeLeft - 3);
      state.toast = { text: 'Not there — −25 points', at: Date.now() };
      playWrong();
    }
    updateHud();
  },

  pressStart() {
    unlockAudio();
    if (state.screen === 'title') {
      playClick();
      startLevel(state.levelIndex);
    } else if (state.screen === 'levelComplete') {
      playClick();
      if (state.levelIndex < LEVELS.length - 1) startLevel(state.levelIndex + 1);
      else state.screen = 'gameComplete';
    } else if (state.screen === 'gameComplete') {
      playClick();
      state.score = 0;
      startLevel(0);
    }
    updateHud();
  },

  useHint() {
    if (state.screen !== 'playing' || state.frozen) return;
    if (state.hintsLeft <= 0) return;
    const remaining = state.level.differences.map((_, i) => i).filter((i) => !state.found.has(i));
    if (remaining.length === 0) return;
    unlockAudio();
    state.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintUntil = Date.now() + 2500;
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - 50);
    playHint();
    updateHud();
  },

  toggleMute() {
    setMuted(!isMuted());
    updateHud();
  },

  restartLevel() {
    if (state.screen === 'playing' || state.screen === 'timeUp') {
      unlockAudio();
      startLevel(state.levelIndex);
    }
  },

  backToTitle() {
    showLevel(0);
  },

  pickLevel(index) {
    if (state.screen === 'title' && index >= 0 && index < LEVELS.length) {
      showLevel(index);
    }
  },
};

document.getElementById('btn-hint').addEventListener('click', () => game.useHint());
document.getElementById('btn-mute').addEventListener('click', () => game.toggleMute());
document.getElementById('btn-restart').addEventListener('click', () => game.restartLevel());
document.getElementById('btn-start').addEventListener('click', () => game.pressStart());

attachInput(canvas, game);
applyShotPreset(game, state);
updateHud();

// Test hook: the screenshot and play-test driver reads the state through it.
window.__dhaka = { state, game };

let lastTs = 0;
function loop(ts) {
  const dt = lastTs === 0 ? 0 : Math.min(0.1, (ts - lastTs) / 1000);
  lastTs = ts;
  if (state.screen === 'playing' && !state.frozen) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = 'timeUp';
      playWrong();
    }
    updateHud();
  }
  render(ctx, state);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
