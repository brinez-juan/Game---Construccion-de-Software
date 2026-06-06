// Master toggle for background music (used by MusicManager and optionsMenu)
export let musicEnabled = true;

// Default attribute keys assigned to every Character at creation time
export const BASE_ATTRIBUTES = {
    STRENGTH: 0, 
    DEXTERITY: 0, 
    INTELLIGENCE: 0, 
    VIGOR: 0, 
    ENDURANCE: 0
};

// String identifiers used by Action and ItemCard to route effect calculations
export const ACTION_TYPES = {
    ATTACK_PHYSIC: "attack_physic",
    ATTACK_MAGIC: "attack_magic",
    DEFEND_PHYSIC: "defend_physic",
    DEFEND_MAGIC: "defend_magic",
    HEALING: "healing",
    AOE_PHYSIC: "aoe_physic",
    AOE_MAGIC: "aoe_magic"
}


// Rarity tiers used to bias card drop probabilities
export const CARD_RARITY = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    EPIC: "epic",
    LEGENDARY: "legendary"
}


// Possible outcomes returned by the ParryBar timing check
export const PARRY_RESULTS = {
    PERFECT: "perfect",
    NORMAL: "normal",
    POOR: "poor",
}

// Maximum number of cards the player can carry in the active deck
export const MAX_DECK_SIZE = 5;

// Starter loadouts offered during character creation
export const ARCHETYPES = {
    SOLDIER: {
        id: "soldier",
        attributes: { STRENGTH: 3, DEXTERITY: 1, INTELLIGENCE: 0, VIGOR: 2, ENDURANCE: 2 },
        startingCards: ["heavy_strike", "shield_block", "basic_attack", "basic_attack", "recover"]
    },
    ARCHER: {
        id: "archer",
        attributes: { STRENGTH: 1, DEXTERITY: 3, INTELLIGENCE: 0, VIGOR: 1, ENDURANCE: 2 },
        startingCards: ["precise_shot", "dodge_roll", "basic_attack", "basic_attack", "recover"]
    },
    MAGE: {
        id: "mage",
        attributes: { STRENGTH: 0, DEXTERITY: 1, INTELLIGENCE: 3, VIGOR: 1, ENDURANCE: 2 },
        startingCards: ["fireball", "magic_shield", "basic_attack", "basic_attack", "recover"]
    }
};

// Mapping of attribute keys to the action types they amplify
export const ATTRIBUTE_SCALING = {
    STRENGTH: [ACTION_TYPES.ATTACK_PHYSIC, ACTION_TYPES.DEFEND_PHYSIC, ACTION_TYPES.AOE_MAGIC],
    INTELLIGENCE: [ACTION_TYPES.ATTACK_MAGIC, ACTION_TYPES.DEFEND_MAGIC, ACTION_TYPES.AOE_MAGIC],
    DEXTERITY: [],
    VIGOR: [ACTION_TYPES.HEALING],
    ENDURANCE: []
};

// Minimum attribute thresholds required to equip each card id
export const CARD_REQUIREMENTS = {
    heavy_strike: { STRENGTH: 3 },
    precise_shot: { DEXTERITY: 3 },
    fireball: { INTELLIGENCE: 3 },
    shield_block: { STRENGTH: 2 },
    dodge_roll: { DEXTERITY: 2 },
    magic_shield: { INTELLIGENCE: 2 }
};

// Static catalog of every card available to spawn, used as the in-memory data source
export const CARD_LIBRARY = {
    basic_attack: {
        name: "Basic Attack",
        description: "A simple physical strike.",
        actionType: ACTION_TYPES.ATTACK_PHYSIC,
        staminaCost: 15,
        baseDamage: 10,
        scalingAttribute: "STRENGTH",
        scaleFactor: 1.0,
        rarity: CARD_RARITY.COMMON
    },
    heavy_strike: {
        name: "Heavy Strike",
        description: "A powerful blow that breaks guards.",
        actionType: ACTION_TYPES.ATTACK_PHYSIC,
        staminaCost: 30,
        baseDamage: 25,
        scalingAttribute: "STRENGTH",
        scaleFactor: 1.5,
        rarity: CARD_RARITY.UNCOMMON
    },
    shield_block: {
        name: "Shield Block",
        description: "Brace for incoming damage.",
        actionType: ACTION_TYPES.DEFEND_PHYSIC,
        staminaCost: 8,
        baseDefense: 10,
        scalingAttribute: "STRENGTH",
        scaleFactor: 1.0,
        rarity: CARD_RARITY.COMMON
    },
    fireball: {
        name: "Fireball",
        description: "Hurl a sphere of flame.",
        actionType: ACTION_TYPES.ATTACK_MAGIC,
        staminaCost: 25,
        baseMagicDamage: 20,
        scalingAttribute: "INTELLIGENCE",
        scaleFactor: 1.2,
        rarity: CARD_RARITY.UNCOMMON
    },
    magic_shield: {
        name: "Magic Shield",
        description: "Conjure an arcane barrier.",
        actionType: ACTION_TYPES.DEFEND_MAGIC,
        staminaCost: 12,
        baseMagicDefense: 12,
        scalingAttribute: "INTELLIGENCE",
        scaleFactor: 1.0,
        rarity: CARD_RARITY.COMMON
    },
    precise_shot: {
        name: "Precise Shot",
        description: "A well-aimed bow strike.",
        actionType: ACTION_TYPES.ATTACK_PHYSIC,
        staminaCost: 18,
        baseDamage: 15,
        scalingAttribute: "STRENGTH",
        scaleFactor: 1.3,
        rarity: CARD_RARITY.UNCOMMON
    },
    dodge_roll: {
        name: "Dodge Roll",
        description: "Evade with grace.",
        actionType: ACTION_TYPES.DEFEND_PHYSIC,
        staminaCost: 10,
        baseDefense: 5,
        scalingAttribute: "STRENGTH",
        scaleFactor: 1.0,
        rarity: CARD_RARITY.COMMON
    },
    recover: {
        name: "Recover",
        description: "Mend your wounds.",
        actionType: ACTION_TYPES.HEALING,
        staminaCost: 10,
        baseHealing: 10,
        scalingAttribute: "VIGOR",
        scaleFactor: 1.5,
        rarity: CARD_RARITY.COMMON
    }
};
