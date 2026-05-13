"use strict";
// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to define oldTime
let oldTime = 0
 

class Game{
    constructor(canva){
        this.canvasWidth = 800; 
        this.canvasHeight = 600; 
        this.canvas = canva
        this.currentMenu = new mainMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, 30, this.canvas)
        this.addEventListeners();
    }

    addEventListeners(){

    }

    draw(ctx){
        this.currentMenu.draw(ctx)
    }

    update(deltaTime){

    }
}

function main(){
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');

    // Create the game object
    game = new Game(canvas)
    // Resize the element
    canvas.width = game.canvasWidth;
    canvas.height = game.canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');


    drawScene(0, game.canvasWidth, game.canvasHeight);   
}

function drawScene(newTime, canvasWidth, canvasHeight) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}