import GameObject from './GameObject.js';
import { canvas } from '../Return.js';
import textLabel from './TextLabel.js';

// Timing-based defensive minigame that grants damage and stamina based on press accuracy
export default class ParryBar{
    constructor(canvasWidth, CanvasHeight, stamina, maxStamina){
        this.stamina = stamina;
        this.maxStamina = maxStamina;
         let widthAdjuster = (this.stamina / this.maxStamina);
        this.perfectParryIndicator = new GameObject(canvasWidth/2, CanvasHeight/2, 60 * widthAdjuster, 30);
        this.normalParryIndicator = new GameObject(canvasWidth/2, CanvasHeight/2, 120 * widthAdjuster, 30);
        this.missParryIndicator = new GameObject(canvasWidth/2, CanvasHeight/2, 240, 30);
        this.perfectParryIndicator.setSprite('../Assets/Sprites/perfect_parry.png')
        this.normalParryIndicator.setSprite('../Assets/Sprites/normal_parry.png')
        this.missParryIndicator.setSprite('../Assets/Sprites/miss_parry.png')
        this.parryIcon = new GameObject(canvasWidth/2 - 120, CanvasHeight/2 + 45, 45, 45);
        this.parryIcon.setSprite('../Assets/Sprites/parry_icon.png')
        this.state = null;
        // Becomes true once the bar starts animating during the enemy turn (see update).
        // Gates clicks so ordinary clicks during the player's own turn (card selection)
        // don't prematurely resolve the parry.
        this.started = false;
        this.handleClick = this.handleClick.bind(this);
        canvas.addEventListener('click', this.handleClick);
    }

    // Triggers the parry check on left click, but only while the bar is live (animating
    // during the enemy turn) and hasn't resolved yet.
    handleClick(event) {
        if (this.started && !this.state) {
            this.checkState();
        }
    }

    // Removes the click listener so this bar stops reacting to input
    dispose() {
        canvas.removeEventListener('click', this.handleClick);
    }

    // Reduces or negates incoming damage according to the parry result
    calculateDamagePlayer(player, damageDone){
        if(this.state === 'perfect'){
            return 0
        }
        else if(this.state === 'normal'){
            return damageDone*0.35 ;
        }
        else{
            return damageDone;
        }
    }

    // Returns the stamina delta to apply after the parry attempt
    calculateStamina(player){
        // Refunds are intentionally small: sustained attacking now nets a stamina LOSS,
        // which (via widthAdjuster = stamina/maxStamina) shrinks the parry zones and
        // speeds the icon — so spamming an attack makes the next parry harder.
        if(this.state === 'perfect'){
            let thisStaminaReturn = this.maxStamina*0.1
            return thisStaminaReturn > this.maxStamina - this.stamina ? thisStaminaReturn - (this.maxStamina - this.stamina) : thisStaminaReturn;
        }
        else if(this.state === 'normal'){
            let thisStaminaReturn = this.maxStamina*0.04
            return thisStaminaReturn > this.maxStamina - this.stamina ? thisStaminaReturn - (this.maxStamina - this.stamina) : thisStaminaReturn;
        }
        else{
            let thisStaminaReturn = -this.maxStamina*0.12
            return thisStaminaReturn > this.stamina ? -this.stamina : thisStaminaReturn;
        }
    }

    draw(ctx){
        this.missParryIndicator.draw(ctx)
        this.normalParryIndicator.draw(ctx)
        this.perfectParryIndicator.draw(ctx)
        this.parryIcon.draw(ctx)
    }

    // Moves the parry icon across the bar at a speed modulated by stamina and dexterity
    update(deltaTime, playerDexterity = 0){
        // The bar is now live and accepting parry clicks.
        this.started = true;
        if(!this.state){
            this.parryIcon.x += (1*(this.maxStamina/this.stamina) - 0.01*playerDexterity)
        }
        if(this.parryIcon.x > this.missParryIndicator.x + this.missParryIndicator.width/2){
            this.state = 'miss'
            this.parryIcon.x = this.missParryIndicator.x + this.missParryIndicator.width/2
        }
    }

    // Resolves which parry zone the icon was in when the player pressed Space
    checkState(){
        if(this.perfectParryIndicator.xAxisCollition(this.parryIcon)){
            this.state = 'perfect'
        }
        else if(this.normalParryIndicator.xAxisCollition(this.parryIcon)){
            this.state = 'normal'
        }
        else if(this.missParryIndicator.xAxisCollition(this.parryIcon)){
            this.state = 'miss'
        }
    }
}