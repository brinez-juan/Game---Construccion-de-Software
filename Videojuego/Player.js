import { attributes } from "./GlobalVariables"; 

class Player extends Character {
    constructor(level, experience, inventory, activeDeck) {
        this.level = level;
        this.experience = experience;
        this.inventory = inventory;
        this.activeDeck = activeDeck;
    }
}