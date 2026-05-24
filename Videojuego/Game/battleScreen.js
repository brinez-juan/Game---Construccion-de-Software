import Menus from './Menus.js';
import Player from './Player.js';
import { Enemy } from './NonPlayableCharacter.js';
import ParryBar from './parryBar.js';
import ItemCard from './ItemCard.js';
import {canvas} from './Return.js';

// Main combat scene that orchestrates player turn, enemy turn, parry timing and end conditions
export default class battleScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, playerData, enemies){
        super(background, canvasWidth, canvasHeight)
        this.enemies = []
        this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, playerData.stamina, playerData.maxStamina)
        this.playerMaker(playerData)
        this.player.deckMaker(playerData.activeDeck, this.canvasWidth/2, 4*this.canvasHeight/5, 100*0.75, 100, 15)
        this.enemyMaker(enemies)
        this.turn = 'player';
        this.cardInAction = undefined;
        this.enemyAttacking = undefined;
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.listenersActive = false
        this.currentEnemyIndex = 0;
        this.playerDefending = false;
    }

    // Routes cursor movement to deck cards and to enemies during the targeting phase
    handleMouseMove(e){
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        for(let card of this.player.deck){
            card.mouseCollition(mouseX, mouseY)
        }
        if(this.cardInAction){
            for(let enemy of this.enemies){
                enemy.mouseCollition(mouseX, mouseY)
            }
        }
    }

    // Handles card selection, target picking and stamina spending during the player turn
    handleClick(e){
        if(!this.cardInAction){
            for(let card of this.player.deck){
                if(card.hovered){
                    if(card.action.actionType === 'defend_physic' || card.action.actionType === 'defend_magic'){
                        this.playerDefending = true;
                        this.player.stamina = this.player.stamina - card.staminaCost > 0 ? this.player.stamina - card.staminaCost : 0
                        this.player.staminaBar.calculateCurrentIndicatorSubstraction(card.staminaCost)
                        this.turn = 'enemy'
                        return
                    }
                    else if(card.action.actionType === 'aoe_magic' || card.action.actionType === 'aoe_physic'){
                        let damageDone = card.action.calculateDamage(this.player.attributes)
                        for(let enemy of this.enemies){
                            enemy.health -= damageDone
                            enemy.healthBar.calculateCurrentIndicatorSubstraction(damageDone)
                        }
                        this.player.stamina = this.player.stamina - card.staminaCost > 0 ? this.player.stamina - card.staminaCost : 0
                        this.player.staminaBar.calculateCurrentIndicatorSubstraction(card.staminaCost)
                        this.turn = 'enemy'
                        return
                    }
                    else{
                        this.cardInAction = card
                        this.cardInAction.y -= 15
                        return
                    }
                }
            }
            return
        }

        for(let card of this.player.deck){
            if(card.hovered && card !== this.cardInAction){
                this.cardInAction.y += 15
                this.cardInAction = card
                this.cardInAction.y -= 15
            }
        }

        for(let enemy of this.enemies){
            if(enemy.hovered){
                let damageDone = this.cardInAction.action.calculateDamage(this.player.attributes)
                enemy.health -= damageDone
                enemy.healthBar.calculateCurrentIndicatorSubstraction(damageDone)
                this.player.stamina = this.player.stamina - this.cardInAction.staminaCost > 0 ? this.player.stamina - this.cardInAction.staminaCost : 0
                this.player.staminaBar.calculateCurrentIndicatorSubstraction(this.cardInAction.staminaCost)
                console.log(this.player.staminaBar.missingAttributeBar.width)
                this.cardInAction.y += 15
                this.cardInAction = null
                this.turn = 'enemy'
                return
            }
        }
    }

    draw(ctx){
        this.background.draw(ctx)
        this.player.draw(ctx)
        this.player.healthBar.draw(ctx)
        this.player.staminaBar.draw(ctx)
        for(let enemy of this.enemies){
           enemy.draw(ctx)
            enemy.healthBar.draw(ctx)
            enemy.indicator.draw(ctx)
        }
        for(let card of this.player.deck){
            card.draw(ctx)
        }
        if(this.turn === 'enemy'){
            if(!this.ParryBar.state){
                this.ParryBar.draw(ctx)
            }
        }
    }
    addEventListeners(){
        if(this.listenersActive) return
        canvas.addEventListener('mousemove', this.handleMouseMove)
        canvas.addEventListener('click', this.handleClick)
        this.listenersActive = true
    }

    removeEventListeners(){
        if(!this.listenersActive) return
        canvas.removeEventListener('mousemove', this.handleMouseMove)
        canvas.removeEventListener('click', this.handleClick)
        this.listenersActive = false
    }
    // Per-frame loop that detects end conditions and advances either the player or the enemy turn
    update(deltaTime){
        if(this.player.health <= 0){
            this.removeEventListeners()
            this.state = 7
            return
        }
        if(this.enemies.every(enemy => enemy.health <= 0)){
            this.removeEventListeners()
            this.state = 8
            return
        }
        if(this.turn === 'player'){
            this.addEventListeners()
            for(let enemy of this.enemies){
                enemy.update(deltaTime)
            }
        }
        else if(this.turn === 'enemy'){
            this.removeEventListeners()
            this.checkEnemyStatus()
            this.ParryBar.stamina = this.player.stamina
            this.ParryBar.maxStamina = this.player.maxStamina
            if(!this.ParryBar.state){
                this.ParryBar.update(deltaTime, this.player.attributes.dexterity)
            }
            else{
                this.enemyTurn()
            }
        }
    }

    checkEnemyStatus(){
        this.enemies = this.enemies.filter(enemy => enemy.health > 0)
    }

    // Resolves one enemy attack per call by combining AI decision, parry result and stat changes
    enemyTurn(){
        if(this.currentEnemyIndex < this.enemies.length){
            this.enemyAttacking = this.enemies[this.currentEnemyIndex]
            let enemyDecision = this.enemyAttacking.decideAction(this.player)
            let damageDone = 0;
            if(enemyDecision === 'attack_physic'){
                damageDone = this.enemyAttacking.physicalDamage
            }
            else if(enemyDecision === 'attack_magic'){
                damageDone = this.enemyAttacking.magicDamage
            }
            else if(enemyDecision === 'defend_physic'){
                damageDone = 0
                this.enemyAttacking.physicalDefense += 5
            }
            else if(enemyDecision === 'defend_magic'){
                damageDone = 0
                this.enemyAttacking.magicDefense += 5
            }

            if(damageDone > 0){
                if(this.playerDefending){
                    this.ParryBar.state = 'perfect'
                    this.playerDefending = false;
                }
                const finalDamage = this.ParryBar.calculateDamagePlayer(this.player, damageDone)
                if(finalDamage > 0){
                    this.player.health -= finalDamage
                    this.player.healthBar.calculateCurrentIndicatorSubstraction(finalDamage)
                }
                const staminaChange = this.ParryBar.calculateStamina(this.player)
                if(staminaChange > 0){
                    this.player.stamina = this.player.stamina + staminaChange > this.player.maxStamina ? this.player.maxStamina : this.player.stamina + staminaChange
                    this.player.staminaBar.calculateCurrentIndicatorAddition(staminaChange)
                } else if(staminaChange < 0){
                    this.player.stamina = this.player.stamina - Math.abs(staminaChange) < 0? 0 : this.player.stamina - Math.abs(staminaChange)
                    this.player.staminaBar.calculateCurrentIndicatorSubstraction(Math.abs(staminaChange))
                }
                this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, this.player.stamina, this.player.maxStamina)
            }

            this.currentEnemyIndex++
        }
        else{
            this.currentEnemyIndex = 0
            this.turn = 'player'
        }
    }

    playerMaker(playerData){
        this.player = new Player(this.canvasWidth/5, this.canvasHeight/2 + 30, 120, 300, playerData.maxHealth, playerData.health, playerData.maxStamina, playerData.stamina, playerData.attributes, playerData.level, playerData.experience, playerData.experienceToNextLevel, playerData.inventory, playerData.activeDeck)
        this.player.setSprite('../Assets/Sprites/player.png')
    }

    // Instantiates Enemy objects from raw pool data and lays them out on the canvas
    enemyMaker(enemyData){
        let count = Math.floor(1 + Math.random() * 2);
        if(count > 1){
            let positionY = this.canvasHeight/2
            let positionX = this.canvasWidth/2
            let offSetX = 150
            let offSetY = 50
            for(let i = 0; i < count; i++){
                let enemyIndex = Math.floor(Math.random() * (enemyData.length-1))
                let enemyInstance = new Enemy(positionX, positionY, 120, 300,enemyData[enemyIndex].name, enemyData[enemyIndex].health, enemyData[enemyIndex].maxHealth, enemyData[enemyIndex].stamina, enemyData[enemyIndex].maxStamina, enemyData[enemyIndex].attributes)
                console.log(enemyInstance)
                this.enemies.push(enemyInstance)
                positionX += offSetX
                positionY += offSetY
            }
        }
        else{
            let enemyIndex = Math.floor(Math.random() * (enemyData.length-1))
            let enemyInstance = new Enemy(3*this.canvasWidth/4, this.player.y, 200, 300,enemyData[0].name, enemyData[0].health, enemyData[0].maxHealth, enemyData[0].stamina, enemyData[0].maxStamina, enemyData[0].attributes)
            this.enemies.push(enemyInstance)
        }
    }

}
