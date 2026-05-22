import Menus from './Menus.js';
import Player from './Player.js';
import { Enemy } from './NonPlayableCharacter.js';
import ParryBar from './parryBar.js';
import ItemCard from './ItemCard.js';

export default class battleScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, playerData, enemies){
        super(background, canvasWidth, canvasHeight)
        this.enemies = []
        this.ParryBar = new ParryBar(this.canvasWidth, this.canvasHeight, playerData.stamina, playerData.maxStamina)
        this.playerMaker(playerData)
        this.player.deckMaker(playerData.activeDeck, this.canvasWidth/2, 4*this.canvasHeight/5, 100*0.75, 100, 15)
        this.enemyMaker(enemies)
        this.turn = 'player';
        this.cardInAction = null;
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
        if(this.turn === 'enemy' && !this.ParryBar.state){
            this.ParryBar.draw(ctx)
        }
    }
    addeventListeners(){
        addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            for(let card of this.player.deck){
                card.mouseCollition(mouseX, mouseY)
            }
            if(cardInAction){
                for(let enemy of this.enemies){
                    enemy.mouseCollition(mouseX, mouseY)
                }
            }
        })

        addEventListener('click', (e) => {
            if(!cardInAction){
                for(let card of this.player.deck){
                    if(card.hovered){
                        cardInAction = card
                        cardInAction.y += 15
                    }
                }   
            }
            else if(cardInAction){
                for(let card of this.player.deck){
                    if(card.hovered && card !== cardInAction){
                        cardInAction.y -= 15
                        cardInAction = card
                        cardInAction.y += 15
                    }
                }
                for(let enemy of this.enemies){
                    if(enemy.hovered){
                        let damageDone = cardInAction.action.calculateDamage(this.player.attributes)
                        enemy.health -= damageDone
                        enemy.healthBar.calculateCurrentIndicatorSubstraction(damageDone)
                        this.player.stamina -= cardInAction.staminaCost
                        cardInAction.y -= 15
                        cardInAction = null
                    }
                }
            }
        })
    }
    removeEventListeners(){
        removeEventListener('mousemove', this.mouseCollition);
        removeEventListener('click', this.mouseCollition);
    }
    update(deltaTime){
        if(this.turn === 'player'){
            addeventlisteners()
            for(let enemy of this.enemies){
                enemy.update(deltaTime)
            }
        }
        else if(this.turn === 'enemy'){
            this.removeEventListeners()    
        }
    }

    playerMaker(playerData){
        this.player = new Player(this.canvasWidth/5, this.canvasHeight/2 + 30, 120, 300, playerData.maxHealth, playerData.health, playerData.maxStamina, playerData.stamina, playerData.attributes, playerData.level, playerData.experience, playerData.experienceToNextLevel, playerData.inventory, playerData.activeDeck)
        this.player.setSprite('../Assets/Sprites/player.png')
    }
    enemyMaker(enemyData){
        if(enemyData.length > 1){
            let positionY = this.canvasHeight/2
            let positionX = this.canvasWidth/2
            let offSetX = 150
            let offSetY = 50
            for(let enemy of enemyData){
                let enemyInstance = new Enemy(positionX, positionY, 120, 300,enemy.name, enemy.health, enemy.maxHealth, enemy.stamina, enemy.maxStamina, enemy.attributes)
                this.enemies.push(enemyInstance)
                positionX += offSetX
                positionY += offSetY
            }
        }
        else{
            let enemyInstance = new Enemy(3*this.canvasWidth/4, this.player.y, 200, 300,enemyData[0].name, enemyData[0].health, enemyData[0].maxHealth, enemyData[0].stamina, enemyData[0].maxStamina, enemyData[0].attributes)
            this.enemies.push(enemyInstance)
        }
    }
}
