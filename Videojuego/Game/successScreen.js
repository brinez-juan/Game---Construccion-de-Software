import Menus from './Menus.js';
import TextLabel from './TextLabel.js';
import { canvas } from './Return.js';

// End screen displayed when every enemy in the encounter is defeated. Clicking
// returns to the castle map (the room just cleared is marked complete by the
// screen manager before this screen is shown).
export default class successScreen extends Menus{
    constructor(canvasWidth = 0, canvasHeight = 0){
        super('', canvasWidth, canvasHeight)
        this.message = new TextLabel(canvasWidth/2, canvasHeight/2, '80px Academia', 'white', undefined, 'Success', false)
        this.prompt = new TextLabel(canvasWidth/2, canvasHeight/2 + 80, '28px Academia', 'white', undefined, 'Click to continue', false)
        this._click = this.handleClick.bind(this)
        canvas.addEventListener('click', this._click)
    }

    handleClick(e){
        this.dispose()
        this.state = 10   // back to the map
    }

    draw(ctx){
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.message.draw(ctx)
        this.prompt.draw(ctx)
    }

    update(deltaTime){
    }

    dispose(){
        canvas.removeEventListener('click', this._click)
    }
}
