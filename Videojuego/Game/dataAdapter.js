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

// Room states ------------------------------------------------------------------
//
// Each room gets a distinct screen state code so a level-selection screen can jump
// straight to it (see Return.js screenManager). Codes are 100 + room id to stay clear
// of the hand-numbered 0-8 screen states.
const ROOM_STATE_OFFSET = 100;
const BACKGROUNDS_DIR = '../Assets/backgrounds/';

// Mirrors Database/room_backgrounds.sql so the client still boots if GET /api/rooms
// (or the rooms.background column) isn't deployed yet. Shape matches an API row.
export const FALLBACK_ROOMS = [
    { id: 1,  floor_number: 0, room_number: 1, is_boss: 0, background: 'forest_0.png' },
    { id: 2,  floor_number: 0, room_number: 2, is_boss: 0, background: 'forest_0.png' },
    { id: 3,  floor_number: 0, room_number: 3, is_boss: 1, background: 'forest_0.png' },
    { id: 4,  floor_number: 1, room_number: 1, is_boss: 0, background: 'courtyard_1_1.png' },
    { id: 5,  floor_number: 1, room_number: 2, is_boss: 0, background: 'main entrance_1_2.png' },
    { id: 6,  floor_number: 1, room_number: 3, is_boss: 1, background: 'stairs purple_1_3.png' },
    { id: 7,  floor_number: 2, room_number: 1, is_boss: 0, background: 'paintings room_2_1.png' },
    { id: 8,  floor_number: 2, room_number: 2, is_boss: 0, background: 'dining room_2_2.png' },
    { id: 9,  floor_number: 2, room_number: 3, is_boss: 1, background: 'stairs red_2_3.png' },
    { id: 10, floor_number: 3, room_number: 1, is_boss: 0, background: 'library_3_1.png' },
    { id: 11, floor_number: 3, room_number: 2, is_boss: 0, background: 'bedroom_3_2.png' },
    { id: 12, floor_number: 3, room_number: 3, is_boss: 1, background: 'throne room_3_3.png' }
];

// One row from SavedGamesAPI.listRooms() -> the room shape Return.js consumes.
export function normalizeRoom(apiRoom) {
    return {
        id: apiRoom.id,
        floorNumber: apiRoom.floor_number,
        roomNumber: apiRoom.room_number,
        isBoss: !!apiRoom.is_boss,
        stateCode: ROOM_STATE_OFFSET + apiRoom.id,
        background: BACKGROUNDS_DIR + apiRoom.background
    };
}

// Builds the stateCode -> normalized room Map the screen manager looks rooms up in.
// Falls back to FALLBACK_ROOMS when the endpoint returned nothing usable.
export function buildRoomStateMap(apiRooms) {
    const source = (Array.isArray(apiRooms) && apiRooms.length > 0) ? apiRooms : FALLBACK_ROOMS;
    const map = new Map();
    for (const apiRoom of source) {
        const room = normalizeRoom(apiRoom);
        map.set(room.stateCode, room);
    }
    return map;
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
