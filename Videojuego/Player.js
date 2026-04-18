import Character from "./Character.js";
import {BASE_ATTRIBUTES, MAX_DECK_SIZE} from "./GlobalVariables"; 

export default class Player extends Character {
    constructor(
        maxHealth = 100, 
        health = maxHealth,
        maxStamina = 100, 
        stamina = maxStamina,
        level = 1, 
        experience = 0, 
        experienceToNextLevel = 100,
        inventory = [], 
        activeDeck = []
    ) {
        this.level = level;
        this.experience = experience;
        this.experienceToNextLevel = experienceToNextLevel;
        this.inventory = inventory;
        this.activeDeck = activeDeck;
        super("Player", maxHealth, health, maxStamina, stamina, {...BASE_ATTRIBUTES});
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
        let upgradePoints = 0;
         if (levelUp()) {
            upgradePoints++;
            if (upgradePoints > 0) {
                this.attributes[attribute]++;
                upgradePoints--;
            }
        }
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
        this.xp = 0;
        this.level = 1;
        this.inventory = [];
        this.activeDeck = [];
    }
}

    

