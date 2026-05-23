// Browser-side adapter for the saved_games REST endpoints.
// Carries the JWT that login.js stores under `authToken`; the server
// scopes every query to that user, so the slot ids returned here are
// already filtered to the current account.
//
// Slot shape returned by listSlots()/fetchSlot():
//   { id, slotNumber, name, lastPlayedAt, createdAt,
//     profile: { id, archetype, level, totalExperience, attributePoints } | null,
//     run:     { id, floor, room, victory } | null }

const TOKEN_KEY = 'authToken';

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function parseOrThrow(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

export default class SavedGamesAPI {
  async listSlots() {
    const res = await fetch('/api/saved-games', { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.slots;
  }

  // SaveManager.newGame() calls this before the archetype is picked.
  // The slot is created empty (profile_id NULL); ArchetypeManager will
  // create the player_profile row and PUT its id back onto this slot.
  async createSlot(initial = {}) {
    const res = await fetch('/api/saved-games', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        name: initial.name ?? 'New Run',
        slot_number: initial.slotNumber
      })
    });
    const data = await parseOrThrow(res);
    return data.id;
  }

  async fetchSlot(slotId) {
    const res = await fetch(`/api/saved-games/${slotId}`, { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.slot;
  }

  async deleteSlot(slotId) {
    const res = await fetch(`/api/saved-games/${slotId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    await parseOrThrow(res);
  }

  // Patch any subset of { name, player_profile_id, current_run_id }.
  // last_played_at is bumped server-side on every successful PUT, so
  // the slot picker UI gets a "last session" sort for free.
  async updateSlot(slotId, patch) {
    const res = await fetch(`/api/saved-games/${slotId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(patch)
    });
    await parseOrThrow(res);
  }

  // --- Profile + attributes (US17 / issue #29) ---------------------

  // ArchetypeManager calls this right after the user confirms their
  // archetype. Pass the seeded attributes from ARCHETYPES (frontend is
  // the source of truth for base stats). Server links the new profile
  // back onto the slot via saved_games.player_profile_id.
  async createProfile(slotId, { archetype, attributes = {}, attributePoints = 0 }) {
    const res = await fetch(`/api/saved-games/${slotId}/profile`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        archetype,
        attribute_points: attributePoints,
        attributes
      })
    });
    const data = await parseOrThrow(res);
    return {
      profileId: data.profile_id,
      archetype: data.archetype,
      attributePoints: data.attribute_points,
      attributes: data.attributes
    };
  }

  // Battle Lobby pulls this to render the attribute chart.
  async getAttributes(slotId) {
    const res = await fetch(`/api/saved-games/${slotId}/attributes`, { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return {
      profileId: data.profile_id,
      level: data.level,
      availablePoints: data.available_points,
      attributes: {
        STRENGTH:     data.strength,
        VIGOR:        data.vigor,
        INTELLIGENCE: data.intelligence,
        ENDURANCE:    data.endurance,
        DEXTERITY:    data.dexterity
      },
      updatedAt: data.updated_at
    };
  }

  // '+' button in the Battle Lobby. `attribute` is one of STRENGTH,
  // VIGOR, INTELLIGENCE, ENDURANCE, DEXTERITY. Resolves to the new
  // attribute snapshot so the UI can refresh without a separate GET.
  async spendAttribute(slotId, attribute, amount = 1) {
    const res = await fetch(`/api/saved-games/${slotId}/attributes`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ attribute, amount })
    });
    const data = await parseOrThrow(res);
    return {
      availablePoints: data.available_points,
      attributes: {
        STRENGTH:     data.strength,
        VIGOR:        data.vigor,
        INTELLIGENCE: data.intelligence,
        ENDURANCE:    data.endurance,
        DEXTERITY:    data.dexterity
      }
    };
  }

  // --- Runs / inventory / deck (US09 / issue #32) ------------------

  // Called when the player leaves the map screen and enters a battle
  // (or any time a fresh run begins). Server sets saved_games.current_run_id.
  async startRun(slotId) {
    const res = await fetch(`/api/saved-games/${slotId}/runs`, {
      method: 'POST',
      headers: authHeaders()
    });
    const data = await parseOrThrow(res);
    return data.run_id;
  }

  // Reward path. is_permanent=true for archetype starters or the kept
  // boss card; false (default) for in-run drops.
  async addCard(slotId, { cardId, isPermanent = false, obtainedAtFloor = null }) {
    const res = await fetch(`/api/saved-games/${slotId}/cards`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        card_id: cardId,
        is_permanent: isPermanent,
        obtained_at_floor: obtainedAtFloor
      })
    });
    const data = await parseOrThrow(res);
    return data.id;
  }

  // Full Battle Lobby inventory = permanent ∪ current-run pickups.
  // Returned rows include the joined `cards` catalog data so the UI
  // can render names/cost/scaling without a second round-trip.
  async listCards(slotId) {
    const res = await fetch(`/api/saved-games/${slotId}/cards`, { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.cards;
  }

  // Battle Lobby "Continue" button. Creates the room_session and
  // saves the chosen 5 cards atomically. `deck` is an array of card
  // ids in UI slot order (slot N = deck[N-1]).
  async startSession(runId, { roomId, deck }) {
    const res = await fetch(`/api/runs/${runId}/sessions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ room_id: roomId, deck })
    });
    const data = await parseOrThrow(res);
    return {
      sessionId: data.room_session_id,
      deck: data.deck
    };
  }

  async getSessionDeck(sessionId) {
    const res = await fetch(`/api/room-sessions/${sessionId}/deck`, { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.deck;
  }
}
