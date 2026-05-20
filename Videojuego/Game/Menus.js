"use strict"; 
import GameObject from './GameObject.js';

//Move each of the classes to an independent file to make a cleaner structure
//Change Menus name to screens because it will be the base class for all the screens in the game
export default class Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.background = new GameObject(this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth, this.canvasHeight)
        this.background.setSprite(background)
        this.state; 
    }

    

    //Base update and initElelemtns methods to avoid crashes
    update(deltaTime){
    }

    initElements(){

    }

    draw(ctx){

    }
}
