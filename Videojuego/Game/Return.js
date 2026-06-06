"use strict";
import battleScreen from './battleScreen.js';
import mainMenu from './mainMenu.js';
import selectionMenu from './selectionMenu.js';
import optionsMenu from './optionsMenu.js';
import creditScreen from './creditScreen.js';
import gameOverScreen from './gameOverScreen.js';
import successScreen from './successScreen.js';
import battleLobby from './battleLobby.js';
import archetypeScreen from './archetypeScreen.js';
import mapScreen, { MapManager } from './mapScreen.js';
import SavedGamesAPI from '../savedGamesApi.js';
import {
    normalizeCard,
    buildRoomStateMap,
    buildEnemyPoolByFloor,
    buildFloorRoomModel,
    buildCardSlugToId,
    buildEnemyCardDrops
} from './dataAdapter.js';

// Context of the Canvas
let ctx;
// A variable to store the game object
let game;
let oldTime = 0;

export const canvas = document.getElementById('canvas');

// Reusable background asset paths (relative to pages/game.html).
const BG = {
    main:    '../Assets/backgrounds/main_background.png',
    options: '../Assets/backgrounds/options_background.png',
    credits: '../Assets/backgrounds/credits.png',
    map:     '../Assets/backgrounds/mapa.png',
    lobby:   '../Assets/backgrounds/lobby_background.png',
    battleFallback: '../Assets/backgrounds/courtyard_1_1.png'
};

// Top-level controller that owns the canvas loop, the active screen and the screen stack
class Game {
    // `boot` carries the global reference data loaded from the backend before the
    // loop starts (rooms, enemies, card catalog, slots). Per-slot data is loaded
    // on demand once a slot is chosen, via loadSlotData().
    constructor(boot){
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.currentState = 0;
        this.isLoading = false;
        this.menuStack = [];
        this.api = boot.api;

        // Global reference data (DB-backed).
        this.roomsMap = boot.roomsMap;                 // stateCode (101-112) -> room
        this.floorRoomModel = boot.floorRoomModel;     // floors 1-3 for the castle map
        this.enemyPoolByFloor = boot.enemyPoolByFloor;  // floorNumber -> { regular, boss }
        this.cardCatalog = boot.cardCatalog;
        this.cardSlugToId = boot.cardSlugToId;          // starting-card slug -> card id
        this.enemyCardDrops = buildEnemyCardDrops(boot.cardCatalog); // enemyId -> droppable cards
        this.slots = boot.slots;                        // for main-menu Continue gating

        // Per-run state, filled as the player progresses.
        this.activeSlotId = null;
        this.runId = null;
        this.currentRoom = null;
        this.mapManager = null;
        this.runProgress = null;   // { floor, room } furthest reached, from the DB
        this.availablePoints = 0;
        this.enemiesDefeated = 0;  // accumulated across the run, shown on Game Over
        this.player = this.blankPlayer();

        this.currentMenu = new mainMenu(BG.main, this.canvasWidth, this.canvasHeight, 30, this.slots);
        this.currentState = 0;
    }

    blankPlayer(){
        return {
            maxHealth: 100, health: 100, maxStamina: 100, stamina: 100,
            attributes: { STRENGTH: 0, DEXTERITY: 0, INTELLIGENCE: 0, VIGOR: 0, ENDURANCE: 0 },
            level: 1, experience: 0, experienceToNextLevel: 100,
            inventory: [], activeDeck: []
        };
    }

    // Loads the chosen slot's profile, attributes and cards into the runtime player.
    async loadSlotData(slotId){
        const slot = await this.api.fetchSlot(slotId);
        const attrs = await this.api.getAttributes(slotId);
        const rawCards = await this.api.listCards(slotId);
        const level = attrs.level ?? slot.profile?.level ?? 1;
        this.activeSlotId = slotId;
        this.runId = slot.run?.id ?? this.runId;
        // Furthest (floor, room) reached, used to rebuild the map on Continue.
        this.runProgress = slot.run ? { floor: slot.run.floor, room: slot.run.room } : null;
        this.availablePoints = attrs.availablePoints ?? 0;
        this.enemiesDefeated = 0;   // fresh run summary starts from zero

        // Restore the last Battle Deck saved for this run so Continue resumes with the
        // deck the player committed to (US22 Task 4). The saved deck is split out of the
        // inventory and the two are kept disjoint; a missing/empty deck just leaves
        // activeDeck empty and the lobby seeds a starter deck from the inventory.
        let activeDeck = [];
        let inventory = rawCards.map(normalizeCard);
        try {
            if(this.runId != null){
                const saved = await this.api.getRunDeck(this.runId);   // [{ slot, card_id }]
                if(saved?.length){
                    const byId = new Map(inventory.map(c => [c.cardId, c]));
                    activeDeck = saved.map(d => byId.get(d.card_id)).filter(Boolean);
                    const deckIds = new Set(activeDeck.map(c => c.cardId));
                    inventory = inventory.filter(c => !deckIds.has(c.cardId));
                }
            }
        } catch(err){
            console.warn('No saved deck to restore:', err);
        }

        this.player = {
            maxHealth: 100, health: 100, maxStamina: 100, stamina: 100,
            attributes: attrs.attributes,
            level,
            experience: slot.profile?.totalExperience ?? 0,
            // XP-to-next isn't stored; approximate from level (only matters once the
            // XP bar tracks per-level progress instead of cumulative XP).
            experienceToNextLevel: Math.round(100 * Math.pow(1.5, level - 1)),
            inventory,
            activeDeck
        };
    }

    // The forest tutorial room (floor 0, room 1) — off the castle map but still a
    // normal room in the state map.
    getForestRoom(){
        for(const room of this.roomsMap.values()){
            if(room.floorNumber === 0 && room.roomNumber === 1){ return room; }
        }
        return null;
    }

    // Creates the castle map manager when needed. When `progress` ({floor, room})
    // is given, the unlock state is rebuilt from the furthest room reached so a
    // continued run resumes where it left off.
    startMap(reset, progress = null){
        if(reset || !this.mapManager){
            this.mapManager = new MapManager(this.floorRoomModel);
            if(progress && progress.floor != null){
                this.mapManager.restoreFromProgress(progress.floor, progress.room);
            }
        }
    }

    // Persists the furthest room reached so the slot card updates and Continue
    // can resume. Best-effort (fire-and-forget); failures are logged, not fatal.
    async persistProgress(){
        if(!this.api || this.runId == null || !this.currentRoom){ return; }
        const victory = (this.currentRoom.floorNumber === 3 && this.currentRoom.isBoss) ? true : undefined;
        try {
            await this.api.updateRunProgress(this.runId, {
                finalFloor: this.currentRoom.floorNumber,
                finalRoom: this.currentRoom.roomNumber,
                victory
            });
            this.runProgress = { floor: this.currentRoom.floorNumber, room: this.currentRoom.roomNumber };
        } catch(err){
            console.error('Could not persist run progress:', err);
        }
    }

    // US16: adds battle XP to the player's cumulative total and re-derives the level
    // from it. `experience` mirrors player_profiles.total_experience (cumulative, as
    // seeded in loadSlotData), so we must NOT subtract on level-up the way Player.levelUp
    // does — instead the level is the highest L whose cumulative threshold the total has
    // passed. That threshold, 200 * (1.5^(L-1) - 1), is the running sum of the same
    // per-level 100 * 1.5^(n-1) curve the lobby uses, so the two stay consistent.
    // `experienceToNextLevel` tracks the current level's bar size for the HUD.
    awardExperience(amount){
        if(!this.player || !amount || amount <= 0){ return; }
        this.player.experience += amount;
        let level = 1;
        while(this.player.experience >= 200 * (Math.pow(1.5, level) - 1)){
            level++;
        }
        this.player.level = level;
        this.player.experienceToNextLevel = Math.round(100 * Math.pow(1.5, level - 1));
    }

    // US16: persists the player's accumulated XP + level onto the slot's player_profile
    // so progression survives between sessions. Best-effort (fire-and-forget), mirroring
    // persistProgress; failures are logged, not fatal.
    async persistExperience(){
        if(!this.api || this.activeSlotId == null || !this.player){ return; }
        try {
            await this.api.updateExperience(this.activeSlotId, {
                totalExperience: this.player.experience,
                level: this.player.level
            });
        } catch(err){
            console.error('Could not persist experience:', err);
        }
    }

    // Roguelite death rules (US23): wipe the run-only inventory + end the run in the
    // DB, then reset the in-memory run state so the next Continue starts fresh at the
    // beginning of the map. Permanent cards and accumulated level/XP are kept.
    // Best-effort persistence (fire-and-forget); the in-memory reset always runs.
    async resetRunOnDeath(){
        try {
            if(this.api && this.activeSlotId != null){
                await this.api.resetRunOnDeath(this.activeSlotId);
            }
        } catch(err){
            console.error('Could not reset run on death:', err);
        }
        // End the run and clear map progress so a new run rebuilds at the entry room.
        this.runId = null;
        this.runProgress = null;
        this.currentRoom = null;
        this.mapManager = null;
        // Restore HP and stamina to their initial values.
        this.player.health = this.player.maxHealth;
        this.player.stamina = this.player.maxStamina;
        // Drop the run-only cards but keep the permanent inventory; clear the deck.
        this.player.inventory = (this.player.inventory || []).filter(c => c.isPermanent);
        this.player.activeDeck = [];
        // Fresh run summary; level and experience are intentionally left untouched.
        this.enemiesDefeated = 0;
    }

    // Picks the floor-appropriate enemy pool for a room (boss list for boss rooms).
    enemyPoolFor(room){
        const pool = this.enemyPoolByFloor.get(room?.floorNumber);
        if(!pool){ return []; }
        if(room.isBoss && pool.boss.length){ return pool.boss; }
        return pool.regular.length ? pool.regular : pool.boss;
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
            this.currentMenu = new mainMenu(BG.main, this.canvasWidth, this.canvasHeight, 30, this.slots)
        }
        else if(state === 1){
            this.currentMenu = new selectionMenu(BG.main, this.canvasWidth, this.canvasHeight, this, 'new')
        }
        else if(state === 2){
            this.currentMenu = new selectionMenu(BG.main, this.canvasWidth, this.canvasHeight, this, 'continue')
        }
        else if(state === 3){
            if(this.currentMenu instanceof battleScreen){
                this.menuStack[this.menuStack.length - 1].dispose()
                this.menuStack.push(this.currentMenu)
            }
            this.currentMenu = new optionsMenu(BG.options, this.canvasWidth, this.canvasHeight, 'pause')
        }
        else if(state === 4){
            this.currentMenu = new creditScreen(BG.credits, this.canvasWidth, this.canvasHeight);
        }
        else if(state === 5){
            this.currentMenu = this.menuStack[this.menuStack.indexOf(this.currentMenu) - 1];
            this.currentMenu.pop();
        }
        else if(state === 6){
            // Generic battle entry: use the room already selected, else default.
            const background = this.currentRoom?.background ?? BG.battleFallback;
            this.currentMenu = new battleScreen(background, this.canvasWidth, this.canvasHeight, this.player, this.enemyPoolFor(this.currentRoom), this, !!this.currentRoom?.isBoss)
        }
        else if(state === 7){
            // Snapshot the run summary BEFORE resetting (resetRunOnDeath clears these),
            // so the Game Over screen shows the real floor/kills/level instead of defaults.
            const stats = {
                floorsCompleted: this.runProgress?.floor ?? this.currentRoom?.floorNumber ?? 0,
                enemiesDefeated: this.enemiesDefeated,
                finalLevel: this.player?.level ?? 1
            }
            // Reset the run on death (wipe run inventory, end run, reset map/HP/stamina)
            // before showing the Game Over screen. Best-effort; mirrors state 8's persist.
            this.resetRunOnDeath()
            this.currentMenu = new gameOverScreen(this.canvasWidth, this.canvasHeight, stats)
        }
        else if(state === 8){
            // Record progress before showing the victory screen. The forest tutorial
            // (floor 0) is off-map, so only castle rooms advance the map manager.
            if(this.mapManager && this.currentRoom && this.currentRoom.floorNumber !== 0){
                this.mapManager.completeRoom(this.currentRoom.floorNumber, this.currentRoom.roomNumber)
            }
            // Persist the cleared room so the slot card and Continue stay in sync, and
            // the XP/level earned this battle (US16) so progression survives the session.
            this.persistProgress()
            this.persistExperience()
            this.currentMenu = new successScreen(this.canvasWidth, this.canvasHeight)
        }
        else if(state === 9){
            this.currentMenu = new archetypeScreen(BG.main, this.canvasWidth, this.canvasHeight, this)
        }
        else if(state === 10){
            this.startMap(false)
            const self = this
            this.currentMenu = new mapScreen(BG.map, this.canvasWidth, this.canvasHeight, this.mapManager,
                function(room){ self.currentRoom = room })
        }
        else if(state === 11){
            const p = this.player
            this.currentMenu = new battleLobby(BG.lobby, this.canvasWidth, this.canvasHeight,
                p.experienceToNextLevel, p.experience, p.level, p.attributes, p.activeDeck, p.inventory,
                this.availablePoints, this.activeSlotId, this.api, this)
        }
        else if(this.roomsMap.has(state)){
            // Per-room battle: stateCode 101-112 maps to a DB-backed room + its
            // background asset and a floor-appropriate enemy pool.
            const room = this.roomsMap.get(state);
            this.currentRoom = room;
            this.currentMenu = new battleScreen(room.background, this.canvasWidth, this.canvasHeight, this.player, this.enemyPoolFor(room), this, !!room?.isBoss)
        }
        this.menuStack.push(this.currentMenu)
    }
}

// Bootstrap that gates on auth, loads the global reference data from the backend,
// then initializes the Game on the main menu, sizes the canvas and starts the loop.
async function main(){
    if(!localStorage.getItem('authToken')){
        window.location.href = '../pages/login.html';
        return;
    }

    const api = new SavedGamesAPI();
    let rawRooms = [], rawEnemies = [], rawCatalog = [], slots = [];
    // Reference data is non-critical — fall back to built-in tables if it fails.
    try { rawRooms = await api.listRooms(); }
    catch(err){ console.warn('Failed to load rooms; using fallback table:', err); }
    try { rawEnemies = await api.listEnemies(); }
    catch(err){ console.warn('Failed to load enemies:', err); }
    try { rawCatalog = await api.listCardCatalog(); }
    catch(err){ console.warn('Failed to load card catalog:', err); }
    // Slots require a valid token; a failure here means the session is unusable.
    try { slots = await api.listSlots(); }
    catch(err){
        console.error('Failed to load save slots (token may be expired):', err);
        window.location.href = '../pages/login.html';
        return;
    }

    const boot = {
        api,
        roomsMap: buildRoomStateMap(rawRooms),
        floorRoomModel: buildFloorRoomModel(rawRooms),
        enemyPoolByFloor: buildEnemyPoolByFloor(rawEnemies),
        cardCatalog: rawCatalog,
        cardSlugToId: buildCardSlugToId(rawCatalog),
        slots
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
