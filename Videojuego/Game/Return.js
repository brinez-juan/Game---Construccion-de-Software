"use strict";
import battleScreen from './battleScreen.js';
import mainMenu from './mainMenu.js';
import selectionMenu from './selectionMenu.js';
import optionsMenu from './optionsMenu.js';
import creditScreen from './creditScreen.js';
import Player from './Player.js';

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to define oldTime
let oldTime = 0
 
export const canvas = document.getElementById('canvas');

//TODO: Replace with information gotten from the database
//Make it an instance attribute of game

class Game{
    constructor(){
        this.canvasWidth = 800; 
        this.canvasHeight = 600;
        this.currentState = 0; 
        this.isLoading = false; 
        this.menuStack = [];
        this.playerProfiles = [{field: 0,name: 'smv', level: 2, floor: 2,last_session: '03-04'}, {field: 2,name: 'smv', level: 2, floor: 2,last_session: '03-04'}]; 
        //this.currentMenu = new mainMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, 30)
        this.currentMenu = new battleScreen('../Assets/backgrounds/background_1.png', this.canvasWidth, this.canvasHeight, undefined, undefined)
        this.menuStack.push(this.currentMenu)
        this.player = new Player(); 
        this.player.setSprite('../Assets/Sprites/player.png')
        this.currentEnemyPool = []; 
        this.addEventListeners();
    }

    addEventListeners(){

    }

    draw(ctx){
        this.currentMenu.draw(ctx)
    }

    update(deltaTime){
        if (this.currentState != this.currentMenu.state){
            this.currentState = this.currentMenu.state
            this.screenManager(this.currentMenu.state)
        }
        if(this.menuStack.length > 3){
            this.menuStack.shift()
        }
        this.currentMenu.update(deltaTime)
    }

    screenManager(state){
        if(state === 0){
           this.currentMenu = new mainMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, 30)
        }
        else if(state === 1){
            this.currentMenu = new selectionMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, this.playerProfiles, 'new')
        }
        else if(state === 2){
            this.currentMenu = new selectionMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, playerProfiles, 'continue')
        }
        else if(state === 3){
            this.currentMenu = new optionsMenu('../Assets/backgrounds/options_background.png', this.canvasWidth, this.canvasHeight, 'pause')
        }
        else if(state === 4){
            this.currentMenu = new creditScreen('../Assets/backgrounds/credits.png', this.canvasWidth, this.canvasHeight)
        }
        else if(state === 5){
            this.currentMenu = this.menuStack[this.menuStack.indexOf(this.currentMenu) - 1]
            this.currentMenu.pop()
        }
        this.menuStack.push(this.currentMenu)
    }

    playerSetup(){

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