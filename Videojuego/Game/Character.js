import GameObject from "./GameObject.js";
import { BASE_ATTRIBUTES } from "./GlobalVariables.js";


// Base class for any living entity in the game with health, stamina and attributes
export default class Character extends GameObject {
    constructor(
        name = "",
        maxHealth = 100,
        health = maxHealth,
        maxStamina = 100,
        stamina = maxStamina,
        attributes = {},
        x = 0,
        y = 0,
        width = 0,
        height = 0
    ) {
        super(x, y, width, height);
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = health;
        this.maxStamina = maxStamina;
        this.stamina = stamina;
        this.attributes = { ...BASE_ATTRIBUTES, ...attributes };
        // Combat pose state: idle by default, swapped to attack/defend during actions.
        this.spriteState = 'idle';
        this._spriteCache = {};
    }

    // Preloads the idle/attack/defend art into cached Images and shows the idle pose.
    // Preloading (vs GameObject.setSprite's per-swap `new Image()`) avoids the reload
    // flicker when poses change mid-combat; missing variants are simply absent from the
    // cache so playState() can fall back to idle.
    setSpriteStates({ idle, attack, defend } = {}) {
        this._spriteCache = {};
        for (const [state, path] of Object.entries({ idle, attack, defend })) {
            if (!path) continue;
            const img = new Image();
            // A derived pose path may point at art that doesn't ship (e.g. an enemy with
            // only an idle sheet). Drop it from the cache on load failure so playState()
            // falls back to idle instead of rendering a broken image; if the broken pose
            // is somehow already on screen, snap back to idle.
            img.onerror = () => {
                delete this._spriteCache[state];
                if (this.spriteImage === img) this.playState('idle');
            };
            img.src = path;
            this._spriteCache[state] = img;
        }
        this.spriteState = 'idle';
        if (this._spriteCache.idle) this.spriteImage = this._spriteCache.idle;
    }

    // Swaps the rendered sprite to a pose, falling back to idle when that pose has no
    // art (e.g. an enemy with only an idle sheet, or an unmapped state).
    playState(state) {
        const img = this._spriteCache[state] ?? this._spriteCache.idle;
        if (!img) return;
        this.spriteImage = img;
        this.spriteState = this._spriteCache[state] ? state : 'idle';
    }

    isAlive() {
        return this.health > 0;
    }

    // Applies incoming damage and clamps health at zero
    takesDamage(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
    }

    // Subtracts stamina without falling below zero
    spendStamina(amount) {
        this.stamina -= amount;
        if (this.stamina < 0) {
            this.stamina = 0;
        }
    }

    // Adds stamina without exceeding the cap
    recoverStamina(amount) {
        this.stamina += amount;
        if (this.stamina > this.maxStamina) {
            this.stamina = this.maxStamina;
        }
    }
}
