class Player extends GameObject {
    
    constructor() {
        this.name = "";
        this.health = 0;
        this.stamina = 0;
    }
    
    constructor(name, health, stamina) {
        this.name = name;
        this.health = health;
        this.stamina = stamina;
    }
}