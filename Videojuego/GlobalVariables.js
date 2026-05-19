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
*/
export const ACTION_TYPES = {
    ATTACK_PHYSIC: "attack_physic",
    ATTACK_MAGIC: "attack_magic",
    DEFEND_PHYSIC: "defend_physic",
    DEFEND_MAGIC: "defend_magic",
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

// wich atribut powers wich action
export const ATTRIBUTE_SCALING = {
    STRENGTH: [ACTION_TYPES.ATTACK_PHYSIC, ACTION_TYPES.DEFEND_PHYSIC],
    INTELLIGENCE: [ACTION_TYPES.ATTACK_MAGIC, ACTION_TYPES.DEFEND_MAGIC],
    AGILITY: [],
    VIGOR: [],
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
