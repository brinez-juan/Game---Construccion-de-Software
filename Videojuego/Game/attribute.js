import textLabel from "./textLabel.js";
import gameObject from "./GameObject.js";

export default class Attribute{
    constructor(posX, posY, size, attributeName, attributeValue){
        this.name = attributeName
        this.additionButton = new gameObject(posX, posY-7, size, size)
        this.additionButton.setSprite('../Assets/Sprites/addition_button.png')
        this.attributeLabel = new textLabel(posX - 120, posY, `${size}px Academia`, 'black', undefined, attributeName, false)
        this.attributeValueLabel = new textLabel(posX - 50, posY, `${size}px Academia`, 'black', undefined, attributeValue, false)
    }

    draw(ctx){
        this.additionButton.draw(ctx)
        this.attributeLabel.draw(ctx)
        this.attributeValueLabel.draw(ctx)
    }
}