"use strict"; 
import GameObject from './GameObject.js';

// Base class shared by every screen rendered on the canvas
export default class Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.background = new GameObject(this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth, this.canvasHeight)
        this.background.setSprite(background)
        this.state; 
    }

    

    // Empty hooks subclasses override to add per-frame logic and rendering
    update(deltaTime){
    }

    initElements(){

    }

    draw(ctx){

    }
}
