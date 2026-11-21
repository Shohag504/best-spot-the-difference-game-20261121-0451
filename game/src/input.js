// input.js — mouse and keyboard for Dhaka Days. A click on either picture
// is converted to scene coordinates (600 by 460) and handed to the game;
// keys drive hints, mute, restart and starting.

import { LEFT_X, RIGHT_X, PANEL_Y } from './render.js';
import { PANEL_W, PANEL_H } from './levels.js';

export function panelAt(clientX, clientY, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * canvas.width;
  const y = ((clientY - rect.top) / rect.height) * canvas.height;
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= LEFT_X && x <= LEFT_X + PANEL_W) {
    return { panel: 0, x: x - LEFT_X, y: y - PANEL_Y };
  }
  if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) {
    return { panel: 1, x: x - RIGHT_X, y: y - PANEL_Y };
  }
  return null;
}

export function attachInput(canvas, game) {
  canvas.addEventListener('pointerdown', (event) => {
    const hit = panelAt(event.clientX, event.clientY, canvas);
    if (hit) game.clickPanel(hit.panel, hit.x, hit.y);
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      game.pressStart();
    } else if (key === 'h') {
      game.useHint();
    } else if (key === 'm') {
      game.toggleMute();
    } else if (key === 'r') {
      game.restartLevel();
    } else if (key === 'escape') {
      game.backToTitle();
    } else if (key === '1' || key === '2' || key === '3') {
      game.pickLevel(Number(key) - 1);
    }
  });
}
