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
        this.enemyMaker(enemies)
        this.turn = 'player';
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
        if(this.turn === 'enemy'){
            this.ParryBar.draw(ctx)
        }
    }

    update(deltaTime){
        if(this.turn === 'player'){
            for(let enemy of this.enemies){
                enemy.update(deltaTime)
            }
        }
        else if(this.turn === 'enemy'){
            this.ParryBar.update(deltaTime)
            }
        }

    playerMaker(playerData){
        this.player = new Player(this.canvasWidth/5, 2*this.canvasHeight/3, 100, 300, playerData.maxHealth, playerData.health, playerData.maxStamina, playerData.stamina, playerData.attributes, playerData.level, playerData.experience, playerData.experienceToNextLevel, playerData.inventory, playerData.activeDeck)
        this.player.setSprite('../Assets/Sprites/player.png')
        }
    enemyMaker(enemyData){
        const count = Math.floor(1 + Math.random() * 3);
        if(enemyData.length > 1){
            let positionY = this.canvasHeight/2
            let positionX = 2*this.canvasWidth/3
            let offSetX = 100
            let offSetY = 50
            for(let i=0;i<count; i++){
            let randomIndex = Math.floor(Math.random() * (enemyData.length - 1));
                let enemyInstance = new Enemy(positionX, positionY, 100, 300,enemy.name, enemy.health, enemy.maxHealth, enemy.stamina, enemy.maxStamina, enemy.attributes)
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
