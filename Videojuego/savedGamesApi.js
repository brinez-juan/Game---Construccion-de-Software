// Browser-side adapter for the saved-games REST endpoints scoped by the stored JWT
const TOKEN_KEY = 'authToken';

// Builds the request headers including the Bearer token when the user is logged in
function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Parses the JSON response and throws when the request or server-side validation failed
async function parseOrThrow(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

// Thin client around every saved-games, profile, attribute, run and session endpoint
export default class SavedGamesAPI {
  async listSlots() {
    const res = await fetch('/api/saved-games', { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.slots;
  }

  // Creates an empty save slot to be linked to a profile once the archetype is picked
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

  // Patches a subset of slot fields and lets the server refresh the last-played timestamp
  async updateSlot(slotId, patch) {
    const res = await fetch(`/api/saved-games/${slotId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(patch)
    });
    await parseOrThrow(res);
  }

  // Persists the chosen archetype with its seeded attributes and links the profile to the slot
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

  // Returns the full attribute snapshot used by the Battle Lobby chart
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

  // Spends an attribute point and returns the refreshed snapshot for the UI
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

  // Opens a fresh run record on the backend and binds it to the current slot
  async startRun(slotId) {
    const res = await fetch(`/api/saved-games/${slotId}/runs`, {
      method: 'POST',
      headers: authHeaders()
    });
    const data = await parseOrThrow(res);
    return data.run_id;
  }

  // Persists the furthest floor/room reached (and optionally the victory flag)
  // so the slot card and the map can resume after the player quits.
  async updateRunProgress(runId, { finalFloor, finalRoom, victory } = {}) {
    const body = { final_floor_reached: finalFloor, final_room_reached: finalRoom };
    if (typeof victory === 'boolean') { body.victory = victory; }
    const res = await fetch(`/api/runs/${runId}/progress`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(body)
    });
    await parseOrThrow(res);
  }

  // Records a new card pickup distinguishing permanent starters from in-run drops
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

  // Returns every card available to the slot joined with catalog data for the UI
  async listCards(slotId) {
    const res = await fetch(`/api/saved-games/${slotId}/cards`, { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.cards;
  }

  // Creates the room session and stores the five-card deck in slot order
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

  // Returns the static floor/room catalog (room id, floor_number, room_number,
  // is_boss, background asset) used to give each room a distinct screen state.
  async listRooms() {
    const res = await fetch('/api/rooms', { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.rooms;
  }

  async getSessionDeck(sessionId) {
    const res = await fetch(`/api/room-sessions/${sessionId}/deck`, { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.deck;
  }

  // Returns the full card catalog (every row of the cards table). Used as the
  // card source of truth and to resolve archetype starting-card slugs to ids.
  async listCardCatalog() {
    const res = await fetch('/api/cards', { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.cards;
  }

  // Returns the enemy catalog joined with floor_number so the client can pick a
  // room-appropriate pool per floor.
  async listEnemies() {
    const res = await fetch('/api/enemies', { headers: authHeaders() });
    const data = await parseOrThrow(res);
    return data.enemies;
  }
}
