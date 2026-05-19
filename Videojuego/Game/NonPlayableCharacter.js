import Character from "./Character.js";
import { ACTION_TYPES } from "./GlobalVariables.js";

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
        name = "",
        health = 100,
        stamina = 50,
        attributes = {},
        physicalDamage = 10,
        magicDamage = 10,
        physicalDefense = 5,
        magicDefense = 5,
        experienceReward = 50,
        cardReward = null,
        isBoss = false
    ) {
        super(name, health, health, stamina, stamina, attributes);
        this.physicalDamage = physicalDamage;
        this.magicDamage = magicDamage;
        this.physicalDefense = physicalDefense;
        this.magicDefense = magicDefense;
        this.experienceReward = experienceReward;
        this.cardReward = cardReward;
        this.isBoss = isBoss;
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
            return options[Math.floor(Math.random() * options.length)];
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
}
