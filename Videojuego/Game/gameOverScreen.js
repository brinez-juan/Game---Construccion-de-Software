import Menus from './Menus.js';
import TextLabel from './TextLabel.js';

export default class gameOverScreen extends Menus{
    constructor(canvasWidth = 0, canvasHeight = 0){
        super('', canvasWidth, canvasHeight)
        this.message = new TextLabel(canvasWidth/2, canvasHeight/2, '80px Academia', 'red', undefined, 'Game Over', false)
    }

    draw(ctx){
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.message.draw(ctx)
    }

    update(deltaTime){
    }
}
