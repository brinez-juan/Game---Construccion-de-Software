import { attributes } from "./GlobalVariables"; 

class NPC extends Character {
    constructor(dialogue) {
        this.dialogue = dialogue;
    }
}

class Enemy extends Character {
    constructor(physicalDamage, magicDamage, isBoss) {
        this.physicalDamage = physicalDamage;
        this.magicDamage = magicDamage;
        this.isBoss = isBoss;
    }
}