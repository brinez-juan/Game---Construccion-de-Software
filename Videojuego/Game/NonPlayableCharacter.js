import Character from "./Character.js";
import { ACTION_TYPES } from "./GlobalVariables.js";
import Bar from "./Bar.js";
import GameObject from "./GameObject.js";

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
        this.healthBar = new Bar(this.x, this.y -this.height/2 - 20, this.width, 20, '../Assets/Sprites/health_bar.png');
        this.indicator = new GameObject(this.x, this.y - this.height/2 - 50, 30, 30);
        this.indicator.setSprite('')
        this.addEventListeners();
    }

    addEventListeners() {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.mouseCollition(mouseX, mouseY)
        });
    }

    decideAction(player) {
        const healthRatio = this.health / this.maxHealth;

        // Detectar tipo dominante del jugador
        let playerType;
        if (player.physicalDamage > player.magicDamage) {
            playerType = "physical";
        } else if (player.magicDamage > player.physicalDamage) {
            playerType = "magic";
        } else {
            playerType = "balanced";
        }

        // Determinar estado de vida
        let state;
        if (healthRatio > 0.6) {
            state = "aggressive";
        } else if (healthRatio > 0.3) {
            state = "neutral";
        } else {
            state = "defensive";
        }

        // Opciones disponibles según stats
        const options = [];
        if (this.physicalDamage > 0) options.push(ACTION_TYPES.ATTACK_PHYSIC);
        if (this.magicDamage > 0) options.push(ACTION_TYPES.ATTACK_MAGIC);
        if (this.physicalDefense > 0) options.push(ACTION_TYPES.DEFEND_PHYSIC);
        if (this.magicDefense > 0) options.push(ACTION_TYPES.DEFEND_MAGIC);

        // 20% de probabilidad de tomar una acción aleatoria entre las viables
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

        // fallback (jugador balanceado)
        return options[Math.floor(Math.random() * options.length)];
    }

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
