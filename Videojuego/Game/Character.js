import GameObject from "./GameObject.js";
import { BASE_ATTRIBUTES } from "./GlobalVariables.js";


// Base class for any living entity in the game with health, stamina and attributes
export default class Character extends GameObject {
    constructor(
        name = "",
        maxHealth = 100,
        health = maxHealth,
        maxStamina = 100,
        stamina = maxStamina,
        attributes = {},
        x = 0,
        y = 0,
        width = 0,
        height = 0
    ) {
        super(x, y, width, height);
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = health;
        this.maxStamina = maxStamina;
        this.stamina = stamina;
        this.attributes = { ...BASE_ATTRIBUTES, ...attributes };
    }

    isAlive() {
        return this.health > 0;
    }

    // Applies incoming damage and clamps health at zero
    takesDamage(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
    }

    // Subtracts stamina without falling below zero
    spendStamina(amount) {
        this.stamina -= amount;
        if (this.stamina < 0) {
            this.stamina = 0;
        }
    }

    // Adds stamina without exceeding the cap
    recoverStamina(amount) {
        this.stamina += amount;
        if (this.stamina > this.maxStamina) {
            this.stamina = this.maxStamina;
        }
    }
}
