"use strict";

import GameObject from "./GameObject.js";
import TextLabel from "./TextLabel.js";
import StaminaSystem from "./StaminaSystem.js";
import Player from "./Player.js";
import BattleLobbyUI from "./BattleLobbyUI.js";
import BattleDeckManager from "./BattleDeckManager.js";
import AttributePointSystem from "./AttributePointSystem.js";
import {
    ACTION_TYPES,
    PARRY_RESULTS,
    ARCHETYPES,
    MAX_DECK_SIZE,
    CARD_LIBRARY
} from "./GlobalVariables.js";
import { gameSession, createCardFromId } from "./GameSession.js";

const canvas = document.getElementById('canvas');

class Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.background = new GameObject(this.canvasWidth/2, this.canvasHeight/2, this.canvasWidth, this.canvasHeight);
        this.background.setSprite(background);
        this.state;
    }

    update(deltaTime){}
    initElements(){}
    draw(ctx){}
}

class mainMenu extends Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, btnSize, playerProfiles){
        super(background, canvasWidth, canvasHeight, canvas);
        this.textY = this.canvasHeight/2 + 100;
        this.buttonSize = btnSize;
        this.textElements = [];
        this.imgElements = [];
        this.playerData = playerProfiles;
        this.initElements();
    }

    update(deltaTime){
        for(let element of this.textElements){
            if(element.hovered){
                this.imgElements[this.imgElements.length - 1] = new GameObject(element.x - element.width, element.y - element.height/2, 560, 330);
                this.imgElements[this.imgElements.length - 1].setSprite("../Assets/Sprites/Selector.png");
            }
        }
    }

    initElements(){
        let buttons = ['New Game', 'Continue', 'Options', 'Credits'];
        this.addElement('img', this.canvasWidth/2, this.canvasHeight/2 -60, 1024, 575, true, '', false, '../Assets/Sprites/Logo.png');
        this.addElement('img');
        for(let button of buttons){
            this.addElement('text', this.canvasWidth/2, this.textY, this.buttonSize, this.buttonSize, true, button, true, undefined);
            this.textY += this.buttonSize + 10;
        }

        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            for(let element of this.textElements){
                element.mouseCollition(mouseX, mouseY);
            }
        });

        canvas.addEventListener('click', (e) =>{
            this.selectionChecker();
        });
    }

    addElement(elementType = '', x, y, width, height, open = undefined, text = '', click, sprite = ''){
        let element;
        if(elementType === 'text'){
            element = new TextLabel(x, y, `${width}px Academy`, 'black', open, text, click);
            this.textElements.push(element);
        }
        else if(elementType = 'img'){
            element = new GameObject(x, y, width, height, undefined, open, click);
            element.setSprite(sprite);
            this.imgElements.push(element);
        }
    }

    draw(ctx){
        this.background.draw(ctx);
        for(let element of this.textElements){
            element.draw(ctx);
        }
        for(let element of this.imgElements){
            element.draw(ctx);
        }
    }

    selectionChecker(){
        for(let element of this.textElements){
            if(element.hovered){
                if(element.text === 'New Game'){
                    this.state = 1;
                }
                else if(element.text === 'Continue' && this.playerData.length != 0){
                    this.state = 2;
                }
                else if(element.text === 'Options'){
                    this.state = 3;
                }
                else if(element.text === 'Credits'){
                    this.state = 4;
                }
            }
        }
    }
}

class selectionMenu extends Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, playerData, menu){
        super(background, canvasWidth, canvasHeight);
        this.fields = [];
        this.fieldLabels = [];
        this.fieldAmount = 3;
        this.returnButton;
        this.menuType = menu;
        this.fieldData = playerData;
        this.initElements();
        this.selectionField = {frame: undefined, yes: undefined, no: undefined, question: undefined, ok:undefined};
        this.elementSelected = undefined;
    }

    initElements(){
        let posX = this.canvasWidth/5;
        let posY = this.canvasHeight/2;
        let iconWidth = 200;
        let iconHeight = 400;
        let offSetX = 25;
        let offSetY = 25;
        this.returnButton = new GameObject(this.canvasWidth/11,this.canvasHeight/11, 150, 65, undefined, true, true);
        this.returnButton.setSprite('../Assets/Sprites/return_button.png');
        for(let i= 0; i < this.fieldAmount; i++){
            let element = new GameObject(posX, posY, iconWidth, iconHeight, undefined, true, true);
            element.setSprite('../Assets/Sprites/selection1.jpg');
            this.fields.push(element);
            posX += 200 + offSetX;
        }
        for(let j = 0; j < this.fieldAmount; j++){
            const currentCol = this.fieldData[j];
            if(currentCol){
                posX = this.canvasWidth/5 + currentCol['field']*(offSetX + iconWidth);
                posY = this.canvasHeight/2 - 30;
                for(const [key, value] of Object.entries(currentCol)){
                    if(key != 'field'){
                        let text = key + ': ' + value;
                        let label = new TextLabel(posX, posY, '20px Academia', 'black', true, text, true);
                        this.fieldLabels.push(label);
                        posY += offSetY;
                    }
                    else{
                        let text = value + 1;
                        let label = new TextLabel(posX, posY, '60px Academia', 'black', true, text, true);
                        this.fieldLabels.push(label);
                        posY += 2*offSetY;
                    }
                }
            }
            else{
                for(let i = 0; i < this.fieldAmount; i++){
                    let fieldExists = false;
                    posX = this.canvasWidth/5 + i*(offSetX + iconWidth);
                    posY = this.canvasHeight/2 - 30;
                    for(let element of this.fieldLabels){
                        if(element.x === posX){
                            fieldExists = true;
                            break;
                        }
                    }
                    if(!fieldExists){
                        let numberLabel = new TextLabel(posX, posY, '60px Academia', 'black', true, `${i + 1}`, true);
                        posY += 3*offSetY;
                        let label = new TextLabel(posX, posY, '20px Academia', 'black', true, 'No data', true);
                        this.fieldLabels.push(numberLabel);
                        this.fieldLabels.push(label);
                    }
                }
            }
        }

        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            for(let element of this.fields){
                element.mouseCollition(mouseX, mouseY);
            }
            this.returnButton.mouseCollition(mouseX, mouseY);
            if(this.elementSelected && this.selectionField.frame){
                Object.entries(this.selectionField).forEach(([key,value]) =>{
                    if(value && (key === 'no' || key === 'yes' || key === 'ok')){
                        value.mouseCollition(mouseX, mouseY);
                    }
                });
            }
        });

        canvas.addEventListener('click', (e) =>{
            if(!this.elementSelected){
                this.checkElementSelected();
            }else{
                this.elementFieldSelection();
            }
            if(this.returnButton.hovered && !this.elementSelected){
                this.state = 0;
            }
        });
    }

    draw(ctx){
        this.background.draw(ctx);
        this.returnButton.draw(ctx);
        for(let field of this.fields){
            field.draw(ctx);
        }
        for(let label of this.fieldLabels){
            label.draw(ctx);
        }
        if(this.elementSelected && this.selectionField.frame){
            Object.values(this.selectionField).forEach(value =>{
                if(value){
                    value.draw(ctx);
                }
            });
        }
    }

    update(deltaTime){
        for(let element of this.fields){
            if(element.hovered && !this.selectionField.frame){
                element.setSprite('../Assets/Sprites/selection2.png');
            }
            else{
                element.setSprite('../Assets/Sprites/selection1.jpg');
            }
        }
        if(this.returnButton.hovered && !this.selectionField.frame){
            this.returnButton.setSprite('../Assets/Sprites/return_2.png');
        }
        else{
            this.returnButton.setSprite('../Assets/Sprites/return_button.png');
        }
    }

    checkElementSelected(){
        for(let element of this.fields){
            if(element.hovered){
                this.elementSelected = element;
                const hasData = this.fieldData.find(data => data.field === this.fields.indexOf(this.elementSelected));
                if(hasData){
                    if(this.menuType === 'new'){
                        // Slot occupied: confirm overwrite before going to archetype selection.
                        this.selectionField.frame = new GameObject(this.canvasWidth/2, this.canvasHeight/2, 300, 300, undefined, undefined, undefined);
                        this.selectionField.frame.setSprite('../Assets/Sprites/selection1.jpg');
                        this.selectionField.yes = new TextLabel(this.canvasWidth/2 - this.selectionField.frame.width/3, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'yes', true);
                        this.selectionField.no = new TextLabel(this.canvasWidth/2 + this.selectionField.frame.width/3, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'no', true);
                        this.selectionField.question = new TextLabel(this.canvasWidth/2, this.canvasHeight/2, '30px Academia', 'black', undefined, 'Overwrite?', true);
                    }
                    else{
                        // Continue: jump straight to the lobby.
                        this.state = 9;
                    }
                }
                else{
                    if(this.menuType === 'new'){
                        // Empty slot in New Game flow: pick an archetype next.
                        this.state = 8;
                    }
                    else{
                        this.selectionField.frame = new GameObject(this.canvasWidth/2, this.canvasHeight/2, 300, 300, undefined, undefined, undefined);
                        this.selectionField.frame.setSprite('../Assets/Sprites/selection1.jpg');
                        this.selectionField.question = new TextLabel(this.canvasWidth/2, this.canvasHeight/2, '30px Academia', 'black', undefined, 'Can\'t continue', true);
                        this.selectionField.ok = new TextLabel(this.canvasWidth/2, this.canvasHeight/2 + this.selectionField.frame.height/3, '25px Academia', 'black', undefined, 'ok', true);
                    }
                }
            }
        }
    }

    elementFieldSelection(){
        Object.entries(this.selectionField).forEach(([key,value]) =>{
            if(value && value.hovered){
                if(key === 'yes'){
                    // Overwrite confirmed: archetype next.
                    this.state = 8;
                    this.elementSelected = undefined;
                    this.selectionField = Object.fromEntries(Object.keys(this.selectionField).map(key => [key, null]));
                }
                else if(key === 'no' || key === 'ok'){
                    this.elementSelected = undefined;
                    this.selectionField = Object.fromEntries(Object.keys(this.selectionField).map(key => [key, null]));
                }
            }
        });
    }
}

class creditScreen extends Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight);
        this.returnButton = new GameObject(this.canvasWidth/10,this.canvasHeight/7, 150, 65, undefined, true, true);
        this.returnButton.setSprite('../Assets/Sprites/return_button.png');
        this.initElements();
    }

    initElements(){
        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.returnButton.mouseCollition(mouseX, mouseY);
        });

        canvas.addEventListener('click', (e) =>{
            if(this.returnButton.hovered){
                this.state = 0;
            }
        });
    }

    draw(ctx){
        this.background.draw(ctx);
        this.returnButton.draw(ctx);
    }

    update(deltaTime){
        if(this.returnButton.hovered){
            this.returnButton.setSprite('../Assets/Sprites/return_2.png');
        }
        else{
            this.returnButton.setSprite('../Assets/Sprites/return_button.png');
        }
    }
}

class archetypeMenu extends Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight);
        this.archetypeIds = Object.keys(ARCHETYPES);
        this.cards = [];
        this.returnButton = new GameObject(this.canvasWidth/11, this.canvasHeight/11, 150, 65, undefined, true, true);
        this.returnButton.setSprite('../Assets/Sprites/return_button.png');
        this.title = new TextLabel(this.canvasWidth/2, 60, '36px Academia', 'black', true, 'Choose Your Archetype', false);
        this.initElements();
    }

    initElements(){
        const cardW = 200;
        const cardH = 360;
        const gap = 40;
        const totalW = cardW * this.archetypeIds.length + gap * (this.archetypeIds.length - 1);
        const startX = this.canvasWidth/2 - totalW/2 + cardW/2;
        const y = this.canvasHeight/2 + 30;
        for(let i = 0; i < this.archetypeIds.length; i++){
            const id = this.archetypeIds[i];
            const x = startX + i * (cardW + gap);
            const obj = new GameObject(x, y, cardW, cardH, undefined, true, true);
            obj.setSprite('../Assets/Sprites/selection1.jpg');
            obj.archetypeId = id;
            this.cards.push(obj);
        }

        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.returnButton.mouseCollition(mouseX, mouseY);
            for(let c of this.cards) c.mouseCollition(mouseX, mouseY);
        });

        canvas.addEventListener('click', (e)=>{
            if(this.returnButton.hovered){
                this.state = 0;
                return;
            }
            for(let c of this.cards){
                if(c.hovered){
                    gameSession.createPlayerForArchetype(c.archetypeId);
                    this.state = 9;
                    return;
                }
            }
        });
    }

    update(deltaTime){
        this.returnButton.setSprite(this.returnButton.hovered
            ? '../Assets/Sprites/return_2.png'
            : '../Assets/Sprites/return_button.png');
        for(let c of this.cards){
            c.setSprite(c.hovered
                ? '../Assets/Sprites/selection2.png'
                : '../Assets/Sprites/selection1.jpg');
        }
    }

    draw(ctx){
        this.background.draw(ctx);
        this.returnButton.draw(ctx);
        this.title.draw(ctx);
        for(let i = 0; i < this.cards.length; i++){
            const c = this.cards[i];
            c.draw(ctx);
            const arch = ARCHETYPES[c.archetypeId];
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.font = '24px Academia';
            ctx.fillText(arch.id.toUpperCase(), c.x, c.y - c.height/2 + 36);
            ctx.font = '16px Academia';
            let ay = c.y - c.height/2 + 70;
            for(const [k, v] of Object.entries(arch.attributes)){
                ctx.fillText(`${k}: ${v}`, c.x, ay);
                ay += 22;
            }
            ctx.font = '12px Academia';
            ay += 8;
            ctx.fillText('Starting cards:', c.x, ay);
            ay += 18;
            for(const cardId of arch.startingCards){
                const def = CARD_LIBRARY[cardId];
                ctx.fillText(def ? def.name : cardId, c.x, ay);
                ay += 14;
            }
        }
    }
}

// Thin canvas-side wrapper that swaps the visible DOM region from <canvas> to
// the BattleLobbyUI container and back. draw/update are intentional no-ops since
// the lobby renders as real DOM, not on the 2D context.
class lobbyScreen extends Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight);
        this.state = undefined;
        this._mount();
    }

    _mount(){
        const canvasContainer = document.querySelector('.Canva-container');
        const lobbyContainer = document.getElementById('lobby-container');
        if(canvasContainer) canvasContainer.style.display = 'none';
        if(!lobbyContainer) return;
        lobbyContainer.style.display = 'block';
        lobbyContainer.innerHTML = '';

        // Safety net so the lobby can be opened directly during dev (no archetype picked yet).
        if(!gameSession.player) gameSession.createPlayerForArchetype('SOLDIER');
        const player = gameSession.player;

        const self = this;
        let deckManager;
        let attrSystem;
        const ui = new BattleLobbyUI(lobbyContainer, player, {
            onCardClick: (card, el) => deckManager.handleCardClick(card, el),
            onAttrPlus: (attr) => attrSystem.spendPoint(attr),
            onContinue: async () => {
                await attrSystem.saveAttributes(gameSession.activeSaveSlotId);
                self._unmount();
                self.state = 7;
            }
        });
        deckManager = new BattleDeckManager(player, ui);
        attrSystem = new AttributePointSystem(player, ui, deckManager, {
            saveAttributes: async () => {} // no-op until the DB save endpoint exists
        });
        attrSystem.setPoints(3);

        this.ui = ui;
        this.deckManager = deckManager;
        this.attrSystem = attrSystem;
    }

    _unmount(){
        const canvasContainer = document.querySelector('.Canva-container');
        const lobbyContainer = document.getElementById('lobby-container');
        if(canvasContainer) canvasContainer.style.display = '';
        if(lobbyContainer){
            lobbyContainer.style.display = 'none';
            lobbyContainer.innerHTML = '';
        }
    }
}

class battleScreen extends Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight);
        this.menuOpen = false;
        this.menuBtn = {x: this.canvasWidth/2, y: 30, w: 30, h: 30};
        this.menuHovered = false;
        this.menuOptions = [
            new TextLabel(this.canvasWidth/2, this.canvasHeight/2 - 30, '30px Academia', 'white', true, 'Continue', true),
            new TextLabel(this.canvasWidth/2, this.canvasHeight/2 + 30, '30px Academia', 'white', true, 'Quit Battle', true)
        ];
        this.playerKnight = new GameObject(180, 380, 278, 422);
        this.playerKnight.setSprite('../Assets/backgrounds/player_knight.png');
        this.enemySprite = new GameObject(620, 380, 306, 422);
        this.enemySprite.setSprite('../Assets/Sprites/Enemie_caballero.png');

        // Use the session player (built by archetype + lobby). Fall back to a
        // pre-built soldier so the battle screen still works when invoked directly.
        this.staminaSystem = new StaminaSystem();
        if(gameSession.player){
            this.player = gameSession.player;
        } else {
            this.player = new Player(120, 120, 110, 110, { STRENGTH: 3, AGILITY: 1, INTELLIGENCE: 0, VIGOR: 2, ENDURANCE: 2 });
            ['basic_attack', 'heavy_strike', 'shield_block', 'fireball', 'recover'].forEach(id => {
                const card = createCardFromId(id);
                if(card){
                    this.player.inventory.push(card);
                    this.player.activeDeck.push(card);
                }
            });
        }
        this.staminaSystem.initRun(this.player);
        const source = this.player.activeDeck.length ? this.player.activeDeck : this.player.inventory;
        this.cards = source.slice(0, MAX_DECK_SIZE);

        this.enemy = {health: 80, maxHealth: 80, stamina: 50, maxStamina: 50, physicalDamage: 25, magicDamage: 20, physicalDefense: 5, magicDefense: 3, experienceReward: 50};
        this.turn = 'player';
        this.playerGuard = false;
        this.enemyGuard = false;
        this.enemyGuardType = null;
        this.selectedCard = null;
        this.parryResult = null;
        this.enemyAction = null;
        this.enemyMessage = '';
        this.enemyMessageTimer = 0;
        this.parryBar = {x: 200, y: 280, w: 400, h: 30};
        this.parryIndicatorX = 200;
        this.parryIndicatorDir = 1;
        this.parrySpeed = 1.2;
        this.parryActive = false;
        this.cardSlots = [];
        this.hoveredCardIndex = -1;
        this.initElements();
    }

    initElements(){
        const self = this;
        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            self.checkMenuHover(mouseX, mouseY);
            if(self.menuOpen){
                for(let option of self.menuOptions){
                    option.mouseCollition(mouseX, mouseY);
                }
            }
            else if(self.turn == 'player' || self.turn == 'victory' || self.turn == 'gameover'){
                self._checkCardHover(mouseX, mouseY);
            }
        });

        canvas.addEventListener('click', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            if(self.menuOpen){
                for(let option of self.menuOptions){
                    if(option.hovered){
                        if(option.text === 'Continue'){
                            self.menuOpen = false;
                        }
                        else if(option.text === 'Quit Battle'){
                            self.state = 0;
                        }
                    }
                }
            }
            else if(self.menuHovered){
                self.menuOpen = true;
            }
            else if(self.turn == 'player'){
                self._handleCardClick(mouseX, mouseY);
            }
            else if(self.turn == 'victory' || self.turn == 'gameover'){
                self.state = 0;
            }
        });

        window.addEventListener('keydown', function(e){
            if(e.code == 'Space' && self.turn == 'parry' && self.parryActive){
                self._resolveParry();
            }
        });
    }

    checkMenuHover(mouseX, mouseY){
        let left = this.menuBtn.x - this.menuBtn.w/2;
        let right = this.menuBtn.x + this.menuBtn.w/2;
        let top = this.menuBtn.y - this.menuBtn.h/2;
        let bottom = this.menuBtn.y + this.menuBtn.h/2;
        this.menuHovered = left <= mouseX && mouseX <= right && mouseY <= bottom && top <= mouseY;
    }

    _checkCardHover(mouseX, mouseY){
        this.hoveredCardIndex = -1;
        for(let i = 0; i < this.cardSlots.length; i++){
            const slot = this.cardSlots[i];
            if(mouseX >= slot.x && mouseX <= slot.x + slot.w && mouseY >= slot.y && mouseY <= slot.y + slot.h){
                this.hoveredCardIndex = i;
            }
        }
    }

    _handleCardClick(mouseX, mouseY){
        for(let i = 0; i < this.cardSlots.length; i++){
            const slot = this.cardSlots[i];
            if(mouseX >= slot.x && mouseX <= slot.x + slot.w && mouseY >= slot.y && mouseY <= slot.y + slot.h){
                const card = this.cards[i];
                if(!this.staminaSystem.canUseCard(this.player, card)){
                    return;
                }
                this._playCard(card);
            }
        }
    }

    _playCard(card){
        this.staminaSystem.useCard(this.player, card);
        const effect = card.calculateEffect(this.player.attributes);
        const actionType = card.action.actionType;
        if(actionType === ACTION_TYPES.ATTACK_PHYSIC){
            let damage = effect;
            if(this.enemyGuard && this.enemyGuardType === ACTION_TYPES.DEFEND_PHYSIC){
                damage = Math.floor(damage / 2);
                this.enemyMessage = 'Enemy blocked physical!';
            }
            this.enemy.health -= damage;
        }
        else if(actionType === ACTION_TYPES.ATTACK_MAGIC){
            let damage = effect;
            if(this.enemyGuard && this.enemyGuardType === ACTION_TYPES.DEFEND_MAGIC){
                damage = Math.floor(damage / 2);
                this.enemyMessage = 'Enemy blocked magic!';
            }
            this.enemy.health -= damage;
        }
        else if(actionType === ACTION_TYPES.DEFEND_PHYSIC || actionType === ACTION_TYPES.DEFEND_MAGIC){
            this.playerGuard = true;
            this.staminaSystem.applyDefensiveCardRecovery(this.player);
        }
        else if(actionType === ACTION_TYPES.HEALING){
            this.player.health = Math.min(this.player.maxHealth, this.player.health + effect);
        }
        this.enemyGuard = false;
        this.enemyGuardType = null;
        if(this.enemy.health <= 0){
            this.enemy.health = 0;
            this.turn = 'victory';
            this.player.gainExperience(this.enemy.experienceReward);
            return;
        }
        this.turn = 'enemy';
        this.enemyAction = this._decideEnemyAction();
    }

    _decideEnemyAction(){
        const ratio = this.enemy.health / this.enemy.maxHealth;
        const options = [];
        if(this.enemy.physicalDamage > 0) options.push(ACTION_TYPES.ATTACK_PHYSIC);
        if(this.enemy.magicDamage > 0) options.push(ACTION_TYPES.ATTACK_MAGIC);
        if(this.enemy.physicalDefense > 0) options.push(ACTION_TYPES.DEFEND_PHYSIC);
        if(this.enemy.magicDefense > 0) options.push(ACTION_TYPES.DEFEND_MAGIC);
        if(Math.random() < 0.2 && options.length > 0){
            return options[Math.floor(Math.random() * options.length)];
        }
        if(ratio > 0.6){
            return this.enemy.physicalDamage > this.enemy.magicDamage
                ? ACTION_TYPES.ATTACK_PHYSIC
                : ACTION_TYPES.ATTACK_MAGIC;
        }
        else if(ratio > 0.3){
            return options[Math.floor(Math.random() * options.length)];
        }
        else {
            if(this.enemy.physicalDefense > 0) return ACTION_TYPES.DEFEND_PHYSIC;
            if(this.enemy.magicDefense > 0) return ACTION_TYPES.DEFEND_MAGIC;
            return options[0];
        }
    }

    _enemyTurn(){
        if(this.enemyAction === ACTION_TYPES.ATTACK_PHYSIC || this.enemyAction === ACTION_TYPES.ATTACK_MAGIC){
            this.enemyMessage = 'Enemy attacks!';
            this.enemyMessageTimer = 1500;
            this.turn = 'parry';
            this.parryActive = true;
            this.parryIndicatorX = this.parryBar.x;
            this.parryIndicatorDir = 1;
        }
        else {
            this.enemyGuard = true;
            this.enemyGuardType = this.enemyAction;
            this.enemyMessage = 'Enemy defends!';
            this.enemyMessageTimer = 1500;
            this.turn = 'player';
        }
    }

    _parryZones(){
        const bar = this.parryBar;
        // AGILITY widens the perfect window — the only place AGILITY scales.
        const agilityBonus = (this.player.attributes.AGILITY ?? 0) * 6;
        const greenW = 30 + agilityBonus;
        const greenCenter = bar.x + bar.w/2;
        const greenLeft = greenCenter - greenW/2;
        const greenRight = greenCenter + greenW/2;
        const yellowW = 18;
        const yellowLeft = greenLeft - yellowW;
        const yellowRight = greenRight + yellowW;
        return { greenW, greenLeft, greenRight, yellowLeft, yellowRight };
    }

    _resolveParry(){
        this.parryActive = false;
        const zones = this._parryZones();
        if(this.playerGuard){
            this.parryResult = PARRY_RESULTS.NORMAL;
        }
        else if(this.parryIndicatorX >= zones.greenLeft && this.parryIndicatorX <= zones.greenRight){
            this.parryResult = PARRY_RESULTS.PERFECT;
        }
        else if(this.parryIndicatorX >= zones.yellowLeft && this.parryIndicatorX <= zones.yellowRight){
            this.parryResult = PARRY_RESULTS.NORMAL;
        }
        else {
            this.parryResult = PARRY_RESULTS.POOR;
        }
        const baseDmg = this.enemyAction === ACTION_TYPES.ATTACK_PHYSIC
            ? this.enemy.physicalDamage
            : this.enemy.magicDamage;
        let dmg = baseDmg;
        if(this.parryResult === PARRY_RESULTS.PERFECT){
            dmg = 0;
        }
        else if(this.parryResult === PARRY_RESULTS.NORMAL){
            dmg = Math.floor(baseDmg / 2);
        }
        this.staminaSystem.applyParryRecovery(this.player, this.parryResult);
        this.player.takesDamage(dmg);
        this.playerGuard = false;
        if(this.player.health <= 0){
            this.turn = 'gameover';
            return;
        }
        this.turn = 'player';
    }

    draw(ctx){
        this.background.draw(ctx);
        this.playerKnight.draw(ctx);
        this.enemySprite.draw(ctx);
        let barX = 20;
        let barY = 20;
        const barW = 300;
        const barH = 20;
        ctx.fillStyle = 'black';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = 'red';
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * (this.player.health / this.player.maxHealth), barH - 4);
        barY += 26;
        ctx.fillStyle = 'black';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = '#00ccff';
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * (this.player.stamina / this.player.maxStamina), barH - 4);
        ctx.fillStyle = this.menuHovered ? 'yellow' : 'white';
        const pauseX = this.menuBtn.x;
        const pauseY = this.menuBtn.y;
        const lineW = 6;
        const lineH = 24;
        const gap = 8;
        ctx.fillRect(pauseX - gap/2 - lineW, pauseY - lineH/2, lineW, lineH);
        ctx.fillRect(pauseX + gap/2, pauseY - lineH/2, lineW, lineH);

        barX = this.canvasWidth - 20 - barW;
        barY = 20;
        ctx.fillStyle = 'black';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = 'red';
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * (this.enemy.health / this.enemy.maxHealth), barH - 4);
        barY += 26;
        ctx.fillStyle = 'black';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = '#00ccff';
        ctx.fillRect(barX + 2, barY + 2, (barW - 4) * (this.enemy.stamina / this.enemy.maxStamina), barH - 4);
        ctx.textAlign = 'center';

        this._drawCards(ctx);

        if(this.parryActive){
            this._drawParryBar(ctx);
        }

        ctx.fillStyle = 'white';
        ctx.font = '20px Academia';
        ctx.textAlign = 'center';
        let turnText = this.turn.toUpperCase() + " TURN";
        if(this.turn == 'parry') turnText = "PARRY!";
        if(this.turn == 'victory') turnText = "VICTORY!";
        if(this.turn == 'gameover') turnText = "GAME OVER";
        ctx.fillText(turnText, this.canvasWidth/2, 100);
        if(this.enemyMessageTimer > 0){
            ctx.fillStyle = 'yellow';
            ctx.font = '24px Academia';
            ctx.fillText(this.enemyMessage, this.canvasWidth/2, 140);
        }

        if(this.turn == 'victory'){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.fillStyle = 'gold';
            ctx.font = '50px Academia';
            ctx.fillText("VICTORY!", this.canvasWidth/2, this.canvasHeight/2);
            ctx.fillStyle = 'white';
            ctx.font = '20px Academia';
            ctx.fillText("Click to continue", this.canvasWidth/2, this.canvasHeight/2 + 50);
        }
        if(this.turn == 'gameover'){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.fillStyle = 'red';
            ctx.font = '50px Academia';
            ctx.fillText("GAME OVER", this.canvasWidth/2, this.canvasHeight/2);
            ctx.fillStyle = 'white';
            ctx.font = '20px Academia';
            ctx.fillText("Click to retry", this.canvasWidth/2, this.canvasHeight/2 + 50);
        }

        if(this.menuOpen){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            for(let option of this.menuOptions){
                option.draw(ctx);
            }
        }
    }

    _colorForCard(card){
        switch(card.action.actionType){
            case ACTION_TYPES.ATTACK_PHYSIC: return 'red';
            case ACTION_TYPES.ATTACK_MAGIC: return 'purple';
            case ACTION_TYPES.DEFEND_PHYSIC: return 'blue';
            case ACTION_TYPES.DEFEND_MAGIC: return 'cyan';
            case ACTION_TYPES.HEALING: return 'lime';
            default: return 'white';
        }
    }

    _drawCards(ctx){
        const cardW = 100;
        const cardH = 60;
        const gap = 15;
        const startX = this.canvasWidth/2 - ((cardW + gap) * MAX_DECK_SIZE)/2 + gap/2;
        const startY = this.canvasHeight - 80;
        this.cardSlots = [];
        for(let i = 0; i < this.cards.length; i++){
            const card = this.cards[i];
            const x = startX + i * (cardW + gap);
            const y = startY;
            this.cardSlots.push({x, y, w: cardW, h: cardH});
            if(!this.staminaSystem.canUseCard(this.player, card)){
                ctx.fillStyle = '#444';
            }
            else if(this.hoveredCardIndex == i){
                ctx.fillStyle = '#666';
            }
            else {
                ctx.fillStyle = '#222';
            }
            ctx.fillRect(x, y, cardW, cardH);
            ctx.strokeStyle = this._colorForCard(card);
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cardW, cardH);
            ctx.fillStyle = 'white';
            ctx.font = '12px Academia';
            ctx.textAlign = 'center';
            ctx.fillText(card.name, x + cardW/2, y + 20);
            ctx.fillStyle = '#00ccff';
            ctx.font = '10px Academia';
            ctx.fillText(card.staminaCost + " SP", x + cardW/2, y + 40);
        }
    }

    _drawParryBar(ctx){
        const bar = this.parryBar;
        ctx.fillStyle = '#333';
        ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
        const zones = this._parryZones();
        ctx.fillStyle = 'red';
        ctx.fillRect(bar.x, bar.y, zones.yellowLeft - bar.x, bar.h);
        ctx.fillRect(zones.yellowRight, bar.y, bar.x + bar.w - zones.yellowRight, bar.h);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(zones.yellowLeft, bar.y, zones.greenLeft - zones.yellowLeft, bar.h);
        ctx.fillRect(zones.greenRight, bar.y, zones.yellowRight - zones.greenRight, bar.h);
        ctx.fillStyle = 'green';
        ctx.fillRect(zones.greenLeft, bar.y, zones.greenW, bar.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this.parryIndicatorX - 3, bar.y - 5, 6, bar.h + 10);
        ctx.fillStyle = 'white';
        ctx.font = '16px Academia';
        ctx.textAlign = 'center';
        ctx.fillText("PRESS SPACEBAR!", this.canvasWidth/2, bar.y - 15);
    }

    update(deltaTime){
        for(let option of this.menuOptions){
            option.color = option.hovered ? 'yellow' : 'white';
        }
        if(this.turn == 'enemy'){
            this._enemyTurn();
        }
        if(this.parryActive){
            this.parryIndicatorX += this.parryIndicatorDir * this.parrySpeed * deltaTime;
            if(this.parryIndicatorX >= this.parryBar.x + this.parryBar.w){
                this.parryIndicatorDir = -1;
            }
            if(this.parryIndicatorX <= this.parryBar.x){
                this.parryIndicatorDir = 1;
            }
        }
        if(this.enemyMessageTimer > 0){
            this.enemyMessageTimer -= deltaTime;
            if(this.enemyMessageTimer < 0) this.enemyMessageTimer = 0;
        }
    }
}

class loadingScreen extends Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0){
        super(background, canvasWidth, canvasHeight);
        this.loading = new GameObject(this.canvasWidth/2, this.canvasHeight/3 + 20, 100, 100, undefined, undefined, undefined);
        this.loadingWidth = 1024;
        this.loadingHeight = 1024;
        this.loading.setSprite('../Assets/Sprites/loading_animation.png', {x: 0, y: 0, width:this.loadingWidth/4, height: this.loadingHeight/4});
    }

    draw(ctx){
        this.background.draw(ctx);
        this.loading.draw(ctx);
    }

    update(deltaTime){
        this.loading.spriteRect.x += this.loading.spriteRect.width;
        if(this.loading.spriteRect.x >= this.loadingWidth){
            this.loading.spriteRect.x = 0;
            this.loading.spriteRect.y += this.loading.spriteRect.height;
        }
        if(this.loading.spriteRect.y >= this.loadingHeight){
            this.loading.spriteRect.x = 0;
            this.loading.spriteRect.y = 0;
        }
    }
}

class optionsMenu extends Menus {
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, menuType){
        super(background, canvasWidth, canvasHeight);
        this.type = menuType;
        this.volumeMusic;
        this.volumeSFX;
        this.initElements();
    }

    initElements(){
        this.returnButton = new GameObject(this.canvasWidth/10,this.canvasHeight/7, 150, 65, undefined, true, true);
        this.returnButton.setSprite('../Assets/Sprites/return_button.png');
        const offsetY = 30;
        this.sfxField = new GameObject(this.canvasWidth/2, 2*this.canvasHeight/4, 180, 80, 'on', undefined, undefined);
        this.soundField = new GameObject(this.canvasWidth/2, this.sfxField.y + this.sfxField.height + offsetY, 180, 80, 'on', undefined, undefined);
        this.sfxField.setSprite('../Assets/Sprites/sfx_on.png');
        this.soundField.setSprite('../Assets/Sprites/music_on.png');
        if(this.type === 'pause'){
            this.exitField = new GameObject(this.canvasWidth/2, this.soundField.y + this.soundField.height + offsetY, 180, 80, undefined, undefined, undefined);
            this.exitField.setSprite('../Assets/Sprites/exit_button.png');
        }
        canvas.addEventListener('mousemove', (e)=>{
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.returnButton.mouseCollition(mouseX, mouseY);
            this.sfxField.mouseCollition(mouseX, mouseY);
            this.soundField.mouseCollition(mouseX, mouseY);
        });

        canvas.addEventListener('click', (e) =>{
            if(this.returnButton.hovered){
                this.state = 0;
            }
            this.fieldChecker();
        });
    }

    draw(ctx){
        this.background.draw(ctx);
        this.sfxField.draw(ctx);
        this.soundField.draw(ctx);
        this.returnButton.draw(ctx);
        if(this.exitField){
            this.exitField.draw(ctx);
        }
    }

    update(deltaTime){}

    fieldChecker(){
        if(this.sfxField.hovered && this.sfxField.type === 'on'){
            this.sfxField.setSprite('../Assets/Sprites/sfx_off.png');
            this.sfxField.type = 'off';
        }
        else if(this.sfxField.hovered){
            this.sfxField.setSprite('../Assets/Sprites/sfx_on.png');
            this.sfxField.type = 'on';
        }
        if(this.soundField.hovered && this.soundField.type === 'on'){
            this.soundField.setSprite('../Assets/Sprites/music_off.png');
            this.soundField.type = 'off';
        }
        else if(this.soundField.hovered){
            this.soundField.setSprite('../Assets/Sprites/music_on.png');
            this.soundField.type = 'on';
        }
        if(this.exitField && this.exitField.hovered){
            this.state = 0;
        }
        if(this.returnButton.hovered){
            this.state = 0;
        }
    }
}

export {
    Menus,
    mainMenu,
    selectionMenu,
    creditScreen,
    archetypeMenu,
    lobbyScreen,
    battleScreen,
    loadingScreen,
    optionsMenu
};
