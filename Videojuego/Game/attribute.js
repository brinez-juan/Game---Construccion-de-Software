import textLabel from "./textLabel.js";
import gameObject from "./GameObject.js";

export default class Attribute{
    constructor(posX, posY, size, attributeName, attributeValue, deck, inventory){
        this.posX = posX
        this.posY = posY
        this.size = size
        this.attributeName = attributeName
        this.attributeLabel = new textLabel(posX, posY, `${size}px Academia`, 'black', undefined, attributeName, false)
        this.attributeValueLabel = new textLabel(posX, posY, `${size}px Academia`, 'black', undefined, attributeValue, false)
    }
}