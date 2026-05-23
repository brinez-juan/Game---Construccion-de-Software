import Menus from './Menus.js';
import TextLabel from './TextLabel.js';

export default class successScreen extends Menus{
    constructor(canvasWidth = 0, canvasHeight = 0){
        super('', canvasWidth, canvasHeight)
        this.message = new TextLabel(canvasWidth/2, canvasHeight/2, '80px Academia', 'white', undefined, 'Success', false)
    }

    draw(ctx){
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.message.draw(ctx)
    }

    update(deltaTime){
    }
}
