// Master toggle for background music (used by MusicManager and optionsMenu)
export let musicEnabled = true;

export function setMusicEnabled(value) {
    musicEnabled = value;
}

export let sfxEnabled = true;

export function setSfxEnabled(value) {
    sfxEnabled = value;
}

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
    ATTACK_SPECIAL: "attack_special",
    HEALING: "healing",
    RECOVER_STAMINA: "recover_stamina",
    AOE_PHYSIC: "aoe_physic",
    AOE_MAGIC: "aoe_magic"
}

// Once-per-battle potions for the lobby's one-slot Potion deck. Source of truth / fallback
// for when the DB catalog rows (Database/potions.sql) aren't available. `restorePct` is the
// percent of the player's max HP / max stamina restored when drunk; `actionType` decides which
// stat is restored. `spriteName` is the bare stem resolved by dataAdapter (Assets/Sprites/cards).
export const POTIONS = {
    HEALTH:  { key: "HEALTH",  name: "Health Potion",  actionType: ACTION_TYPES.HEALING,         restorePct: 40, spriteName: "health_potion" },
    STAMINA: { key: "STAMINA", name: "Stamina Potion", actionType: ACTION_TYPES.RECOVER_STAMINA, restorePct: 50, spriteName: "stamina_potion" }
}


// Rarity tiers used to bias card drop probabilities
export const CARD_RARITY = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    EPIC: "epic",
    LEGENDARY: "legendary"
}

// Maximum number of cards the player can carry in the active deck
export const MAX_DECK_SIZE = 5;

// Starter loadouts offered during character creation. Every card now carries an
// attribute requirement, so each archetype gets a deck whose requirements it can meet
// at creation (slugs are slugify(cards.name) in the DB — the key buildCardSlugToId uses).
export const ARCHETYPES = {
    SOLDIER: {
        id: "soldier",
        attributes: { STRENGTH: 3, DEXTERITY: 1, INTELLIGENCE: 0, VIGOR: 2, ENDURANCE: 2 },
        startingCards: ["vicious_sword", "battle_axe", "knight_shield"]
    },
    ARCHER: {
        id: "archer",
        attributes: { STRENGTH: 1, DEXTERITY: 3, INTELLIGENCE: 0, VIGOR: 1, ENDURANCE: 2 },
        startingCards: ["hunter_bow", "pestilent_hook_flail", "knight_shield"]
    },
    MAGE: {
        id: "mage",
        attributes: { STRENGTH: 0, DEXTERITY: 1, INTELLIGENCE: 3, VIGOR: 1, ENDURANCE: 2 },
        startingCards: ["fireball", "ravenwood_crook", "knight_shield"]
    }
};
