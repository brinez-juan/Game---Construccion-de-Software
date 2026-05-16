"use strict";
// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to define oldTime
let oldTime = 0
 
const canvas = document.getElementById('canvas');

//TODO: Replace with information gotten from the database
//Make it an instance attribute of game
const playerProfiles = [{field: 0,name: 'smv', level: 2, floor: 2,last_session: '03-04'}, {field: 2,name: 'smv', level: 2, floor: 2,last_session: '03-04'}]

class Game{
    constructor(){
        this.canvasWidth = 800; 
        this.canvasHeight = 600;
        //this.currentMenu = new mainMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, 30)
        this.currentMenu = new selectionMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, playerProfiles)
        this.addEventListeners();
    }

    addEventListeners(){

    }

    draw(ctx){
        this.currentMenu.draw(ctx)
    }

    update(deltaTime){
        this.currentMenu.update(deltaTime)
    }
}

function main(){
    // Create the game object
    game = new Game()
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

main()