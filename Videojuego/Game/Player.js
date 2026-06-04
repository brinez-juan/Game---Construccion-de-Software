import Character from "./Character.js";
import Bar from "./Bar.js";
import { MAX_DECK_SIZE } from "./GlobalVariables.js";
import { canvas } from "./Return.js";
import ItemCard from "./ItemCard.js";
import Action from "./Action.js";

// Player character with progression, inventory, active deck and battle HUD bars
export default class Player extends Character {
    constructor(
        x,
        y,
        width,
        height,
        maxHealth = 100,
        health = maxHealth,
        maxStamina = 100,
        stamina = maxStamina,
        attributes = {},
        level = 1,
        experience = 0,
        experienceToNextLevel = 100
    ) {
        super("Player", maxHealth, health, maxStamina, stamina, attributes, x, y, width, height);
        this.level = level;
        this.experience = experience;
        this.experienceToNextLevel = experienceToNextLevel;
        this.inventory = [];
        this.deck = [];
        this.healthBar = new Bar(this.x, 20, 300, 20, '../Assets/Sprites/health_bar.png', this.maxHealth);
        this.staminaBar = new Bar(this.x, 50, 300, 20, '../Assets/Sprites/stamina_bar.png', this.maxStamina);
    }

    gainExperience(amount) {
        this.experience += amount;
    }

    // Consumes experience to raise level and grows the next level threshold
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

    // Replaces the active deck after enforcing the maximum deck size
    setActiveDeck(selectedCards) {
        if (selectedCards.length > MAX_DECK_SIZE) return false;
        this.activeDeck = [...selectedCards];
        return true;
    }

    // Restores the player to base stats at the start of a new roguelite run
    resetRun() {
        this.health = this.maxHealth;
        this.stamina = this.maxStamina;
        this.experience = 0;
        this.level = 1;
        this.inventory = [];
        this.activeDeck = [];
    }

    // Builds renderable ItemCard instances from raw deck data and lays them in a row
    deckMaker(activeDeck, positionX, positionY, cardWidth, cardHeight, offSetX){
        
        let posX = positionX - 2 * (cardWidth + offSetX)
        for(let card of activeDeck){
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0, card.scales_with, card.scaling_factor, null)
            let cardInstance = new ItemCard(posX, positionY, cardWidth, cardHeight, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)
            // Use the resolved fallback sprite (DB card names like "Heavy Strike" have
            // no matching art file, and drawing a broken image renders nothing).
            cardInstance.setSprite(card.spritePath ?? `../Assets/Sprites/cards/${card.name}.jpeg`)
            this.deck.push(cardInstance)
            posX += cardWidth + offSetX
        }
    }
}
