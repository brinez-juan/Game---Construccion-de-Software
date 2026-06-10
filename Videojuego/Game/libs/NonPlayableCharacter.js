import Character from "./Character.js";
import { ACTION_TYPES } from "./GlobalVariables.js";
import Bar from "./Bar.js";
import GameObject from "./GameObject.js";

// Per-turn probability that a boss (isBoss) throws its special attack instead of a normal action.
const SPECIAL_ATTACK_CHANCE = 0.25;

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
        // Active typed guard from a defend action ('physic' | 'magic' | null). Boosts the
        // matching defense for the player's next turn; shattered by a wrong-type attack.
        this.guardType = null;
        // The real art is set right after construction by battleScreen.makeEnemy
        // (setSpriteStates / setSprite from the DB-resolved paths), so no sprite is
        // loaded from the display name here (it would 404 on the spaced filename).
        this.healthBar = new Bar(this.x, this.y -this.height/2 - 20, this.width, 20, '../Assets/Sprites/health_bar.png', this.maxHealth);
        this.indicator = new GameObject(this.x, this.y - this.height/2 - 50, 30, 30);
        this.indicator.setSprite('')
    }

    //Removes mouse listener for when user clicks over an enemy to avoid any unusual errors
    removeEventListeners() {
        canvas.removeEventListener('mousemove', this.mouseCollition);
    }

    // Picks an action type based on the enemy health ratio and the player damage profile
    decideAction(player) {
        // Bosses have a chance each turn to unleash a special attack instead of acting
        // normally. The special's damage is computed by battleScreen (half the player's
        // health) and it plays the boss's dedicated _special pose.
        if (this.isBoss && Math.random() < SPECIAL_ATTACK_CHANCE) {
            return ACTION_TYPES.ATTACK_SPECIAL;
        }

        const healthRatio = this.health / this.maxHealth;

        // Detect the player's threat type from their build: a STRENGTH-leaning character is a
        // physical threat, an INTELLIGENCE-leaning one is a magic threat (player has no direct
        // physical/magic damage stat). Equal/zero reads as balanced.
        const str = player.attributes?.STRENGTH ?? 0;
        const int = player.attributes?.INTELLIGENCE ?? 0;
        let playerType;
        if (str > int) {
            playerType = "physical";
        } else if (int > str) {
            playerType = "magic";
        } else {
            playerType = "balanced";
        }

        // The attack this enemy throws. A pure physical/magical enemy uses its only school;
        // a HYBRID (both schools > 0) picks one at random each turn so the player can't
        // safely pre-commit a single-school defend against it — that's the "make you think".
        let attack = null;
        if (this.physicalDamage > 0 && this.magicDamage > 0) {
            attack = Math.random() < 0.5 ? ACTION_TYPES.ATTACK_MAGIC : ACTION_TYPES.ATTACK_PHYSIC;
        } else if (this.magicDamage > 0) {
            attack = ACTION_TYPES.ATTACK_MAGIC;
        } else if (this.physicalDamage > 0) {
            attack = ACTION_TYPES.ATTACK_PHYSIC;
        }

        // The defense that best counters the player's school. Against a balanced player (or when
        // the matching defense stat is missing) fall back to whichever defense the enemy has.
        let defend = null;
        if (playerType === "physical" && this.physicalDefense > 0) defend = ACTION_TYPES.DEFEND_PHYSIC;
        else if (playerType === "magic" && this.magicDefense > 0) defend = ACTION_TYPES.DEFEND_MAGIC;
        else if (this.physicalDefense > 0) defend = ACTION_TYPES.DEFEND_PHYSIC;
        else if (this.magicDefense > 0) defend = ACTION_TYPES.DEFEND_MAGIC;

        // Chance of defending (vs attacking) by health state. Low HP leans defensive but is no
        // longer a guaranteed turtle: the player can still close out the fight, and the enemy
        // keeps attacking often enough that there's always a parry to recover stamina on.
        let defendChance;
        if (healthRatio > 0.6) {
            defendChance = 0.15;   // healthy: mostly presses the attack
        } else if (healthRatio > 0.3) {
            defendChance = 0.5;    // balanced: 50/50 defend vs attack
        } else {
            defendChance = 0.65;   // low HP: defends 65% of the time
        }

        // Roll defend vs attack, falling back to whatever the enemy can actually do.
        const wantDefend = Math.random() < defendChance;
        if (wantDefend && defend) return defend;
        if (!wantDefend && attack) return attack;
        return attack ?? defend ?? ACTION_TYPES.ATTACK_PHYSIC;
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
