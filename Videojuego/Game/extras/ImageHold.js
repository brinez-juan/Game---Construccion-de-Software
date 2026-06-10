"use strict";
import GameObject from '../libs/GameObject.js';
import { canvas } from '../Return.js';

// A single full-screen image shown for a fixed duration, drawn fit-to-canvas (aspect
// preserved, letterboxed on black) with a short fade-in and fade-out. Reused by the
// cinematicScreen (between-screen cinematics) and as a pause overlay inside battleScreen
// (the Eldric→Lysara reveal). `onDone` fires exactly once, when the hold elapses.
export default class ImageHold {
    constructor(imgPath, canvasWidth, canvasHeight, durationMs, onDone){
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.duration = durationMs;
        this.onDone = onDone;
        this.elapsed = 0;
        this.finished = false;
        this.fade = 350; // ms of fade-in and of fade-out
        // Reuse GameObject just for its image loading; this class draws the image itself
        // (fit-to-canvas), so the GameObject's position/size fields are unused.
        this.holder = new GameObject(0, 0, 0, 0);
        this.holder.setSprite(imgPath);
        // Playback is auto-timed, but a left click lets the player skip ahead. The listener
        // is removed by finish() (on skip OR timer), so it never outlives the hold.
        this._onClick = () => this.finish();
        canvas.addEventListener('click', this._onClick);
    }

    update(deltaTime){
        if(this.finished){ return; }
        this.elapsed += deltaTime;
        if(this.elapsed >= this.duration){ this.finish(); }
    }

    // Ends the hold — whether the timer elapsed or the player clicked to skip. Drops the
    // skip listener and fires onDone exactly once.
    finish(){
        if(this.finished){ return; }
        this.finished = true;
        canvas.removeEventListener('click', this._onClick);
        if(typeof this.onDone === 'function'){ this.onDone(); }
    }

    // Alpha ramp: fade in over the first `fade` ms, hold at 1, fade out over the last `fade` ms.
    currentAlpha(){
        if(this.elapsed < this.fade){ return this.elapsed / this.fade; }
        const remaining = this.duration - this.elapsed;
        if(remaining < this.fade){ return Math.max(0, remaining / this.fade); }
        return 1;
    }

    draw(ctx){
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        const img = this.holder.spriteImage;
        if(img && img.complete && img.naturalWidth > 0){
            // Scale to the largest size that fits both axes, then center (letterbox).
            const scale = Math.min(this.canvasWidth / img.naturalWidth, this.canvasHeight / img.naturalHeight);
            const w = img.naturalWidth * scale;
            const h = img.naturalHeight * scale;
            ctx.globalAlpha = this.currentAlpha();
            ctx.drawImage(img, (this.canvasWidth - w) / 2, (this.canvasHeight - h) / 2, w, h);
        }
        ctx.restore();
    }
}
