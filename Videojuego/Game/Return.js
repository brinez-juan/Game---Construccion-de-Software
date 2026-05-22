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
        this.menuStack.push(this.currentMenu)
        this.player = {maxHealth: 100, health: 100, maxStamina: 100, stamina: 100, attributes: {strength: 10, dexterity: 10, intelligence: 10}, 
        level: 1, experience: 0, experienceToNextLevel: 100, inventory: [], 
        activeDeck: [
          {id: 1, name: 'fireball', description: 'this is a fire ball', action_type: 'attack_magic', stamina_cost: 20, base_damage: 6, rarity: 'common', scales_with: 'intelligence', scaling_factor: 1.1, required_attribute: 'intelligence', required_value: 3, isPermanent: true},
          {id: 2, name: 'vicious_sword', description: 'A wickedly sharp sword with a dark aura', action_type: 'attack_physic', stamina_cost: 15, base_damage: 6, rarity: 'uncommon', scales_with: 'strength', scaling_factor: 1.2, required_attribute: 'strength', required_value: 5, isPermanent: true},
          {id: 3, name: 'knight_shield', description: 'A sturdy shield that provides strong defense', action_type: 'defend_physic', stamina_cost: 10, base_damage: 0, rarity: 'uncommon', scales_with: 'strength', scaling_factor: 1.1, required_attribute: 'strength', required_value: 4, isPermanent: true},
          {id: 4, name: 'battle_axe', description: 'A heavy axe designed for devastating attacks', action_type: 'attack_physic', stamina_cost: 25, base_damage: 6, rarity: 'rare', scales_with: 'strength', scaling_factor: 1.1, required_attribute: 'strength', required_value: 7, isPermanent: true},
          {id: 5, name: 'hunter_bow', description: 'A precise bow for swift and accurate strikes', action_type: 'attack_physic', stamina_cost: 12, base_damage: 6, rarity: 'uncommon', scales_with: 'dexterity', scaling_factor: 1.1, required_attribute: 'dexterity', required_value: 6, isPermanent: true}
        ]};
        this.currentEnemyPool = [{name: 'corrupt_knight', health: 30, maxHealth: 30, stamina: 50, maxStamina: 50, attributes: {strength: 5, dexterity: 5, intelligence: 5}}, {name: 'corrupt_knight', health: 30, maxHealth: 30, stamina: 50, maxStamina: 50, attributes: {strength: 5, dexterity: 5, intelligence: 5}}, {name: 'corrupt_knight', health: 30, maxHealth: 30, stamina: 50, maxStamina: 50, attributes: {strength: 5, dexterity: 5, intelligence: 5}}]; 
        this.currentMenu = new battleScreen('../Assets/backgrounds/background_1.png', this.canvasWidth, this.canvasHeight, this.player, this.currentEnemyPool)
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