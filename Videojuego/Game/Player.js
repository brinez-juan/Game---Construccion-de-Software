import Character from "./Character.js";
import Bar from "./Bar.js";
import { MAX_DECK_SIZE } from "./GlobalVariables.js";
import { canvas } from "./Return.js";

export default class Player extends Character {
    constructor(
        maxHealth = 100,
        health = maxHealth,
        maxStamina = 100,
        stamina = maxStamina,
        attributes = {},
        level = 1,
        experience = 0,
        experienceToNextLevel = 100,
        inventory = [],
        activeDeck = []
    ) {
        super("Player", maxHealth, health, maxStamina, stamina, attributes);
        this.level = level;
        this.experience = experience;
        this.experienceToNextLevel = experienceToNextLevel;
        this.inventory = inventory;
        this.activeDeck = activeDeck;
        this.healthBar = new Bar(canvas.width/4, 20, 200, 20, '../Assets/Sprites/health_bar.png');
        this.staminaBar = new Bar(canvas.width/4, 50, 200, 20, '../Assets/Sprites/stamina_bar.png');
    }

    gainExperience(amount) {
        this.experience += amount;
    }

    levelUp() {
        if (this.experience >= this.experienceToNextLevel) {
            this.experience -= this.experienceToNextLevel;
            this.level++;
            this.experienceToNextLevel = this.experienceToNextLevel * 1.5;
            return true;
        }
        return false;
    }

    upgradeAttribute(attribute) {
        if (this.levelUp()) {
            this.attributes[attribute]++;
            return true;
        }
        return false;
    }

    addCardToInventory(card) {
        this.inventory.push(card);
    }

    setActiveDeck(selectedCards) {
        if (selectedCards.length > MAX_DECK_SIZE) return false;
        this.activeDeck = [...selectedCards];
        return true;
    }

    resetRun() {
        this.health = this.maxHealth;
        this.stamina = this.maxStamina;
        this.experience = 0;
        this.level = 1;
        this.inventory = [];
        this.activeDeck = [];
    }
}
