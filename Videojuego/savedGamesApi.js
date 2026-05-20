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
}
