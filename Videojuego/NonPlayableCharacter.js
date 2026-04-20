import { Character } from "./Character.js";
import {BASE_ATTRIBUTES} from "./GlobalVariables";

export default class NPC extends Character {
    constructor(name = "", dialogue = []) {
        super(name);
        this.dialogue = dialogue;
        this.dialogueIndex = 0;
    }

    getNextDialogue() {
        if (this.dialogueIndex >= this.dialogues.length) return "";
        return this.dialogues[this.dialogueIndex++];
    }
 
    resetDialogue() {
        this.dialogueIndex = 0;
    }
}

export default class Enemy extends Character {
    constructor(
        name = "",
        health = 100, 
        stamina = 50,
        attributes = {...BASE_ATTRIBUTES},
        physicalDamage = 10, 
        magicDamage = 10, 
        physicalDefense = 5,
        magicDefense = 5, 
        experienceReward = 50,
        cardReward = null,
        isBoss = false
    ) {
        super(name, health, stamina, {...BASE_ATTRIBUTES, ...attributes}); 
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

        // =========================
        // DECISION MAKING
        // =========================

        if (Math.random() < 0.2) {
            return randomOption;
        }

        // DEFENSIVE STATE
        if (state === "defensive") {
            if (playerType === "physical" && this.physicalDefense > 0) {
                return ACTIONS.DEFEND_PHYSIC;
            }
            if (playerType === "magic" && this.magicDefense > 0) {
                return ACTIONS.DEFEND_MAGIC;
            }
        }

        // AGGRESSIVE STATE
        if (state === "aggressive") {
            if (this.physicalDamage > this.magicDamage && this.physicalDamage > 0) {
                return ACTIONS.ATTACK_PHYSIC;
            }
            if (this.magicDamage > this.physicalDamage && this.magicDamage > 0) {
                return ACTIONS.ATTACK_MAGIC;
            }
        }

        // NEUTRAL / BALANCED
        if (playerType === "physical") {
            return this.physicalDefense > 0 
                ? ACTIONS.DEFEND_PHYSIC
                : ACTIONS.ATTACK_MAGIC;
        }

        if (playerType === "magic") {
            return this.magicDefense > 0 
                ? ACTIONS.DEFEND_MAGIC 
                : ACTIONS.ATTACK_PHYSICAL;
        }

        // fallback (jugador balanceado)
        const options = [];

        if (this.physicalDamage > 0) options.push(ACTIONS.ATTACK_PHYSICAL);
        if (this.magicDamage > 0) options.push(ACTIONS.ATTACK_MAGIC);
        if (this.physicalDefense > 0) options.push(ACTIONS.DEFEND_PHYSICAL);
        if (this.magicDefense > 0) options.push(ACTIONS.DEFEND_MAGIC);

        return options[Math.floor(Math.random() * options.length)];
    }

    bossRewards(isBoss) {
        if (isBoss) {
            this.experienceReward *= 3;
        }
    }   
}