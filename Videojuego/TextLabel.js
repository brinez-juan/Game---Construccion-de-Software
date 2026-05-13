/*
 * Class to draw text at specific positions within the game canvas
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";


class TextLabel {
    constructor(x, y, font, color, open = undefined, text, click = false) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
        this.open = open; 
        this.text = text; 
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center'
        ctx.fillText(this.text, this.x, this.y);

    }
}
