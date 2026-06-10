// Bridges the backend/DB data shapes (snake_case, UPPERCASE enums) to the shapes
// the canvas game consumes at runtime. Pure functions — the SavedGamesAPI instance
// is always passed in so this module stays free of fetch/transport concerns.

import { POTIONS } from "../libs/GlobalVariables.js";

// Card art that actually ships in Assets/Sprites/cards. The DB sprite_name is a bare
// stem (e.g. "rusted_longsword"); the files use mixed extensions (the original five are
// .jpeg, the newer enemy-drop art is .png), so this maps each known stem to its real
// filename. Anything not listed here falls back to the neutral shield art.
const CARD_SPRITE_DIR = '../Assets/Sprites/cards/';
const CARD_SPRITE_FILES = {
    battle_axe:          'battle_axe.jpeg',
    crystal_knuckle:     'crystal_knuckle.png',
    crystal_maul:        'crystal_maul.png',
    dark_shield:         'dark_shield.png',
    dark_sword:          'dark_sword.png',
    draconic_staff:      'draconic_staff.png',
    eldric_greatsword:   'eldric_greatsword.png',
    execution_axe:       'execution_axe.png',
    eye_wand:            'eye_wand.png',
    fireball:            'fireball.jpeg',
    giant_shield:        'giant_shield.png',
    health_potion:       'health_potion.png',
    hooked_flail:        'hooked_flail.png',
    hunter_bow:          'hunter_bow.jpeg',
    knight_shield:       'knight_shield.jpeg',
    lance_pike:          'lance_pike.png',
    moonlit_blade:       'moonlit_blade.png',
    mushroom_bonk:       'mushroom_bonk.png',
    orc_club:            'orc_club.png',
    ravenwood_staff:     'ravenwood_staff.png',
    rotted_chain:        'rotted_chain.png',
    rusted_longsword:    'rusted_longsword.png',
    serpent_orb:         'serpent_orb.png',
    stamina_potion:      'stamina_potion.png',
    sentinel_sunblades:  'sentinel_sunblades.png',
    sentinel_twinblades: 'sentinel_twinblades.png',
    twin_axes:           'twin_axes.png',
    vicious_sword:       'vicious_sword.jpeg'
};
const FALLBACK_CARD_SPRITE = CARD_SPRITE_DIR + 'knight_shield.jpeg';

// Enemy art ships in Assets/Sprites/characters/ as <name>_<floor>.png. The exact
// filename is pinned per enemy in the DB (enemies.sprite) because the display
// names don't slug-match the files; enemies with no art yet fall back here.
const ENEMY_SPRITE_DIR = '../Assets/Sprites/characters/';
const FALLBACK_ENEMY_SPRITE = ENEMY_SPRITE_DIR + 'corrupt_knight_1.png';

// Attack/defend art is normally derived from the idle filename by inserting the tag
// before the trailing tier (`crystal_gargoyle_3.png` -> `crystal_gargoyle_attack_3.png`).
// A few shipped files break that scheme (stem typos / "defense" vs "defend"), so they're
// pinned here, keyed by the DB idle filename. Enemies with no variant art aren't listed
// (and aren't derivable to a real file) — playState() keeps them on idle.
const ENEMY_SPRITE_OVERRIDES = {
    'crystal_gargoyle_3.png':       { defend: 'crytsal_gargoyle_defend_3.png' },
    'rotten_spirit_3.png':          { attack: 'rottens_spirit_attack_3.png' },
    'Isolde_draconic_maiden_2.png': { defend: 'Isolde_draconic_maiden_defense_2.png' },
    // Galahad's special art ships under a misspelled stem ("galahan"), so the derived
    // galahad_hidden_axe_special_1.png wouldn't resolve — pin the real filename.
    'galahad_hidden_axe_1.png':     { special: 'galahan_hidden_axe_special_1.png' }
};

// "Fire Bolt" -> "fire_bolt"
function slugify(name) {
    return String(name)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

// Resolves the SFX path for a card from its action type and name.
function resolveSfxPath(actionType, name) {
    const slug = slugify(name);
    // Arrow cards (e.g. Precise Shot) always get the arrow SFX
    if (slug.includes('arrow') || slug.includes('bow') || slug.includes('shot')) {
        return '../Assets/Audio/SFX_arrow.mp3';
    }
    // Magic attacks -> potion SFX
    if (actionType === 'attack_magic') {
        return '../Assets/Audio/SFX_potion.mp3';
    }
    // Defense cards (physical and magic) -> shield SFX
    if (actionType === 'defend_physic' || actionType === 'defend_magic') {
        return '../Assets/Audio/SFX_Shield.mp3';
    }
    // Physical attacks -> sword SFX
    if (actionType === 'attack_physic') {
        return '../Assets/Audio/SFX_Sword.mp3';
    }
    return null;
}

// Sprite path relative to pages/game.html, or a neutral fallback when the DB
// card has no matching art file. Prefers the DB-pinned sprite_name; falls back
// to slugifying the display name for cards seeded before that column existed.
function spritePathFor(spriteName, name) {
    const slug = spriteName ? slugify(spriteName) : slugify(name);
    const file = CARD_SPRITE_FILES[slug];
    return file ? CARD_SPRITE_DIR + file : FALLBACK_CARD_SPRITE;
}

// Resolves an enemy's art from its DB-pinned filename (enemies.sprite). Enemies
// without art yet (sprite null/empty) degrade to the placeholder instead of
// requesting a missing file.
function enemySpritePathFor(apiEnemy) {
    const file = apiEnemy && apiEnemy.sprite;
    return file ? ENEMY_SPRITE_DIR + file : FALLBACK_ENEMY_SPRITE;
}

// Inserts an action tag before the trailing `_<tier>` of an idle filename:
// `corrupt_knight_1.png` + 'attack' -> `corrupt_knight_attack_1.png`.
function deriveVariantFile(idleFile, tag) {
    return idleFile.replace(/_(\d+)(\.[a-z]+)$/i, `_${tag}_$1$2`);
}

// Resolves an enemy's { idle, attack, defend } poses from its DB-pinned idle filename.
// Attack/defend default to the derived names, with per-enemy overrides applied on top.
// All three are returned as full paths; the Enemy's playState() falls back to idle for
// any pose whose file doesn't exist.
function enemySpriteStatesFor(apiEnemy) {
    const idleFile = (apiEnemy && apiEnemy.sprite) || 'corrupt_knight_1.png';
    const override = ENEMY_SPRITE_OVERRIDES[idleFile] || {};
    const states = {
        idle:   ENEMY_SPRITE_DIR + idleFile,
        attack: ENEMY_SPRITE_DIR + (override.attack || deriveVariantFile(idleFile, 'attack')),
        defend: ENEMY_SPRITE_DIR + (override.defend || deriveVariantFile(idleFile, 'defend'))
    };
    // Only bosses use a special-attack pose; derive it (with the same per-enemy override hook)
    // just for them so non-boss art doesn't 404 requesting a _special file that never ships.
    if (apiEnemy && apiEnemy.is_boss) {
        states.special = ENEMY_SPRITE_DIR + (override.special || deriveVariantFile(idleFile, 'special'));
    }
    return states;
}

// Midpoint of an inclusive [min, max] range, rounded; tolerates null/equal bounds.
function midRange(min, max) {
    const lo = Number(min) || 0;
    const hi = Number(max);
    return Math.round((lo + (Number.isFinite(hi) ? hi : lo)) / 2);
}

// One row from SavedGamesAPI.listCards() -> the object deckSectionSpawn/deckMaker expect.
// action_type is lowercased to match ACTION_TYPES; scales_with stays UPPERCASE to
// match the canonical attribute keys so Action scaling resolves correctly.
export function normalizeCard(apiCard) {
    const actionType = String(apiCard.action_type || '').toLowerCase().trim();
    return {
        cardId: apiCard.card_id,
        name: apiCard.name,
        description: apiCard.description,
        action_type: actionType,
        stamina_cost: Number(apiCard.stamina_cost) || 0,
        base_damage: Number(apiCard.base_damage) || 0,
        scales_with: apiCard.scales_with ? String(apiCard.scales_with).toUpperCase() : null,
        scaling_factor: Number(apiCard.scaling_factor) || 0,
        required_attribute: apiCard.required_attribute ? String(apiCard.required_attribute).toUpperCase() : null,
        required_value: Number(apiCard.required_value) || 0,
        rarity: apiCard.rarity,
        isPermanent: !!apiCard.is_permanent,
        spritePath: spritePathFor(apiCard.sprite_name, apiCard.name),
        sfxPath: resolveSfxPath(actionType, apiCard.name)
    };
}

// One row from SavedGamesAPI.listCardCatalog() (cards table: `id`, no is_permanent)
// -> the same runtime card shape normalizeCard produces. Used for enemy drops, where
// the source is the global catalog instead of a player_cards inventory row. Delegates
// to normalizeCard so coercion stays in one place; drops default to run-only (not
// permanent), matching how addCard persists in-run pickups.
export function normalizeCatalogCard(row, { isPermanent = false } = {}) {
    return normalizeCard({
        card_id: row.id,
        name: row.name,
        description: row.description,
        action_type: row.action_type,
        stamina_cost: row.stamina_cost,
        base_damage: row.base_damage,
        scales_with: row.scales_with,
        scaling_factor: row.scaling_factor,
        required_attribute: row.required_attribute,
        required_value: row.required_value,
        rarity: row.rarity,
        is_permanent: isPermanent,
        sprite_name: row.sprite_name
    });
}

// Builds the two runtime potions (health/stamina) for the lobby's one-slot Potion deck.
// Prefers the DB catalog rows (matched by action type) so the name/description and restore
// percent (stored in base_damage) come from the DB; falls back to the built-in POTIONS table
// when the catalog lacks them, so potions still work offline. spritePath is resolved the same
// way as any card so the art (Assets/Sprites/cards/health_potion.png etc.) loads.
export function buildPotions(catalog) {
    const result = {};
    for (const def of Object.values(POTIONS)) {
        const row = (catalog || []).find(c => String(c.action_type).toLowerCase() === def.actionType);
        result[def.key] = {
            key: def.key,
            name: row?.name ?? def.name,
            actionType: def.actionType,                       // 'healing' | 'recover_stamina'
            restorePct: Number(row?.base_damage) || def.restorePct,
            spritePath: spritePathFor(row?.sprite_name ?? def.spriteName, def.name)
        };
    }
    return result;
}

// Groups the card catalog by the enemy that drops each card (cards.enemy -> enemies.id)
// into a Map<enemyId, catalogRow[]> so a cleared battle can grant one card per defeated
// enemy. Rows with no linked enemy (enemy null) are skipped.
export function buildEnemyCardDrops(catalog) {
    const map = new Map();
    for (const card of (catalog || [])) {
        if (card.enemy == null) continue;
        if (!map.has(card.enemy)) map.set(card.enemy, []);
        map.get(card.enemy).push(card);
    }
    return map;
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

// Enemies ----------------------------------------------------------------------
//
// One row from SavedGamesAPI.listEnemies() -> the shape battleScreen.enemyMaker
// + the Enemy constructor consume. Health/damage are taken as the midpoint of the
// DB min/max ranges so combat is deterministic. Enemies have no stamina or
// str/dex/int columns, so those get neutral defaults. spritePath falls back when
// no art ships for the enemy name.
export function normalizeEnemy(apiEnemy) {
    const health = midRange(apiEnemy.health_min, apiEnemy.health_max);
    return {
        id: apiEnemy.id,
        name: apiEnemy.name,
        health,
        maxHealth: health,
        stamina: 50,
        maxStamina: 50,
        attributes: { strength: 5, dexterity: 5, intelligence: 5 },
        physicalDamage: midRange(apiEnemy.physical_damage_min, apiEnemy.physical_damage_max),
        magicDamage: midRange(apiEnemy.magic_damage_min, apiEnemy.magic_damage_max),
        physicalDefense: Number(apiEnemy.physical_defense) || 0,
        magicDefense: Number(apiEnemy.magic_defense) || 0,
        experienceReward: Number(apiEnemy.xp_reward) || 0,
        isBoss: !!apiEnemy.is_boss,
        floorNumber: apiEnemy.floor_number,
        spritePath: enemySpritePathFor(apiEnemy),
        spritePaths: enemySpriteStatesFor(apiEnemy)
    };
}

// Groups normalized enemies by floor_number into { regular, boss } pools so a
// battle can pull a floor-appropriate pool (boss list for boss rooms).
export function buildEnemyPoolByFloor(apiEnemies) {
    const map = new Map();
    for (const apiEnemy of (apiEnemies || [])) {
        const enemy = normalizeEnemy(apiEnemy);
        if (!map.has(enemy.floorNumber)) map.set(enemy.floorNumber, { regular: [], boss: [] });
        const pool = map.get(enemy.floorNumber);
        (enemy.isBoss ? pool.boss : pool.regular).push(enemy);
    }
    return map;
}

// Floor/room model for the castle map. Excludes floor 0 (the Forest is a
// tutorial, not a castle node) and returns floors 1-3 each with their rooms
// (normalized, so background/isBoss/stateCode are available). The MapManager
// layers unlocked/completed flags on top of this; the cells read room data from
// buildFloorRoomLookup below.
export function buildFloorRoomModel(apiRooms) {
    const source = (Array.isArray(apiRooms) && apiRooms.length > 0) ? apiRooms : FALLBACK_ROOMS;
    const byFloor = new Map();
    for (const apiRoom of source) {
        if (apiRoom.floor_number === 0) continue; // forest tutorial is off-map
        const room = normalizeRoom(apiRoom);
        if (!byFloor.has(room.floorNumber)) byFloor.set(room.floorNumber, []);
        byFloor.get(room.floorNumber).push(room);
    }
    return [...byFloor.keys()].sort((a, b) => a - b).map(floorNumber => ({
        floorNumber,
        rooms: byFloor.get(floorNumber).sort((a, b) => a.roomNumber - b.roomNumber)
    }));
}

// "<floorNumber>-<roomNumber>" -> normalized room, for floors 1-3, so a
// hand-authored map cell can look up its DB-backed room.
export function buildFloorRoomLookup(apiRooms) {
    const lookup = new Map();
    for (const floor of buildFloorRoomModel(apiRooms)) {
        for (const room of floor.rooms) {
            lookup.set(`${room.floorNumber}-${room.roomNumber}`, room);
        }
    }
    return lookup;
}

// Maps a card slug (e.g. "heavy_strike") to its DB id using the card catalog, so
// the archetype screen can seed starting decks defined as slugs in GlobalVariables.
export function buildCardSlugToId(catalog) {
    const map = new Map();
    for (const card of (catalog || [])) {
        map.set(slugify(card.name), card.id);
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
