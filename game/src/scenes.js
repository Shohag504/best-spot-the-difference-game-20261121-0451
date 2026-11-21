// scenes.js — every picture in Dhaka Days is drawn in code on a canvas, so
// the game ships no image files and works fully offline. Each scene is one
// function that draws the same picture twice: variant 0 is the left panel,
// variant 1 is the right panel, and the differences from levels.js are the
// only places where the two disagree. Scene space is 600 by 460.

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function sparkle(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fill();
}

function bird(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - s, y);
  ctx.quadraticCurveTo(x - s / 2, y - s, x, y);
  ctx.quadraticCurveTo(x + s / 2, y - s, x + s, y);
  ctx.stroke();
}

function cloud(ctx, x, y, s, color) {
  ellipse(ctx, x, y, 34 * s, 16 * s, color);
  ellipse(ctx, x - 22 * s, y + 5 * s, 22 * s, 12 * s, color);
  ellipse(ctx, x + 24 * s, y + 5 * s, 24 * s, 13 * s, color);
}

function cat(ctx, x, y, body, head) {
  // A cat sitting upright, facing left. (x, y) is the base of the body.
  ellipse(ctx, x, y - 14, 15, 18, body);
  circle(ctx, x - 4, y - 34, 12, head);
  poly(ctx, [[x - 14, y - 40], [x - 11, y - 52], [x - 5, y - 42]], head);
  poly(ctx, [[x + 2, y - 43], [x + 7, y - 53], [x + 11, y - 41]], head);
  ctx.strokeStyle = body;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 4);
  ctx.quadraticCurveTo(x + 26, y - 8, x + 24, y - 24);
  ctx.stroke();
  ctx.fillStyle = '#1d3557';
  circle(ctx, x - 8, y - 36, 1.6, '#1d3557');
}

function rickshaw(ctx, x, y, canopyColor) {
  // A colourful Dhaka rickshaw. (x, y) is the centre of the big rear wheel.
  ctx.strokeStyle = '#22223b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 96, y + 12, 27, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * 44, y + Math.sin(a) * 44);
    ctx.stroke();
  }
  // Seat bench and backrest.
  rect(ctx, x - 8, y - 62, 78, 12, '#9d0208');
  rect(ctx, x - 8, y - 108, 12, 50, '#9d0208');
  rect(ctx, x - 8, y - 108, 78, 10, '#e85d04');
  // Canopy: the big curved hood over the seat.
  ctx.fillStyle = canopyColor;
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 100);
  ctx.quadraticCurveTo(x + 30, y - 158, x + 84, y - 98);
  ctx.lineTo(x + 84, y - 86);
  ctx.quadraticCurveTo(x + 30, y - 136, x - 14, y - 88);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd60a';
  circle(ctx, x + 32, y - 122, 7, '#ffd60a');
  circle(ctx, x + 52, y - 118, 5, '#ffd60a');
  // Handlebar and footrest.
  ctx.strokeStyle = '#22223b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 96, y + 12);
  ctx.lineTo(x + 118, y - 30);
  ctx.stroke();
  rect(ctx, x + 78, y - 6, 34, 8, '#6c757d');
  // Flower basket on the back.
  rect(ctx, x - 52, y - 34, 30, 22, '#7f4f24');
  circle(ctx, x - 46, y - 38, 6, '#ff70a6');
  circle(ctx, x - 36, y - 42, 6, '#ffd670');
  circle(ctx, x - 26, y - 38, 6, '#ff9770');
}

function drawRickshawStreet(ctx, v) {
  // Sky, sun and clouds.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#a8d8ff');
  sky.addColorStop(1, '#fff3c4');
  rect(ctx, 0, 0, 600, 300, sky);
  circle(ctx, 512, 58, 34, '#ffd60a');
  ctx.strokeStyle = '#ffd60a';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(a) * 42, 58 + Math.sin(a) * 42);
    ctx.lineTo(512 + Math.cos(a) * 54, 58 + Math.sin(a) * 54);
    ctx.stroke();
  }
  cloud(ctx, 120, 60, 1, '#ffffff');
  cloud(ctx, 330, 42, 0.8, '#ffffff');
  // Kite: red on the left panel, blue on the right.
  const kiteColor = v === 0 ? '#e63946' : '#4361ee';
  poly(ctx, [[118, 62], [140, 88], [118, 116], [96, 88]], kiteColor);
  ctx.strokeStyle = '#6c757d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(118, 116);
  ctx.quadraticCurveTo(140, 160, 118, 210);
  ctx.stroke();
  // Birds: two are always there, the high one only on the left.
  bird(ctx, 350, 100, 10, '#1d3557');
  bird(ctx, 500, 122, 9, '#1d3557');
  if (v === 0) bird(ctx, 430, 68, 11, '#1d3557');
  // Buildings.
  rect(ctx, 30, 130, 130, 170, '#f4a259');
  rect(ctx, 165, 110, 155, 190, '#2a9d8f');
  rect(ctx, 325, 150, 120, 150, '#e76f51');
  // Windows on the first and third buildings.
  for (const [wx, wy] of [[55, 155], [105, 155], [55, 205], [105, 205], [55, 255], [350, 175], [400, 175], [350, 225], [400, 225]]) {
    rect(ctx, wx, wy, 24, 30, '#ffe8a3');
  }
  // The window that is lit on the left and dark on the right.
  rect(ctx, 165, 132, 26, 32, v === 0 ? '#ffd166' : '#264653');
  rect(ctx, 215, 140, 24, 30, '#ffe8a3');
  rect(ctx, 265, 140, 24, 30, '#ffe8a3');
  rect(ctx, 215, 190, 24, 30, '#ffe8a3');
  rect(ctx, 265, 190, 24, 30, '#ffe8a3');
  // Doors.
  rect(ctx, 85, 255, 30, 45, '#7f4f24');
  rect(ctx, 370, 255, 30, 45, '#7f4f24');
  // Road.
  rect(ctx, 0, 300, 600, 160, '#8d99ae');
  rect(ctx, 0, 300, 600, 6, '#6c757d');
  ctx.fillStyle = '#edf2f4';
  for (let x = 10; x < 600; x += 60) ctx.fillRect(x, 376, 34, 6);
  // Tree on the right.
  rect(ctx, 520, 200, 24, 130, '#7f4f24');
  circle(ctx, 532, 178, 56, '#588157');
  circle(ctx, 488, 208, 40, '#588157');
  circle(ctx, 574, 208, 40, '#588157');
  circle(ctx, 532, 150, 30, '#a3b18a');
  // Low wall with the cat: the cat sits there only on the left.
  rect(ctx, 460, 330, 140, 30, '#b08968');
  rect(ctx, 460, 330, 140, 8, '#ddb892');
  if (v === 0) cat(ctx, 522, 332, '#f4f1de', '#f4f1de');
  // Street lamp.
  rect(ctx, 58, 200, 8, 130, '#22223b');
  circle(ctx, 62, 194, 12, '#ffd60a');
  // The rickshaw, centre stage.
  rickshaw(ctx, 262, 356, v === 0 ? '#e63946' : '#1abc9c');
  // Flowers along the road.
  for (const [fx, fc] of [[30, '#ff70a6'], [90, '#ffd670'], [470, '#ff9770'], [540, '#ff70a6'], [585, '#ffd670']]) {
    circle(ctx, fx, 432, 7, fc);
    circle(ctx, fx + 12, 442, 6, '#ffffff');
  }
}

function drawNightBazaar(ctx, v) {
  // Night sky and ground.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#0f2040');
  sky.addColorStop(1, '#274472');
  rect(ctx, 0, 0, 600, 300, sky);
  rect(ctx, 0, 300, 600, 160, '#2b2d42');
  // Moon with a crater only on the left.
  circle(ctx, 90, 80, 36, '#ffe66d');
  if (v === 0) circle(ctx, 100, 70, 8, '#e9c46a');
  circle(ctx, 76, 92, 5, '#e9c46a');
  // Stars: four always there, the lone one only on the left.
  sparkle(ctx, 150, 50, 7, '#ffffff');
  sparkle(ctx, 250, 80, 6, '#ffffff');
  sparkle(ctx, 350, 45, 8, '#ffffff');
  sparkle(ctx, 430, 90, 6, '#ffffff');
  if (v === 0) sparkle(ctx, 502, 58, 7, '#ffffff');
  // Lantern string.
  ctx.strokeStyle = '#8d99ae';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 96);
  ctx.quadraticCurveTo(300, 150, 600, 96);
  ctx.stroke();
  const lanternXs = [60, 140, 220, 300, 380, 460, 540];
  lanternXs.forEach((lx, i) => {
    const sag = 100 + Math.sin((lx / 600) * Math.PI) * 26;
    const isMiddle = lx === 300;
    const color = isMiddle ? (v === 0 ? '#e63946' : '#2a9d8f') : ['#ff9f1c', '#ffbf69', '#e63946', '#ff9f1c', '#ffbf69', '#e63946', '#ff9f1c'][i];
    ctx.strokeStyle = '#8d99ae';
    ctx.beginPath();
    ctx.moveTo(lx, sag - 26);
    ctx.lineTo(lx, sag - 12);
    ctx.stroke();
    ellipse(ctx, lx, sag + 2, 16, 20, color);
    rect(ctx, lx - 16, sag - 8, 32, 4, '#ffd166');
    rect(ctx, lx - 16, sag + 12, 32, 4, '#ffd166');
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, sag + 20);
    ctx.lineTo(lx, sag + 30);
    ctx.stroke();
  });
  // Stall 1 (left): fruit stall with a vendor peeking over the awning.
  circle(ctx, 172, 196, 20, '#e9c46a');
  rect(ctx, 152, 212, 40, 40, '#2a9d8f');
  rect(ctx, 150, 252, 44, 48, '#2a9d8f');
  poly(ctx, [[48, 250], [292, 250], [272, 286], [68, 286]], '#e63946');
  for (let x = 60; x < 280; x += 36) rect(ctx, x, 250, 18, 36, '#ffffff');
  rect(ctx, 60, 286, 220, 94, '#7f4f24');
  rect(ctx, 60, 286, 220, 10, '#9c6644');
  // Oranges: one is missing on the right.
  const oranges = [[120, 318], [150, 310], [180, 318], [135, 336], [165, 336], [198, 322], [105, 336]];
  oranges.forEach(([ox, oy], i) => {
    if (i === 5 && v === 1) return;
    circle(ctx, ox, oy, 13, '#f48c06');
    circle(ctx, ox - 4, oy - 4, 3, '#ffd166');
  });
  // Apples.
  for (const [ax, ay] of [[222, 318], [246, 326], [234, 340], [258, 312]]) circle(ctx, ax, ay, 11, '#d90429');
  // Stall 2 (right): pots and bananas.
  poly(ctx, [[330, 250], [570, 250], [552, 286], [348, 286]], '#2a9d8f');
  for (let x = 342; x < 560; x += 36) rect(ctx, x, 250, 18, 36, '#ffffff');
  rect(ctx, 340, 286, 220, 94, '#7f4f24');
  rect(ctx, 340, 286, 220, 10, '#9c6644');
  // The blue pot: blue on the left, purple on the right.
  ellipse(ctx, 452, 330, 26, 20, v === 0 ? '#4361ee' : '#7209b7');
  rect(ctx, 438, 306, 28, 10, v === 0 ? '#3a0ca3' : '#560bad');
  ellipse(ctx, 452, 352, 26, 8, v === 0 ? '#3a0ca3' : '#560bad');
  // Bananas: three on the left, two on the right.
  const bananas = v === 0 ? 3 : 2;
  for (let i = 0; i < bananas; i++) {
    ctx.strokeStyle = '#ffd60a';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(316 + i * 10, 312);
    ctx.quadraticCurveTo(322 + i * 10, 340, 312 + i * 10, 352);
    ctx.stroke();
  }
  // Hanging sign with a mango.
  rect(ctx, 420, 210, 64, 34, '#ddb892');
  ellipse(ctx, 452, 228, 12, 14, '#ffb703');
  // Crate with the cat: the cat sits there only on the left.
  rect(ctx, 512, 372, 62, 38, '#9c6644');
  ctx.strokeStyle = '#7f4f24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(512, 391, 574, 391);
  ctx.stroke();
  if (v === 0) cat(ctx, 540, 372, '#e5e5e5', '#e5e5e5');
  // Scattered petals on the ground.
  for (const [px, py, pc] of [[90, 420, '#ff70a6'], [300, 430, '#ffd670'], [480, 425, '#ff9770'], [560, 440, '#ff70a6']]) {
    ellipse(ctx, px, py, 8, 4, pc);
  }
}

function drawRiverSunset(ctx, v) {
  // Sunset sky and sun.
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#ff9e5e');
  sky.addColorStop(0.6, '#ff6b9d');
  sky.addColorStop(1, '#7b2f8b');
  rect(ctx, 0, 0, 600, 260, sky);
  circle(ctx, 300, 195, 46, '#ffd166');
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(300, 195, 54, 0, Math.PI * 2);
  ctx.stroke();
  // Clouds: the right-hand cloud has an extra puff only on the left.
  cloud(ctx, 150, 70, 0.9, '#ffe5ec');
  cloud(ctx, 470, 60, 0.9, '#ffe5ec');
  if (v === 0) ellipse(ctx, 500, 52, 22, 12, '#ffe5ec');
  // Birds: two always there, the high one only on the left.
  bird(ctx, 200, 90, 10, '#3d0c3d');
  bird(ctx, 420, 80, 9, '#3d0c3d');
  if (v === 0) bird(ctx, 300, 58, 10, '#3d0c3d');
  // River.
  const river = ctx.createLinearGradient(0, 240, 0, 460);
  river.addColorStop(0, '#2a6f97');
  river.addColorStop(1, '#014f86');
  rect(ctx, 0, 240, 600, 220, river);
  // Golden reflection under the sun.
  ctx.fillStyle = 'rgba(255, 209, 102, 0.55)';
  for (let i = 0; i < 7; i++) {
    const w = 60 - i * 6;
    ctx.fillRect(300 - w / 2, 250 + i * 26, w, 8);
  }
  // Banks.
  ellipse(ctx, 60, 470, 130, 40, '#588157');
  ellipse(ctx, 550, 470, 120, 40, '#588157');
  // Left palm with coconuts: three on the left, two on the right.
  ctx.strokeStyle = '#7f4f24';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(70, 460);
  ctx.quadraticCurveTo(80, 300, 96, 170);
  ctx.stroke();
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 7;
  for (const [fx, fy, tx, ty] of [[96, 170, 40, 130], [96, 170, 70, 110], [96, 170, 130, 110], [96, 170, 155, 135], [96, 170, 96, 105]]) {
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.quadraticCurveTo((fx + tx) / 2, fy - 20, tx, ty);
    ctx.stroke();
  }
  circle(ctx, 86, 128, 9, '#6c4a1f');
  circle(ctx, 102, 124, 9, '#6c4a1f');
  if (v === 0) circle(ctx, 94, 140, 9, '#6c4a1f');
  // Right palm.
  ctx.strokeStyle = '#7f4f24';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(545, 460);
  ctx.quadraticCurveTo(535, 340, 520, 260);
  ctx.stroke();
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 6;
  for (const [fx, fy, tx, ty] of [[520, 260, 480, 225], [520, 260, 510, 205], [520, 260, 555, 210], [520, 260, 575, 235]]) {
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.quadraticCurveTo((fx + tx) / 2, fy - 16, tx, ty);
    ctx.stroke();
  }
  // Reeds on the right bank: five on the left, four on the right.
  const reeds = v === 0 ? [520, 532, 544, 556, 568] : [520, 532, 544, 556];
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 4;
  for (const rx of reeds) {
    ctx.beginPath();
    ctx.moveTo(rx, 430);
    ctx.lineTo(rx + 4, 388);
    ctx.stroke();
  }
  // Lily pads, one with a pink flower only on the left.
  ellipse(ctx, 150, 392, 26, 10, '#2d6a4f');
  ellipse(ctx, 180, 382, 24, 9, '#2d6a4f');
  if (v === 0) {
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ellipse(ctx, 180 + Math.cos(a) * 9, 376 + Math.sin(a) * 5, 5, 3, '#ff70a6');
    }
    circle(ctx, 180, 376, 4, '#ffd60a');
  }
  ellipse(ctx, 480, 400, 26, 10, '#2d6a4f');
  // The boat and the fisherman.
  poly(ctx, [[272, 312], [428, 312], [404, 344], [296, 344]], '#7f4f24');
  rect(ctx, 272, 306, 156, 8, '#9c6644');
  rect(ctx, 344, 240, 6, 72, '#6c4a1f');
  // Flag: red on the left, blue on the right.
  poly(ctx, [[350, 168], [382, 178], [350, 190]], v === 0 ? '#e63946' : '#4361ee');
  // Fisherman: body, head and hat (straw on the left, red on the right).
  rect(ctx, 300, 236, 24, 52, '#e76f51');
  circle(ctx, 312, 222, 12, '#e9c46a');
  ellipse(ctx, 312, 212, 20, 6, v === 0 ? '#ffd60a' : '#e63946');
  circle(ctx, 312, 204, 9, v === 0 ? '#ffd60a' : '#e63946');
  // Fishing rod and line.
  ctx.strokeStyle = '#6c4a1f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(324, 240);
  ctx.lineTo(408, 296);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(408, 296);
  ctx.lineTo(408, 320);
  ctx.stroke();
  // The jumping fish: only on the left.
  if (v === 0) {
    ctx.fillStyle = '#90e0ef';
    ctx.beginPath();
    ctx.ellipse(420, 292, 16, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();
    poly(ctx, [[434, 284], [446, 278], [442, 292]], '#90e0ef');
    ctx.fillStyle = '#023047';
    circle(ctx, 412, 288, 2, '#023047');
  }
  // Ripples.
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (const [rx, ry, rw] of [[180, 420, 40], [420, 350, 50], [300, 400, 60]]) {
    ctx.beginPath();
    ctx.ellipse(rx, ry, rw, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function drawScene(ctx, levelIndex, variant) {
  ctx.save();
  if (levelIndex === 0) drawRickshawStreet(ctx, variant);
  else if (levelIndex === 1) drawNightBazaar(ctx, variant);
  else drawRiverSunset(ctx, variant);
  ctx.restore();
}
