"use strict";
import battleScreen from './battleScreen.js';
import mainMenu from './mainMenu.js';
import selectionMenu from './selectionMenu.js';
import optionsMenu from './optionsMenu.js';
import creditScreen from './creditScreen.js';
import gameOverScreen from './gameOverScreen.js';
import successScreen from './successScreen.js';
import Player from './Player.js';
import battleLobby from './battleLobby.js';
import archetypeScreen from './archetypeScreen.js';
import SavedGamesAPI from '../savedGamesApi.js';
import { loadActiveSlot, normalizeCard, buildRoomStateMap } from './dataAdapter.js';

// Context of the Canvas
let ctx;
// A variable to store the game object
let game;
let oldTime = 0;

export const canvas = document.getElementById('canvas');

//TODO: Replace with information gotten from the database
//Make it an instance attribute of game

// Top-level controller that owns the canvas loop, the active screen and the screen stack
class Game {
    // `boot` carries the data loaded from the backend before the loop starts:
    // { api, slotId, attributes, level, availablePoints, totalExperience, experienceToNextLevel, deck, inventory }
    constructor(boot){
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.currentState = 0;
        this.isLoading = false;
        this.menuStack = [];
        this.playerProfiles = [{field: 0,name: 'smv', level: 2, floor: 2,last_session: '03-04'}, {field: 2,name: 'smv', level: 2, floor: 2,last_session: '03-04'}];
        this.api = boot.api;
        this.activeSlotId = boot.slotId;
        // stateCode (101-112) -> room { id, floorNumber, roomNumber, isBoss, background }.
        // Each room has a distinct screen state; a level-selection screen jumps to a room
        // by setting this.state to its stateCode. currentRoom is the one in play.
        this.rooms = boot.rooms;
        this.currentRoom = null;
        this.player = {
            maxHealth: 100, health: 100, maxStamina: 100, stamina: 100,
            attributes: boot.attributes,
            level: boot.level,
            experience: boot.totalExperience,
            experienceToNextLevel: boot.experienceToNextLevel,
            inventory: boot.inventory,
            activeDeck: boot.deck
        };
        this.currentMenu = new battleLobby('../Assets/backgrounds/lobby_background.png', this.canvasWidth, this.canvasHeight,
            boot.experienceToNextLevel, boot.totalExperience, boot.level,
            boot.attributes, boot.deck, boot.inventory, boot.availablePoints, this.activeSlotId, this.api)
        this.currentEnemyPool = [{name: 'corrupt_knight', health: 30, maxHealth: 30, stamina: 50, maxStamina: 50, attributes: {strength: 5, dexterity: 5, intelligence: 5}}, {name: 'corrupt_knight', health: 30, maxHealth: 30, stamina: 50, maxStamina: 50, attributes: {strength: 5, dexterity: 5, intelligence: 5}}, {name: 'corrupt_knight', health: 30, maxHealth: 30, stamina: 50, maxStamina: 50, attributes: {strength: 5, dexterity: 5, intelligence: 5}}];
        this.addEventListeners();
    }

    addEventListeners(){}

    draw(ctx){
        this.currentMenu.draw(ctx);
    }

    // Per-frame tick that propagates updates and swaps screens when the active state changes
    update(deltaTime){
        if (this.currentState != this.currentMenu.state){
            this.currentState = this.currentMenu.state;
            this.screenManager(this.currentMenu.state);
        }
        if(this.menuStack.length > 3){
            this.menuStack.shift();
        }
        this.currentMenu.update(deltaTime);
    }

    // Maps numeric state codes to concrete screen instances and pushes them to the stack
    screenManager(state){
        if(state === 0){
           this.currentMenu = new mainMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, 30, this.playerProfiles)
        }
        else if(state === 1){
            this.currentMenu = new selectionMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, this.playerProfiles, 'new')
        }
        else if(state === 2){
            this.currentMenu = new selectionMenu('../Assets/backgrounds/main_background.png', this.canvasWidth, this.canvasHeight, this.playerProfiles, 'continue');
        }
        else if(state === 3){
            if(this.currentMenu instanceof battleScreen){
                this.menuStack[this.menuStack.length - 1].dispose()
                this.menuStack.push(this.currentMenu)
            }
            this.currentMenu = new optionsMenu('../Assets/backgrounds/options_background.png', this.canvasWidth, this.canvasHeight, 'pause')
        }
        else if(state === 4){
            this.currentMenu = new creditScreen('../Assets/backgrounds/credits.png', this.canvasWidth, this.canvasHeight);
        }
        else if(state === 5){
            this.currentMenu = this.menuStack[this.menuStack.indexOf(this.currentMenu) - 1];
            this.currentMenu.pop();
        }
        else if(state === 6){
            // Generic battle entry: use the room already selected, else default to the courtyard.
            const background = this.currentRoom?.background ?? '../Assets/backgrounds/courtyard_1_1.png';
            this.currentMenu = new battleScreen(background, this.canvasWidth, this.canvasHeight, this.player, this.currentEnemyPool)
        }
        else if(state === 7){
            this.currentMenu = new gameOverScreen(this.canvasWidth, this.canvasHeight)
        }
        else if(state === 8){
            this.currentMenu = new successScreen(this.canvasWidth, this.canvasHeight)
        }
        else if(this.rooms.has(state)){
            // Per-room battle: stateCode 101-112 maps to a DB-backed room + its background asset.
            const room = this.rooms.get(state);
            this.currentRoom = room;
            this.currentMenu = new battleScreen(room.background, this.canvasWidth, this.canvasHeight, this.player, this.currentEnemyPool)
        }
        this.menuStack.push(this.currentMenu)
    }
}

// Bootstrap that gates on auth, loads the active save slot from the backend,
// then initializes the Game, sizes the canvas and starts the render loop.
async function main(){
    if(!localStorage.getItem('authToken')){
        window.location.href = '../pages/login.html';
        return;
    }

    const api = new SavedGamesAPI();
    let slot, attrs, rawCards, rawRooms = [];
    try {
        slot = await loadActiveSlot(api);
        if(!slot){ console.error('No save slots for this user. Create one first.'); return; }
        if(!slot.profile){ console.error('Active slot has no profile yet — pick an archetype first.'); return; }
        attrs = await api.getAttributes(slot.id);
        rawCards = await api.listCards(slot.id);
        // Room catalog is non-critical: fall back to the built-in table if it fails.
        try { rawRooms = await api.listRooms(); }
        catch(roomsErr){ console.warn('Failed to load rooms; using fallback table:', roomsErr); }
    } catch(err){
        console.error('Failed to load save data (token may be expired):', err);
        window.location.href = '../pages/login.html';
        return;
    }

    const level = attrs.level ?? slot.profile.level ?? 1;
    const boot = {
        api,
        slotId: slot.id,
        attributes: attrs.attributes,
        level,
        availablePoints: attrs.availablePoints ?? 0,
        totalExperience: slot.profile.totalExperience ?? 0,
        // XP-to-next is not stored in the DB; approximate from level (exact only matters
        // once the XP bar tracks per-level progress instead of cumulative XP).
        experienceToNextLevel: Math.round(100 * Math.pow(1.5, level - 1)),
        deck: [],                          // no active deck persisted between runs yet
        inventory: rawCards.map(normalizeCard),
        rooms: buildRoomStateMap(rawRooms) // stateCode -> room (falls back when empty)
    };

    game = new Game(boot);
    canvas.width = game.canvasWidth;
    canvas.height = game.canvasHeight;
    ctx = canvas.getContext('2d');
    drawScene(0, game.canvasWidth, game.canvasHeight);
}

// Animation frame callback that computes delta time and redraws the active screen
function drawScene(newTime, canvasWidth, canvasHeight) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx);
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

main();
