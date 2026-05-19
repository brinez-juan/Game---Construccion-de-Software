import { ATTRIBUTE_SCALING, CARD_REQUIREMENTS } from "./GlobalVariables.js";

export default class AttributeSystem {
    calculateScaledEffect(card, playerAttributes) {
        return card.calculateEffect(playerAttributes);
    }

    getCardsScalingWith(inventory, attributeName) {
        return inventory.filter(card => card.action.scalingAttribute == attributeName);
    }

    classifyCards(inventory, playerAttributes) {
        const available = [];
        const locked = [];
        for (const card of inventory) {
            if (card.meetsRequirements(playerAttributes)) {
                available.push(card);
            } else {
                locked.push(card);
            }
        }
        return { available, locked };
    }

    recalculateCardsForAttribute(changedAttribute, inventory, playerAttributes) {
        const result = new Map();
        const cards = this.getCardsScalingWith(inventory, changedAttribute);
        for (const card of cards) {
            result.set(card.name, this.calculateScaledEffect(card, playerAttributes));
        }
        return result;
    }

    applyStatBonuses(player, attr) {
        if (attr == "VIGOR") {
            player.maxHealth += 10;
            player.health += 10;
        }
        if (attr == "ENDURANCE") {
            player.maxStamina += 5;
            player.stamina += 5;
        }
    }
}
