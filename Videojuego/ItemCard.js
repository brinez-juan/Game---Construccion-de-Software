import GameObject from "./GameObject";
import {BASE_ATTRIBUTES, CARD_RARITY, ACTION_TYPES} from "./GlobalVariables"; 
import Action from "./Action";

export default class ItemCard extends GameObject{

    constructor(
        name = "", 
        description = "", 
        image = null, 
        actions = new Action(), 
        requirements = {}, 
        rarity = CARD_RARITY.COMMON, 
        staminaCost = 0, 
        isPermanent = false
        
    ) {
        super();
        this.name = name;
        this.description = description;
        this.image = image;
        this.actions = actions;
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
        if (ACTION_TYPES.ATTACK_PHYSIC) {
            return this.Action.calculateDamage(playerAttributes);
        }
        else if (ACTION_TYPES.ATTACK_MAGIC) {
            return this.Action.calculateMagicDamage(playerAttributes);
        }
        else if (ACTION_TYPES.DEFEND_PHYSIC) {
            return this.Action.calculateDefense(playerAttributes);
        }
        else if (ACTION_TYPES.DEFEND_MAGIC) {
            return this.Action.calculateMagicDefense(playerAttributes);
        }
        else {
            return false;
        }
    }
}