// levels.js — the three hunts of Dhaka Days. Each level names its scene, its
// time limit, and its hidden differences in scene coordinates (the scene is
// 600 by 460). A difference is found by clicking near its spot on either
// picture; the label is the praise the game shows when it is found.

export const PANEL_W = 600;
export const PANEL_H = 460;

export const LEVELS = [
  {
    id: 'rickshaw-street',
    name: 'Rickshaw Street',
    subtitle: 'Morning in Dhaka — 5 differences',
    timeLimit: 90,
    differences: [
      { x: 430, y: 68, r: 26, label: 'the high bird' },
      { x: 298, y: 252, r: 30, label: 'the rickshaw canopy' },
      { x: 178, y: 148, r: 22, label: 'the lit window' },
      { x: 522, y: 332, r: 30, label: 'the cat on the wall' },
      { x: 118, y: 88, r: 26, label: 'the kite' },
    ],
  },
  {
    id: 'night-bazaar',
    name: 'Night Bazaar',
    subtitle: 'Lanterns and fruit stalls — 7 differences',
    timeLimit: 105,
    differences: [
      { x: 502, y: 58, r: 20, label: 'the lone star' },
      { x: 92, y: 78, r: 24, label: 'the moon crater' },
      { x: 300, y: 118, r: 24, label: 'the middle lantern' },
      { x: 198, y: 322, r: 24, label: 'the missing orange' },
      { x: 452, y: 342, r: 26, label: 'the blue pot' },
      { x: 540, y: 358, r: 28, label: 'the stall cat' },
      { x: 330, y: 330, r: 26, label: 'the bananas' },
    ],
  },
  {
    id: 'river-sunset',
    name: 'River Sunset',
    subtitle: 'Golden hour on the river — 8 differences',
    timeLimit: 120,
    differences: [
      { x: 420, y: 298, r: 26, label: 'the jumping fish' },
      { x: 92, y: 122, r: 24, label: 'the palm coconuts' },
      { x: 300, y: 58, r: 22, label: 'the high bird' },
      { x: 312, y: 208, r: 26, label: "the fisherman's hat" },
      { x: 352, y: 178, r: 22, label: 'the boat flag' },
      { x: 180, y: 382, r: 24, label: 'the lily flower' },
      { x: 482, y: 68, r: 28, label: 'the extra cloud puff' },
      { x: 542, y: 402, r: 26, label: 'the river reeds' },
    ],
  },
];
