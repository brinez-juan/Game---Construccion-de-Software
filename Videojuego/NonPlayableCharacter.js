class NPC extends Character {
    
    constructor() {
        this.name = "";
        this.dialogue = "";
    }

    constructor(name, dialogue) {
        this.name = name;
        this.dialogue = dialogue;
    }
}

class enemy extends Character {

    constructor() {
        this.name = "";
        this.health = 0;
        this.damage = 0;
    }

    constructor(name, health, damage) {
        this.name = name;
        this.health = health;
        this.damage = damage;
    }
}