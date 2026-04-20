import { ACTION_TYPES, BASE_ATTRIBUTES } from "./GlobalVariables";

export default class Action {
    constructor(
        name = "", 
        description = "", 
        actionType = ACTION_TYPES.ATTACK,
        staminaCost = 0, 
        baseDamage = 0, 
        baseDefense = 0,
        baseMagicDamage = 0,
        baseMagicDefense = 0,
        scalingAttribute = BASE_ATTRIBUTES.STRENGTH, 
        scaleFactor = 1.0,
        target = null
    ) {
        this.name = name;
        this.description = description;
        this.actionType = actionType;
        this.staminaCost = staminaCost;
        this.baseDamage = baseDamage;
        this.baseDefense = baseDefense;
        this.baseMagicDamage = baseMagicDamage;
        this.baseMagicDefense = baseMagicDefense;
        this.scalingAttribute = scalingAttribute;
        this.scaleFactor = scaleFactor;
        this.target = target;
    }

    calculateDamage(attributes = {}) {
        const attributeValue = attributes[this.scalingAttribute] ?? 0;
        return this.baseDamage + (attributeValue * this.scaleFactor);
    }

    calculateDefense(attributes = {}) {
        const attributeValue = attributes[this.scalingAttribute] ?? 0;
        return this.baseDefense + (attributeValue * this.scaleFactor);
    }

    calculateMagicDamage(attributes = {}) {
        const attributeValue = attributes[this.scalingAttribute] ?? 0;
        return this.baseMagicDamage + (attributeValue * this.scaleFactor);
    }

    calculateMagicDefense(attributes = {}) {
        const attributeValue = attributes[this.scalingAttribute] ?? 0;
        return this.baseMagicDefense + (attributeValue * this.scaleFactor);
    }
}