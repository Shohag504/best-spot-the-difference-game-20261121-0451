// render.js — draws the whole play field on one canvas: the two panels, the
// panel labels, found markers on both pictures, hint pulses, wrong-click
// flashes, and the title / level-complete / game-complete / time-up screens.
// Panel layout (canvas 1280 by 600): left panel at (20, 60), right at
// (660, 60), each 600 by 460.

import { PANEL_W, PANEL_H } from './levels.js';
import { drawScene } from './scenes.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 600;
export const LEFT_X = 20;
export const RIGHT_X = 660;
export const PANEL_Y = 60;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFoundMark(ctx, px, py, x, y, r) {
  ctx.save();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(px + x, py + y, r + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px + x, py + y, r + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(px + x - 12, py + y + 1);
  ctx.lineTo(px + x - 3, py + y + 10);
  ctx.lineTo(px + x + 13, py + y - 9);
  ctx.stroke();
  ctx.restore();
}

function drawPanels(ctx, state) {
  const level = state.level;
  // Panel frames.
  ctx.fillStyle = '#1d3557';
  roundRect(ctx, LEFT_X - 6, PANEL_Y - 6, PANEL_W + 12, PANEL_H + 12, 14);
  ctx.fill();
  roundRect(ctx, RIGHT_X - 6, PANEL_Y - 6, PANEL_W + 12, PANEL_H + 12, 14);
  ctx.fill();
  // Left picture (original) and right picture (changed). Each scene draws
  // in its own 600 by 460 space, translated into its panel.
  ctx.save();
  ctx.beginPath();
  ctx.rect(LEFT_X, PANEL_Y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(LEFT_X, PANEL_Y);
  drawScene(ctx, state.levelIndex, 0);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(RIGHT_X, PANEL_Y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(RIGHT_X, PANEL_Y);
  drawScene(ctx, state.levelIndex, 1);
  ctx.restore();
  // Found markers on both pictures.
  for (const id of state.found) {
    const d = level.differences[id];
    drawFoundMark(ctx, LEFT_X, PANEL_Y, d.x, d.y, d.r);
    drawFoundMark(ctx, RIGHT_X, PANEL_Y, d.x, d.y, d.r);
  }
  // Hint pulse: a golden ring breathing over one unfound difference.
  if (state.hintTarget !== null && state.hintUntil > Date.now()) {
    const d = level.differences[state.hintTarget];
    const pulse = 1 + 0.15 * Math.sin(Date.now() / 120);
    ctx.save();
    ctx.strokeStyle = '#ffd60a';
    ctx.lineWidth = 5;
    for (const px of [LEFT_X, RIGHT_X]) {
      ctx.beginPath();
      ctx.arc(px + d.x, PANEL_Y + d.y, (d.r + 10) * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
  // Wrong-click flashes.
  const now = Date.now();
  state.flashes = state.flashes.filter((f) => now - f.at < 700);
  for (const f of state.flashes) {
    const alpha = 1 - (now - f.at) / 700;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const px = f.panel === 0 ? LEFT_X : RIGHT_X;
    ctx.beginPath();
    ctx.moveTo(px + f.x - 12, PANEL_Y + f.y - 12);
    ctx.lineTo(px + f.x + 12, PANEL_Y + f.y + 12);
    ctx.moveTo(px + f.x + 12, PANEL_Y + f.y - 12);
    ctx.lineTo(px + f.x - 12, PANEL_Y + f.y + 12);
    ctx.stroke();
    ctx.restore();
  }
  // Panel labels.
  ctx.fillStyle = '#f1faee';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ORIGINAL', LEFT_X + 4, 38);
  ctx.textAlign = 'right';
  ctx.fillText('FIND THE CHANGES', RIGHT_X + PANEL_W - 4, 38);
  // Level line under the panels.
  ctx.fillStyle = '#a8dadc';
  ctx.font = '18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `${level.name}  •  ${state.found.size} of ${level.differences.length} found  •  ${state.hintsLeft} hints left`,
    CANVAS_W / 2,
    PANEL_Y + PANEL_H + 34,
  );
}

function drawOverlay(ctx, lines, accent) {
  ctx.fillStyle = 'rgba(10, 20, 40, 0.82)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = 'center';
  let y = 170;
  for (const line of lines) {
    ctx.fillStyle = line.color ?? '#f1faee';
    ctx.font = line.font ?? '28px system-ui, sans-serif';
    ctx.fillText(line.text, CANVAS_W / 2, y);
    y += line.gap ?? 52;
  }
  if (accent) {
    ctx.fillStyle = '#ffd60a';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(accent, CANVAS_W / 2, y + 10);
  }
}

export function render(ctx, state) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#0b1526';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawPanels(ctx, state);
  if (state.screen === 'title') {
    drawOverlay(ctx, [
      { text: 'DHAKA DAYS', font: 'bold 64px system-ui, sans-serif', color: '#ffd60a', gap: 84 },
      { text: 'Spot the Difference', font: 'bold 34px system-ui, sans-serif', gap: 56 },
      { text: 'Two pictures, a few sneaky changes. Click a difference on either side.', font: '22px system-ui, sans-serif', gap: 44 },
      { text: '3 scenes  •  5–8 differences each  •  H for a hint  •  M to mute', font: '20px system-ui, sans-serif', color: '#a8dadc' },
    ], 'Press Enter or click to start');
  } else if (state.screen === 'levelComplete') {
    drawOverlay(ctx, [
      { text: 'Scene complete!', font: 'bold 52px system-ui, sans-serif', color: '#22c55e', gap: 76 },
      { text: `${state.level.name} — all ${state.level.differences.length} differences found`, font: '26px system-ui, sans-serif', gap: 52 },
      { text: `Score ${state.score}  •  Time bonus +${state.lastBonus}`, font: '24px system-ui, sans-serif', gap: 48 },
    ], state.levelIndex < 2 ? 'Press Enter for the next scene' : 'Press Enter for your result');
  } else if (state.screen === 'gameComplete') {
    drawOverlay(ctx, [
      { text: 'You found them all!', font: 'bold 52px system-ui, sans-serif', color: '#ffd60a', gap: 76 },
      { text: 'All three Dhaka scenes complete', font: '26px system-ui, sans-serif', gap: 52 },
      { text: `Final score: ${state.score}`, font: 'bold 30px system-ui, sans-serif', gap: 48 },
    ], 'Press Enter to play again');
  } else if (state.screen === 'timeUp') {
    drawOverlay(ctx, [
      { text: "Time's up!", font: 'bold 52px system-ui, sans-serif', color: '#e63946', gap: 76 },
      { text: `${state.level.differences.length - state.found.size} differences were still hiding`, font: '26px system-ui, sans-serif', gap: 52 },
      { text: `Score ${state.score}`, font: '24px system-ui, sans-serif', gap: 48 },
    ], 'Press R to try this scene again');
  }
  // Toast for the latest find.
  if (state.toast && Date.now() - state.toast.at < 1800) {
    ctx.save();
    ctx.globalAlpha = 1 - Math.max(0, Date.now() - state.toast.at - 1200) / 600;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.95)';
    roundRect(ctx, CANVAS_W / 2 - 190, 8, 380, 40, 20);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.toast.text, CANVAS_W / 2, 35);
    ctx.restore();
  }
}
