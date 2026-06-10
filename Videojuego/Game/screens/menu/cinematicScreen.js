"use strict";
import Menus from './Menus.js';
import ImageHold from '../../extras/ImageHold.js';
import { CINEMATIC_MS } from '../../extras/cinematics.js';

// Auto-timed full-screen story cinematic: shows one composite comic-page image for
// CINEMATIC_MS (fit-to-canvas, fade in/out), then routes to `nextState`. No input needed —
// the existing Game.update()/screenManager() swap picks up `this.state` once it changes.
// `state` starts undefined (like mapScreen) so the loop doesn't transition prematurely.
export default class cinematicScreen extends Menus {
    constructor(canvasWidth = 0, canvasHeight = 0, imgPath = '', nextState = 0){
        super('', canvasWidth, canvasHeight);
        this.nextState = nextState;
        this.state = undefined;
        this.hold = new ImageHold(imgPath, canvasWidth, canvasHeight, CINEMATIC_MS, () => {
            this.state = this.nextState;
        });
    }

    update(deltaTime){
        this.hold.update(deltaTime);
    }

    draw(ctx){
        this.hold.draw(ctx);
    }
}
