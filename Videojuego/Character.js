import GameObject from "./gameObject.js";
import {BASE_ATTRIBUTES} from "./GlobalVariables";


export default class Character extends GameObject {
    constructor(
        name = "", 
        maxHealth = 100, 
        health = maxHealth, 
        maxStamina = 100, 
        stamina = maxStamina, 
        attributes = {...BASE_ATTRIBUTES},
        x = 0,
        y = 0,
        width = 0,
        height = 0
     ) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = health;
        this.maxStamina = maxStamina;
        this.stamina = stamina;
        this.attributes = {...BASE_ATTRIBUTES, ...attributes};
        super(x, y, width, height);
    }

    isAlive() {
        if (this.health > 0) {
            return true;
        } 
        else {
            return false;
        }  
    }

    takesDamage(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
    }

    spendStamina(amount) {
        this.stamina -= amount;
        if (this.stamina < 0) {
            this.stamina = 0;
        }
    }

    recoverStamina(amount) {
        this.stamina += amount;
        if (this.stamina > this.maxStamina) {
            this.stamina = this.maxStamina;
        }
    }

}