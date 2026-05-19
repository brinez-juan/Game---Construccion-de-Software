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
        this.click = click; 
        this.hovered = false; 
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center'
        this.width = ctx.measureText(this.text).width
        this.height = ctx.measureText(this.text).actualBoundingBoxAscent +ctx.measureText(this.text).actualBoundingBoxDescent
        ctx.fillText(this.text, this.x, this.y);
    }

    mouseCollition(mouseX, mouseY){
        let left = this.x - this.width/2
        let right = this.x + this.width/2
        let top = this.y - this.height/2
        let bottom = this.y + this.height/2
        this.hovered = left <= mouseX && mouseX <= right && mouseY <= bottom && top <= mouseY
    }
}

export default TextLabel;
