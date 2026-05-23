import Character from "./Character.js";
import { ACTION_TYPES } from "./GlobalVariables.js";
import Bar from "./Bar.js";
import GameObject from "./GameObject.js";

// Friendly character used to deliver scripted dialogue lines
export class NPC extends Character {
    constructor(name = "", dialogue = []) {
        super(name);
        this.dialogue = dialogue;
        this.dialogueIndex = 0;
    }

    getNextDialogue() {
        if (this.dialogueIndex >= this.dialogue.length) return "";
        return this.dialogue[this.dialogueIndex++];
    }

    resetDialogue() {
        this.dialogueIndex = 0;
    }
}

// Hostile combat entity with offensive and defensive stats plus AI decisions
export class Enemy extends Character {
    constructor(
        x = 0,
        y = 0,
        width = 100,
        height = 300,
        name = "",
        health = 100,
        maxHealth = health,
        stamina = 50,
        maxStamina = stamina,
        attributes = {},
        physicalDamage = 10,
        magicDamage = 10,
        physicalDefense = 5,
        magicDefense = 5,
        experienceReward = 50,
        cardReward = null,
        isBoss = false,
    ) {
        super(name, maxHealth, health, maxStamina, stamina, attributes, x, y, width, height);
        this.physicalDamage = physicalDamage;
        this.magicDamage = magicDamage;
        this.physicalDefense = physicalDefense;
        this.magicDefense = magicDefense;
        this.experienceReward = experienceReward;
        this.cardReward = cardReward;
        this.isBoss = isBoss;
        this.setSprite(`../Assets/Sprites/${name}.png`)
        this.healthBar = new Bar(this.x, this.y -this.height/2 - 20, this.width, 20, '../Assets/Sprites/health_bar.png', this.maxHealth);
        this.indicator = new GameObject(this.x, this.y - this.height/2 - 50, 30, 30);
        this.indicator.setSprite('')
    }

    removeEventListeners() {
        canvas.removeEventListener('mousemove', this.mouseCollition);
    }

    // Picks an action type based on the enemy health ratio and the player damage profile
    decideAction(player) {
        const healthRatio = this.health / this.maxHealth;

        // Detect dominant player damage type
        let playerType;
        if (player.physicalDamage > player.magicDamage) {
            playerType = "physical";
        } else if (player.magicDamage > player.physicalDamage) {
            playerType = "magic";
        } else {
            playerType = "balanced";
        }

        // Classify the enemy health state to bias the chosen behavior
        let state;
        if (healthRatio > 0.6) {
            state = "aggressive";
        } else if (healthRatio > 0.3) {
            state = "neutral";
        } else {
            state = "defensive";
        }

        // Build the list of actions this enemy is currently capable of
        const options = [];
        if (this.physicalDamage > 0) options.push(ACTION_TYPES.ATTACK_PHYSIC);
        if (this.magicDamage > 0) options.push(ACTION_TYPES.ATTACK_MAGIC);
        if (this.physicalDefense > 0) options.push(ACTION_TYPES.DEFEND_PHYSIC);
        if (this.magicDefense > 0) options.push(ACTION_TYPES.DEFEND_MAGIC);

        // Small random chance to pick any viable option to keep behavior unpredictable
        if (Math.random() < 0.2 && options.length > 0) {
            return options[Math.floor(Math.random() * (options.length-1))];
        }

        // DEFENSIVE STATE
        if (state === "defensive") {
            if (playerType === "physical" && this.physicalDefense > 0) {
                return ACTION_TYPES.DEFEND_PHYSIC;
            }
            if (playerType === "magic" && this.magicDefense > 0) {
                return ACTION_TYPES.DEFEND_MAGIC;
            }
        }

        // AGGRESSIVE STATE
        if (state === "aggressive") {
            if (this.physicalDamage > this.magicDamage && this.physicalDamage > 0) {
                return ACTION_TYPES.ATTACK_PHYSIC;
            }
            if (this.magicDamage > this.physicalDamage && this.magicDamage > 0) {
                return ACTION_TYPES.ATTACK_MAGIC;
            }
        }

        // NEUTRAL / BALANCED
        if (playerType === "physical") {
            return this.physicalDefense > 0
                ? ACTION_TYPES.DEFEND_PHYSIC
                : ACTION_TYPES.ATTACK_MAGIC;
        }

        if (playerType === "magic") {
            return this.magicDefense > 0
                ? ACTION_TYPES.DEFEND_MAGIC
                : ACTION_TYPES.ATTACK_PHYSIC;
        }

        // Fallback for balanced players where no clear counter exists
        return options[Math.floor(Math.random() * options.length)];
    }

    // Multiplies the reward yield when this enemy is a boss
    bossRewards() {
        if (this.isBoss) {
            this.experienceReward *= 3;
        }
    }
    
    update(deltaTime){
        if(this.hovered){
            this.indicator.setSprite('../Assets/Sprites/indicator.png')
        }
        else{
            this.indicator.setSprite('')

        }
    }
}
