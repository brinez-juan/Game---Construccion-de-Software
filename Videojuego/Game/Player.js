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
        // Derive the real max HP / stamina from the build so VIGOR and ENDURANCE
        // actually matter (the maxHealth/maxStamina args are now just defaults). Current
        // health/stamina are kept as-is mid-run, clamped to the freshly computed caps.
        this.maxHealth = 80 + 10 * (this.attributes.VIGOR ?? 0);
        this.maxStamina = 70 + 15 * (this.attributes.ENDURANCE ?? 0);
        this.health = Math.min(this.health, this.maxHealth);
        this.stamina = Math.min(this.stamina, this.maxStamina);
        this.level = level;
        this.experience = experience;
        this.experienceToNextLevel = experienceToNextLevel;
        this.inventory = [];
        this.deck = [];
        this.healthBar = new Bar(this.x, 20, 300, 20, '../Assets/Sprites/health_bar.png', this.maxHealth);
        this.staminaBar = new Bar(this.x, 50, 300, 20, '../Assets/Sprites/stamina_bar.png', this.maxStamina);
    }

    // Passive armor fed to the same armor curve enemies use (damage*K/(K+def)), so
    // attribute investment makes the player tankier between defends. VIGOR contributes
    // to both schools; STRENGTH/INTELLIGENCE to their matching school.
    get physicalDefense() {
        return (this.attributes.STRENGTH ?? 0) + Math.floor((this.attributes.VIGOR ?? 0) / 2);
    }

    get magicDefense() {
        return (this.attributes.INTELLIGENCE ?? 0) + Math.floor((this.attributes.VIGOR ?? 0) / 2);
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
            let action = new Action(card.name, card.description, card.action_type, card.stamina_cost, card.base_damage, 0,0,0,0, card.scales_with, card.scaling_factor, null, card.sfxPath)
            let cardInstance = new ItemCard(posX, positionY, cardWidth, cardHeight, card.name, card.description, action, card.required_value, card.rarity, card.stamina_cost, card.isPermanent)
            // Use the resolved fallback sprite (DB card names like "Heavy Strike" have
            // no matching art file, and drawing a broken image renders nothing).
            cardInstance.setSprite(card.spritePath ?? `../Assets/Sprites/cards/${card.name}.jpeg`)
            this.deck.push(cardInstance)
            posX += cardWidth + offSetX
        }
    }
}
