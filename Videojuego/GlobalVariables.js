/*
Attributes:
- Strength: Affects physical damage 
- Agility: Affects the parry window and stamina regeneration
- Intelligence: Affects magic damage 
- Vigor: Affects health points
- Endurance: Affects stamina points
*/
export const BASE_ATTRIBUTES = {
    STRENGTH: 0, 
    AGILITY: 0, 
    INTELLIGENCE: 0, 
    VIGOR: 0, 
    ENDURANCE: 0
};

/*
Action Types:
- Attack: A basic physical attack that deals damage based on the character's strength.
- Defend: Reduces incoming damage for a turn, with effectiveness based on agility and endurance.
- Spell: A magical attack that deals or reduces damage based on intelligence and can have
  additional effects.
- Healing: Restores health. Scales with VIGOR.
*/
export const ACTION_TYPES = {
    ATTACK_PHYSIC: "attack_physic",
    ATTACK_MAGIC: "attack_magic",
    DEFEND_PHYSIC: "defend_physic",
    DEFEND_MAGIC: "defend_magic",
    HEALING: "healing",
}


/*
Card Rarity: classification method to determine how common the drop rate for cards should be.
             Specifics to be determined later.
*/
export const CARD_RARITY = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    EPIC: "epic",
    LEGENDARY: "legendary"
}


/*
Parry results:
- Perfect: The player parries at the optimal time, no damage taken and stamina recovered
- Normal: The player parries within an acceptable time frame, little damage taken and little 
          stamina recovered
- Poor: The player parries too early or too late, full damage and no stamina recovered
*/
export const PARRY_RESULTS = {
    PERFECT: "perfect",
    NORMAL: "normal",
    POOR: "poor",
}

/*
Max deck size: the maximum number of cards a player can have in their active deck (5)
*/
export const MAX_DECK_SIZE = 5;

// archetypes for character selection
export const ARCHETYPES = {
    SOLDIER: {
        id: "soldier",
        attributes: { STRENGTH: 3, AGILITY: 1, INTELLIGENCE: 0, VIGOR: 2, ENDURANCE: 2 },
        startingCards: ["heavy_strike", "shield_block", "basic_attack", "basic_attack", "recover"]
    },
    ARCHER: {
        id: "archer",
        attributes: { STRENGTH: 1, AGILITY: 3, INTELLIGENCE: 0, VIGOR: 1, ENDURANCE: 2 },
        startingCards: ["precise_shot", "dodge_roll", "basic_attack", "basic_attack", "recover"]
    },
    MAGE: {
        id: "mage",
        attributes: { STRENGTH: 0, AGILITY: 1, INTELLIGENCE: 3, VIGOR: 1, ENDURANCE: 2 },
        startingCards: ["fireball", "magic_shield", "basic_attack", "basic_attack", "recover"]
    }
};

// Which attribute scales which card action.
// AGILITY governs parry window (handled in battle), ENDURANCE expands max stamina,
// VIGOR expands max HP and additionally scales HEALING cards.
export const ATTRIBUTE_SCALING = {
    STRENGTH: [ACTION_TYPES.ATTACK_PHYSIC, ACTION_TYPES.DEFEND_PHYSIC],
    INTELLIGENCE: [ACTION_TYPES.ATTACK_MAGIC, ACTION_TYPES.DEFEND_MAGIC],
    AGILITY: [],
    VIGOR: [ACTION_TYPES.HEALING],
    ENDURANCE: []
};

// card requirements by id
export const CARD_REQUIREMENTS = {
    heavy_strike: { STRENGTH: 3 },
    precise_shot: { AGILITY: 3 },
    fireball: { INTELLIGENCE: 3 },
    shield_block: { STRENGTH: 2 },
    dodge_roll: { AGILITY: 2 },
    magic_shield: { INTELLIGENCE: 2 }
};

// Catalog of every card the game can spawn. GameSession builds the player's
// inventory from archetype starting-card ids using this data (no DB yet).
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
