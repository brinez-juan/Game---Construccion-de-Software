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