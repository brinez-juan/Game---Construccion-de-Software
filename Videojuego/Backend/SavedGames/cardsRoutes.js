import express from 'express';
import pool from '../DB/dbconfig.js';
import requireAuth from '../Auth/requireAuth.js';

// US09 — Issue #32: card inventory + active-deck persistence.
//
// No new "inventory_run" table is added — the normalized schema from
// the team already covers run vs. permanent cards through
//   player_cards.is_permanent   (TRUE = meta-progression, survives death)
//   player_cards.obtained_at_run (which run the card was picked up in)
// and the per-battle deck through
//   active_deck_cards(room_session_id, slot, card_id)
//
// All queries are parameterized and scoped by req.user.id from
// requireAuth so a request can never read or mutate cards belonging
// to another account.

const router = express.Router();
const MAX_DECK_SIZE = 5;

// Look up the (player_profile_id, current_run_id) tied to a slot,
// scoped to the authenticated user. Every endpoint here uses this so
// passing a saved_games.id that belongs to a different user yields 404,
// not a leaked profile id.
async function slotContext(conn, slotId, userId) {
  const [rows] = await conn.query(
    `SELECT player_profile_id, current_run_id
       FROM saved_games
      WHERE id = ? AND user_id = ?`,
    [slotId, userId]
  );
  if (rows.length === 0) return { error: 'slot-not-found' };
  return { profileId: rows[0].player_profile_id, runId: rows[0].current_run_id };
}

// Task 2: add a card to the player's inventory after a reward.
// Body: { card_id, is_permanent?: false, obtained_at_floor?: int }
// - is_permanent FALSE = run-only pickup (default for in-run rewards)
// - is_permanent TRUE  = the one card the player keeps after death
router.post('/api/saved-games/:id/cards', requireAuth, async (req, res) => {
  const { card_id, is_permanent = false, obtained_at_floor = null } = req.body || {};

  if (!Number.isInteger(card_id) || card_id <= 0) {
    return res.status(400).json({ success: false, message: 'card_id (int) is required.' });
  }

  const conn = await pool.getConnection();
  try {
    const { profileId, runId, error } = await slotContext(conn, req.params.id, req.user.id);
    if (error) return res.status(404).json({ success: false, message: 'Save not found.' });
    if (!profileId) {
      return res.status(409).json({
        success: false,
        message: 'Slot has no profile yet — pick an archetype first.'
      });
    }

    const [result] = await conn.query(
      `INSERT INTO player_cards
         (player_id, card_id, obtained_at_run, obtained_at_floor, is_permanent)
       VALUES (?, ?, ?, ?, ?)`,
      [profileId, card_id, runId, obtained_at_floor, !!is_permanent]
    );

    return res.status(201).json({
      success: true,
      id: result.insertId,
      player_profile_id: profileId,
      card_id,
      is_permanent: !!is_permanent
    });
  } catch (error) {
    if (error && error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'card_id does not exist in cards.' });
    }
    console.error('add-card error:', error);
    return res.status(500).json({ success: false, message: 'Could not add card.' });
  } finally {
    conn.release();
  }
});

// Task 3: load the full Battle Lobby inventory.
// Returns every card the player can choose from: all permanent cards
// PLUS cards picked up during the current in-progress run. Cards are
// joined with the `cards` catalog so the UI gets name/description/
// scaling/etc. in one round-trip.
router.get('/api/saved-games/:id/cards', requireAuth, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { profileId, runId, error } = await slotContext(conn, req.params.id, req.user.id);
    if (error) return res.status(404).json({ success: false, message: 'Save not found.' });
    if (!profileId) {
      return res.json({ success: true, cards: [] });
    }

    const [rows] = await conn.query(
      `SELECT pc.id              AS player_card_id,
              pc.is_permanent,
              pc.obtained_at_run,
              pc.obtained_at_floor,
              c.id               AS card_id,
              c.name,
              c.description,
              c.action_type,
              c.stamina_cost,
              c.base_damage,
              c.rarity,
              c.scales_with,
              c.scaling_factor,
              c.required_attribute,
              c.required_value
         FROM player_cards pc
         JOIN cards        c  ON c.id = pc.card_id
        WHERE pc.player_id = ?
          AND (pc.is_permanent = TRUE
               OR (? IS NOT NULL AND pc.obtained_at_run = ?))
        ORDER BY pc.is_permanent DESC, pc.id ASC`,
      [profileId, runId, runId]
    );

    return res.json({ success: true, cards: rows });
  } catch (error) {
    console.error('inventory load error:', error);
    return res.status(500).json({ success: false, message: 'Could not load inventory.' });
  } finally {
    conn.release();
  }
});

// Helper: start a new run for the slot. Required precursor for the
// deck/session work below — saved_games.current_run_id must point at a
// real runs row before a battle can begin.
router.post('/api/saved-games/:id/runs', requireAuth, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { profileId, error } = await slotContext(conn, req.params.id, req.user.id);
    if (error) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Save not found.' });
    }
    if (!profileId) {
      await conn.rollback();
      return res.status(409).json({
        success: false,
        message: 'Slot has no profile yet — pick an archetype first.'
      });
    }

    const [runResult] = await conn.query(
      `INSERT INTO runs (player_id, start_time)
       VALUES (?, NOW())`,
      [profileId]
    );
    const runId = runResult.insertId;

    await conn.query(
      `UPDATE saved_games SET current_run_id = ? WHERE id = ? AND user_id = ?`,
      [runId, req.params.id, req.user.id]
    );

    await conn.commit();
    return res.status(201).json({ success: true, run_id: runId });
  } catch (error) {
    await conn.rollback();
    console.error('start-run error:', error);
    return res.status(500).json({ success: false, message: 'Could not start run.' });
  } finally {
    conn.release();
  }
});

// Task 4: start a room_session AND save the chosen Battle Deck in one
// transaction. The Battle Lobby's 'Continue' button calls this with the
// 5 selected card ids in their UI slot order. Inserting deck rows
// atomically with the session means we never end up with a session
// row pointing at no deck (or a half-written deck) if anything fails.
//
// Validates that:
//   - the run belongs to the authenticated user (via player_profiles)
//   - the deck size is 1..MAX_DECK_SIZE
//   - every deck card is actually owned by the player (permanent OR
//     picked up this run) — UI also enforces this, but the DB check
//     stops a tampered request from equipping cards the player doesn't own.
router.post('/api/runs/:runId/sessions', requireAuth, async (req, res) => {
  const { room_id, deck } = req.body || {};

  if (!Number.isInteger(room_id) || room_id <= 0) {
    return res.status(400).json({ success: false, message: 'room_id (int) is required.' });
  }
  if (!Array.isArray(deck) || deck.length === 0 || deck.length > MAX_DECK_SIZE) {
    return res.status(400).json({
      success: false,
      message: `deck must be a non-empty array of up to ${MAX_DECK_SIZE} card ids.`
    });
  }
  if (new Set(deck).size !== deck.length) {
    return res.status(400).json({ success: false, message: 'deck cannot contain duplicates.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Ownership check: the run's player_profile must belong to this user.
    const [runRows] = await conn.query(
      `SELECT r.id, r.player_id
         FROM runs r
         JOIN player_profiles pp ON pp.id = r.player_id
        WHERE r.id = ? AND pp.user_id = ?`,
      [req.params.runId, req.user.id]
    );
    if (runRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Run not found.' });
    }
    const playerId = runRows[0].player_id;

    // Make sure each requested card is owned by this player and either
    // permanent or picked up during this run.
    const [ownedRows] = await conn.query(
      `SELECT DISTINCT pc.card_id
         FROM player_cards pc
        WHERE pc.player_id = ?
          AND pc.card_id IN (?)
          AND (pc.is_permanent = TRUE OR pc.obtained_at_run = ?)`,
      [playerId, deck, req.params.runId]
    );
    const ownedSet = new Set(ownedRows.map(r => r.card_id));
    const missing = deck.filter(id => !ownedSet.has(id));
    if (missing.length > 0) {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: `These card ids are not in the player's inventory: ${missing.join(', ')}`
      });
    }

    const [sessionResult] = await conn.query(
      `INSERT INTO room_sessions (run_id, room_id, start_time)
       VALUES (?, ?, NOW())`,
      [req.params.runId, room_id]
    );
    const sessionId = sessionResult.insertId;

    // Bulk insert: one row per deck slot. The (session, slot) and
    // (session, card_id) UNIQUE keys defined on active_deck_cards mean
    // any duplicate slot or duplicate card would already have failed
    // the upstream validation; here it would surface as ER_DUP_ENTRY.
    const values = deck.map((cardId, idx) => [sessionId, cardId, idx + 1]);
    await conn.query(
      `INSERT INTO active_deck_cards (room_session_id, card_id, slot)
       VALUES ?`,
      [values]
    );

    await conn.commit();
    return res.status(201).json({
      success: true,
      room_session_id: sessionId,
      deck: deck.map((cardId, idx) => ({ slot: idx + 1, card_id: cardId }))
    });
  } catch (error) {
    await conn.rollback();
    if (error && error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'room_id does not exist.' });
    }
    console.error('start-session error:', error);
    return res.status(500).json({ success: false, message: 'Could not start session.' });
  } finally {
    conn.release();
  }
});

// Convenience: load the deck saved for a given session (verifies Task 4
// persistence). Scoped to the user via the same JOIN chain.
router.get('/api/room-sessions/:id/deck', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT adc.slot, adc.card_id, c.name, c.action_type, c.stamina_cost
         FROM active_deck_cards adc
         JOIN cards          c  ON c.id  = adc.card_id
         JOIN room_sessions  rs ON rs.id = adc.room_session_id
         JOIN runs           r  ON r.id  = rs.run_id
         JOIN player_profiles pp ON pp.id = r.player_id
        WHERE adc.room_session_id = ? AND pp.user_id = ?
        ORDER BY adc.slot ASC`,
      [req.params.id, req.user.id]
    );
    return res.json({ success: true, deck: rows });
  } catch (error) {
    console.error('deck load error:', error);
    return res.status(500).json({ success: false, message: 'Could not load deck.' });
  }
});

export default router;
