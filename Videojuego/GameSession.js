import Player from "./Player.js";
import ItemCard from "./ItemCard.js";
import Action from "./Action.js";
import { ARCHETYPES, CARD_LIBRARY, CARD_REQUIREMENTS, CARD_RARITY } from "./GlobalVariables.js";

function createCardFromId(id) {
    const def = CARD_LIBRARY[id];
    if (!def) return null;
    const action = new Action(
        def.name,
        def.description ?? "",
        def.actionType,
        def.staminaCost ?? 0,
        def.baseDamage ?? 0,
        def.baseDefense ?? 0,
        def.baseMagicDamage ?? 0,
        def.baseMagicDefense ?? 0,
        def.baseHealing ?? 0,
        def.scalingAttribute ?? "STRENGTH",
        def.scaleFactor ?? 1.0
    );
    return new ItemCard(
        def.name,
        def.description ?? "",
        null,
        action,
        CARD_REQUIREMENTS[id] ?? {},
        def.rarity ?? CARD_RARITY.COMMON,
        def.staminaCost ?? 0,
        false
    );
}

class GameSession {
    constructor() {
        this.player = null;
        this.archetypeId = null;
        this.activeSaveSlotId = null;
    }

    createPlayerForArchetype(archetypeId) {
        const archetype = ARCHETYPES[archetypeId];
        if (!archetype) return null;
        this.archetypeId = archetypeId;
        this.player = new Player();
        for (const key in archetype.attributes) {
            this.player.attributes[key] = archetype.attributes[key];
        }
        // VIGOR / ENDURANCE expand the pools at character creation.
        this.player.maxHealth = 100 + this.player.attributes.VIGOR * 10;
        this.player.health = this.player.maxHealth;
        this.player.maxStamina = 100 + this.player.attributes.ENDURANCE * 5;
        this.player.stamina = this.player.maxStamina;
        for (const cardId of archetype.startingCards) {
            const card = createCardFromId(cardId);
            if (card) this.player.addCardToInventory(card);
        }
        this.player.activeDeck = [];
        return this.player;
    }
}

export const gameSession = new GameSession();
export { createCardFromId };
