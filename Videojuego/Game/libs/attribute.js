import textLabel from "./TextLabel.js";
import gameObject from "./GameObject.js";

//Class to spawn attributes in the battleLobby with it's respective buttons
export default class Attribute{
    constructor(posX, posY, size, attributeName, attributeValue){
        this.name = attributeName
        this.additionButton = new gameObject(posX, posY-7, size, size)
        this.additionButton.setSprite('../Assets/Sprites/addition_button.png')
        this.attributeLabel = new textLabel(posX - 120, posY, `${size}px Academia`, 'black', undefined, attributeName, false)
        // Value sits closer to the '+' button so long centered names (e.g. INTELLIGENCE) don't overlap it.
        this.attributeValueLabel = new textLabel(posX - 30, posY, `${size}px Academia`, 'black', undefined, attributeValue, false)
    }

    draw(ctx){
        this.additionButton.draw(ctx)
        this.attributeLabel.draw(ctx)
        this.attributeValueLabel.draw(ctx)
    }
}