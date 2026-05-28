// Bridges the backend/DB data shapes (snake_case, UPPERCASE enums) to the shapes
// the canvas game consumes at runtime. Pure functions — the SavedGamesAPI instance
// is always passed in so this module stays free of fetch/transport concerns.

// Card art that actually ships in Assets/Sprites. Anything else falls back.
const AVAILABLE_CARD_SPRITES = new Set([
    'battle_axe', 'fireball', 'hunter_bow', 'knight_shield', 'vicious_sword'
]);
const FALLBACK_CARD_SPRITE = '../Assets/Sprites/knight_shield.jpeg';

// "Fire Bolt" -> "fire_bolt"
function slugify(name) {
    return String(name)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

// Sprite path relative to pages/game.html, or a neutral fallback when the DB
// card has no matching art file.
function spritePathFor(name) {
    const slug = slugify(name);
    return AVAILABLE_CARD_SPRITES.has(slug)
        ? `../Assets/Sprites/${slug}.jpeg`
        : FALLBACK_CARD_SPRITE;
}

// One row from SavedGamesAPI.listCards() -> the object deckSectionSpawn/deckMaker expect.
// action_type is lowercased to match ACTION_TYPES; scales_with stays UPPERCASE to
// match the canonical attribute keys so Action scaling resolves correctly.
export function normalizeCard(apiCard) {
    return {
        cardId: apiCard.card_id,
        name: apiCard.name,
        description: apiCard.description,
        action_type: String(apiCard.action_type || '').toLowerCase(),
        stamina_cost: Number(apiCard.stamina_cost) || 0,
        base_damage: Number(apiCard.base_damage) || 0,
        scales_with: apiCard.scales_with ? String(apiCard.scales_with).toUpperCase() : null,
        scaling_factor: Number(apiCard.scaling_factor) || 0,
        required_attribute: apiCard.required_attribute ? String(apiCard.required_attribute).toUpperCase() : null,
        required_value: Number(apiCard.required_value) || 0,
        rarity: apiCard.rarity,
        isPermanent: !!apiCard.is_permanent,
        spritePath: spritePathFor(apiCard.name)
    };
}

// SavedGamesAPI.getAttributes() already returns UPPERCASE attribute keys; this just
// pins down the runtime shape used to boot the lobby.
export function normalizeAttributes(apiAttrs) {
    return {
        attributes: apiAttrs.attributes,
        level: apiAttrs.level ?? 1,
        availablePoints: apiAttrs.availablePoints ?? 0
    };
}

// Picks the active save slot: first slot that already has a player_profile, else the
// first slot, else null. Returns the slot shape from SavedGamesAPI.listSlots().
export async function loadActiveSlot(api) {
    const slots = await api.listSlots();
    if (!slots || slots.length === 0) return null;
    return slots.find(s => s.profile) ?? slots[0];
}
