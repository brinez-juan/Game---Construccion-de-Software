"use strict";
// Story cinematic manifest. Each key maps to a single composite comic-page image (the
// panels are baked into the art — see WebPage/Assets/cinematics/) and, for the
// between-screen cinematics, the numeric screen state to route to once the image ends.
// The pre-boss cinematics carry no `next`: they route back to whatever battle state
// triggered them (see Return.js _maybeBossCinematic).
const DIR = '../Assets/cinematics/';

export const CINEMATICS = {
    intro:        { img: DIR + '01_exile_oath.png',       next: 11 }, // → tutorial lobby
    postTutorial: { img: DIR + '02_forest_remembers.png', next: 10 }, // → castle map
    preGalahad:   { img: DIR + '03_below_the_stairs.png' },           // floor-1 boss
    postGalahad:  { img: DIR + '04_dying_tongue.png' },               // → victory screen
    preIsolde:    { img: DIR + '05_the_maiden.png' },                 // floor-2 boss
    postIsolde:   { img: DIR + '06_by_her_world.png' },               // NOTE: file spells "world"
    preEldric:    { img: DIR + '07_throne.png' },                     // floor-3 boss
    swordAndHand: { img: DIR + '08_sword_and_hand.png' },             // in-battle overlay
    ending:       { img: DIR + '09_return.png' },                     // → completion screen
};

// Time (ms) a cinematic page holds on screen before auto-advancing. Generous, since each
// image is a whole comic page; tune here if pages feel rushed or slow.
export const CINEMATIC_MS = 8000;
