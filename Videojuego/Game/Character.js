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
        // Combat juice: a transient horizontal draw offset for the lunge (when attacking)
        // and shake (when taking a hit). Driven by updateAnimation() each frame and applied
        // in draw(); it never touches this.x/this.y, so targeting, enemy spacing and
        // health-bar placement stay put.
        this.animOffsetX = 0;
        this._lungeTime = 0; this._lungeDuration = 0; this._lungeDir = 0; this._lungeDistance = 0;
        this._shakeTime = 0; this._shakeDuration = 0; this._shakeMagnitude = 0;
    }

    // Preloads the idle/attack/defend art into cached Images and shows the idle pose.
    // Preloading (vs GameObject.setSprite's per-swap `new Image()`) avoids the reload
    // flicker when poses change mid-combat; missing variants are simply absent from the
    // cache so playState() can fall back to idle.
    setSpriteStates({ idle, attack, defend, special } = {}) {
        this._spriteCache = {};
        for (const [state, path] of Object.entries({ idle, attack, defend, special })) {
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

    // Draws the current pose at its NATIVE aspect ratio instead of stretching it to the
    // fixed box. The box height (this.height) is the on-screen height every character shares;
    // the drawn width follows each sprite's own proportions, so a wide attack/lunge pose no
    // longer looks squished and a narrow character no longer looks "fat". The sprite is
    // anchored at its feet (the bottom of the logical box) so poses don't bob or shift
    // vertically when swapped. this.width/this.height stay the logical box used for targeting,
    // spacing and health-bar placement.
    draw(ctx) {
        if (!this.spriteImage) return;
        // Sprite-sheet cropping isn't aspect-correctable here; keep the base box-fill path.
        if (this.spriteRect) { super.draw(ctx); return; }

        const drawHeight = this.height * this.scale;
        const feetY = this.y + (this.height / 2) * this.scale;   // constant ground line
        const img = this.spriteImage;
        // Before the image loads naturalHeight is 0; fall back to the logical box so the
        // sprite doesn't vanish for the first frames.
        const drawWidth = img.naturalHeight
            ? drawHeight * (img.naturalWidth / img.naturalHeight)
            : this.width * this.scale;

        ctx.drawImage(img, (this.x + this.animOffsetX) - drawWidth / 2, feetY - drawHeight, drawWidth, drawHeight);
    }

    // Pokémon-style "step forward and back" when this character attacks. `direction` is the
    // sign of the lunge along x (+1 toward the right, -1 toward the left); the sprite eases
    // out to `distance` px and back to 0 over `duration` ms. Purely cosmetic (draw offset).
    lunge(direction = 1, distance = 45, duration = 280) {
        this._lungeDir = direction;
        this._lungeDistance = distance;
        this._lungeDuration = duration;
        this._lungeTime = duration;
    }

    // Pokémon-style hurt shake: a fast horizontal wobble that decays to nothing over
    // `duration` ms. Purely cosmetic (draw offset).
    shake(magnitude = 12, duration = 350) {
        this._shakeMagnitude = magnitude;
        this._shakeDuration = duration;
        this._shakeTime = duration;
    }

    // Advances the lunge/shake timers and recomputes the draw offset. Call every frame for
    // the player and every enemy (battleScreen drives this regardless of whose turn it is)
    // so the motion plays out smoothly.
    updateAnimation(deltaTime) {
        let offsetX = 0;
        if (this._lungeTime > 0) {
            this._lungeTime -= deltaTime;
            // elapsed 0 -> 1; sin(pi * elapsed) gives a single forward-and-back hop.
            const elapsed = 1 - Math.max(0, this._lungeTime) / this._lungeDuration;
            offsetX += this._lungeDir * this._lungeDistance * Math.sin(Math.PI * elapsed);
        }
        if (this._shakeTime > 0) {
            this._shakeTime -= deltaTime;
            const remaining = Math.max(0, this._shakeTime) / this._shakeDuration;  // 1 -> 0
            // Fast oscillation whose amplitude decays as the timer runs out.
            offsetX += Math.sin(this._shakeTime / 30) * this._shakeMagnitude * remaining;
        }
        this.animOffsetX = offsetX;
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
