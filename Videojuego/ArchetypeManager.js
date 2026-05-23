import { ARCHETYPES } from "./GlobalVariables.js";

// Applies an archetype loadout to the player and persists the choice on the backend
export default class ArchetypeManager {
    constructor(player, db, cinematicController) {
        this.player = player;
        this.db = db;
        this.cinematicController = cinematicController || {};
    }

    // Entry point that wires attribute injection, card hydration, persistence and intro playback
    async onArchetypeSelected(archetypeId, saveSlotId) {
        var archetype = ARCHETYPES[archetypeId];
        if (!archetype) {
            console.log("invalid archetype");
            return;
        }
        this._mergeAttributes(archetype.attributes);
        await this._fetchStartingCards(archetype.startingCards);
        await this.db.saveArchetype(saveSlotId, archetypeId);
        if (this.cinematicController.play) {
            this.cinematicController.play("intro");
        }
    }

    _mergeAttributes(attributes) {
        for (var key in attributes) {
            this.player.attributes[key] = attributes[key];
        }
    }

    async _fetchStartingCards(cardIds) {
        for (var i = 0; i < cardIds.length; i++) {
            var card = await this.db.fetchCardById(cardIds[i]);
            if (card) {
                this.player.addCardToInventory(card);
            }
        }
    }
}
