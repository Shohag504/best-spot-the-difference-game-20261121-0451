// shots.js — deterministic states for the entry's screenshots. The page
// reads ?shot=... on load and poses the game: a title screen, a mid-play
// moment with some differences already found, a level-complete screen, or
// the final win screen. The timer is frozen in these states so the picture
// never changes between load and capture.

import { LEVELS } from './levels.js';

export function applyShotPreset(game, state) {
  const q = new URLSearchParams(location.search);
  const shot = q.get('shot');
  if (!shot) return;
  const level = Math.min(2, Math.max(0, Number(q.get('level') ?? 0)));
  const foundCount = Math.min(
    LEVELS[level].differences.length,
    Math.max(0, Number(q.get('found') ?? 0)),
  );
  state.frozen = true;
  if (shot === 'start') {
    game.showLevel(level);
    state.screen = 'title';
  } else if (shot === 'play') {
    game.startLevel(level);
    state.found = new Set(LEVELS[level].differences.map((_, i) => i).slice(0, foundCount));
    state.score = foundCount * 100;
    state.timeLeft = 74;
  } else if (shot === 'complete') {
    game.startLevel(level);
    state.found = new Set(LEVELS[level].differences.map((_, i) => i));
    state.score = 850;
    state.lastBonus = 210;
    state.screen = 'levelComplete';
  } else if (shot === 'win') {
    game.startLevel(2);
    state.found = new Set(LEVELS[2].differences.map((_, i) => i));
    state.score = 2450;
    state.screen = 'gameComplete';
  }
}
