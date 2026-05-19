import GameObject from "./GameObject.js";
import { CARD_RARITY, ACTION_TYPES } from "./GlobalVariables.js";
import Action from "./Action.js";

export default class ItemCard extends GameObject {
    constructor(
        name = "",
        description = "",
        image = null,
        action = new Action(),
        requirements = {},
        rarity = CARD_RARITY.COMMON,
        staminaCost = 0,
        isPermanent = false
    ) {
        super();
        this.name = name;
        this.description = description;
        this.image = image;
        this.action = action;
        this.requirements = requirements;
        this.rarity = rarity;
        this.staminaCost = staminaCost;
        this.isPermanent = isPermanent;
    }

    meetsRequirements(playerAttributes = {}) {
        for (const [attr, minValue] of Object.entries(this.requirements)) {
            if ((playerAttributes[attr] ?? 0) < minValue) return false;
        }
        return true;
    }

    calculateEffect(playerAttributes = {}) {
        switch (this.action.actionType) {
            case ACTION_TYPES.ATTACK_PHYSIC:
                return this.action.calculateDamage(playerAttributes);
            case ACTION_TYPES.ATTACK_MAGIC:
                return this.action.calculateMagicDamage(playerAttributes);
            case ACTION_TYPES.DEFEND_PHYSIC:
                return this.action.calculateDefense(playerAttributes);
            case ACTION_TYPES.DEFEND_MAGIC:
                return this.action.calculateMagicDefense(playerAttributes);
            default:
                return 0;
        }
    }
}
