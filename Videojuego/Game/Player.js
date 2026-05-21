import Character from "./Character.js";
import Bar from "./Bar.js";
import { MAX_DECK_SIZE } from "./GlobalVariables.js";
import { canvas } from "./Return.js";

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
        experienceToNextLevel = 100,
        inventory = [],
        activeDeck = []
    ) {
        super("Player", maxHealth, health, maxStamina, stamina, attributes, x, y, width, height);
        this.level = level;
        this.experience = experience;
        this.experienceToNextLevel = experienceToNextLevel;
        this.inventory = inventory;
        this.activeDeck = activeDeck;
        this.healthBar = new Bar(this.x, 20, 300, 20, '../Assets/Sprites/health_bar.png');
        this.staminaBar = new Bar(this.x, 50, 300, 20, '../Assets/Sprites/stamina_bar.png');
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

    deckMaker(activeDeck, positionX, positionY, cardWidth, cardHeight, offSetX){
        let cardWidth = 100
        let cardHeight = 150
        let offSetX = 15
        let posX = this.canvasWidth/2 - 2*(cardWidth + offSetX)
        let posY = 4*this.canvasHeight/5

        for(let card of activeDeck){
            let cardInstance = new ItemCard(posX, posY, cardWidth, cardHeight, card.name, card.description, card.image, card.staminaCost, card.isPermanent)
            cardInstance.setSprite(`../Assets/Sprites/${card.name}.png`)
            this.player.activeDeck.push(cardInstance)
            posX += cardWidth + offSetX
        }
    }
}
