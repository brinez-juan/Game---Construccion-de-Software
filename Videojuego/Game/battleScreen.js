import Menus from './Menus.js';

export default class battleScreen extends Menus{
    constructor(background = '', canvasWidth = 0, canvasHeight = 0, player, enemies){
        super(background, canvasWidth, canvasHeight)
        this.player = player; 
        this.enemies = enemies; 
        this.turn = 'player';
    }

    draw(ctx){
        this.background.draw(ctx)
        this.player.draw(ctx)
        this.player.healthBar.draw(ctx)
        this.player.staminaBar.draw(ctx)
    }

    update(deltaTime){

    }

}
