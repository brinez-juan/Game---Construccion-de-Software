import express from 'express';
import pool from '../DB/dbconfig.js';
import requireAuth from '../Auth/requireAuth.js';

// US02 — Issue #20: saved_games CRUD.
// All queries are parameterized (mysql2 `?` placeholders) and scoped to
// the authenticated user via req.user.id from requireAuth, so a request
// cannot read or mutate another user's saves even by guessing ids.
//
// Schema integration: this table is the "slot" indirection on top of
// the normalized return_game schema. Game state itself lives in
// player_profiles, attributes, runs, room_sessions, player_cards, etc.
// — saved_games just names a slot and points at the player_profile
// row and the in-progress run that the player chose to resume.

const router = express.Router();
const MAX_SLOTS = 3;

// Shape returned to the SaveManager front-end. Joins the slot row with
// its player_profile (archetype/level/xp) and the most-recent run
// (final_floor_reached) so the slot picker UI from issue #21 has every
// field — name, level, floor, last_played_at — in a single round-trip.
function rowToSlot(row) {
  return {
    id: row.id,
    slotNumber: row.slot_number,
    name: row.name,
    lastPlayedAt: row.last_played_at,
    createdAt: row.created_at,
    profile: row.profile_id ? {
      id: row.profile_id,
      archetype: row.archetype,
      level: row.level,
      totalExperience: row.total_experience,
      attributePoints: row.attribute_points
    } : null,
    run: row.run_id ? {
      id: row.run_id,
      floor: row.final_floor_reached,
      room: row.final_room_reached,
      victory: !!row.victory
    } : null
  };
}

const SLOT_SELECT = `
  SELECT sg.id, sg.slot_number, sg.name, sg.last_played_at, sg.created_at,
         pp.id  AS profile_id, pp.archetype, pp.level,
         pp.total_experience, pp.attribute_points,
         r.id   AS run_id, r.final_floor_reached, r.final_room_reached, r.victory
    FROM saved_games sg
    LEFT JOIN player_profiles pp ON pp.id = sg.player_profile_id
    LEFT JOIN runs            r  ON r.id  = sg.current_run_id
`;

// Task 3: SELECT all slots for the current user.
router.get('/api/saved-games', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `${SLOT_SELECT}
        WHERE sg.user_id = ?
        ORDER BY sg.slot_number ASC`,
      [req.user.id]
    );
    return res.json({ success: true, slots: rows.map(rowToSlot) });
  } catch (error) {
    console.error('saved_games list error:', error);
    return res.status(500).json({ success: false, message: 'Could not list saves.' });
  }
});

// SELECT a single slot by id, still scoped to the user.
router.get('/api/saved-games/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `${SLOT_SELECT}
        WHERE sg.id = ? AND sg.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Save not found.' });
    }
    return res.json({ success: true, slot: rowToSlot(rows[0]) });
  } catch (error) {
    console.error('saved_games fetch error:', error);
    return res.status(500).json({ success: false, message: 'Could not load save.' });
  }
});

// Task 2: INSERT a new save. The slot is created empty (no profile yet)
// — ArchetypeManager.onArchetypeSelected later creates the player_profile
// row and uses PUT to point this slot at it.
// Auto-picks the first free slot 1..3 unless `slot_number` is supplied.
router.post('/api/saved-games', requireAuth, async (req, res) => {
  const { slot_number, name } = req.body || {};
  const userId = req.user.id;

  try {
    let slot = slot_number;
    if (!slot) {
      const [taken] = await pool.query(
        'SELECT slot_number FROM saved_games WHERE user_id = ?',
        [userId]
      );
      const used = new Set(taken.map(r => r.slot_number));
      for (let i = 1; i <= MAX_SLOTS; i++) {
        if (!used.has(i)) { slot = i; break; }
      }
      if (!slot) {
        return res.status(409).json({
          success: false,
          message: 'All save slots are full. Overwrite an existing slot first.'
        });
      }
    } else if (slot < 1 || slot > MAX_SLOTS) {
      return res.status(400).json({ success: false, message: 'slot_number must be 1..3.' });
    }

    const [result] = await pool.query(
      `INSERT INTO saved_games (user_id, slot_number, name)
       VALUES (?, ?, ?)`,
      [userId, slot, name ?? 'New Run']
    );

    return res.status(201).json({
      success: true,
      id: result.insertId,
      slot_number: slot
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'That slot is already taken. Use PUT to overwrite.'
      });
    }
    console.error('saved_games insert error:', error);
    return res.status(500).json({ success: false, message: 'Could not create save.' });
  }
});

// Task 4: UPDATE (overwrite) a slot's metadata — rename, point at a
// freshly-created player_profile, or update the in-progress run id.
// COALESCE leaves columns untouched when the caller omits them, so
// callers can patch a single field without losing the rest.
router.put('/api/saved-games/:id', requireAuth, async (req, res) => {
  const { name, player_profile_id, current_run_id } = req.body || {};

  try {
    const [result] = await pool.query(
      `UPDATE saved_games
          SET name              = COALESCE(?, name),
              player_profile_id = COALESCE(?, player_profile_id),
              current_run_id    = COALESCE(?, current_run_id),
              last_played_at    = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?`,
      [
        name ?? null,
        player_profile_id ?? null,
        current_run_id ?? null,
        req.params.id,
        req.user.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Save not found.' });
    }
    return res.json({ success: true });
  } catch (error) {
    if (error && error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'Referenced profile or run does not exist.'
      });
    }
    console.error('saved_games update error:', error);
    return res.status(500).json({ success: false, message: 'Could not update save.' });
  }
});

// Task 5: DELETE a slot. If the slot has a player_profile attached we
// delete the profile, and the FK cascade chain wipes the slot row,
// runs, attributes, player_cards, room_sessions, parry_stats, etc.
// If no profile is attached yet (slot created but archetype not chosen)
// we just drop the slot row directly.
router.delete('/api/saved-games/:id', requireAuth, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      'SELECT player_profile_id FROM saved_games WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Save not found.' });
    }

    const profileId = rows[0].player_profile_id;
    if (profileId) {
      await conn.query('DELETE FROM player_profiles WHERE id = ?', [profileId]);
    } else {
      await conn.query(
        'DELETE FROM saved_games WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id]
      );
    }

    await conn.commit();
    return res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    console.error('saved_games delete error:', error);
    return res.status(500).json({ success: false, message: 'Could not delete save.' });
  } finally {
    conn.release();
  }
});

export default router;
