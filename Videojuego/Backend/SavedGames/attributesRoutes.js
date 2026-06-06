// Router that exposes per-profile attribute reads, profile creation and point spending
import express from 'express';
import pool from '../DB/dbconfig.js';
import requireAuth from '../Auth/requireAuth.js';

// US17 — Issue #29: attribute persistence per saved game.
// Lives on top of the normalized schema:
//   saved_games.player_profile_id -> player_profiles(id)
//   player_profiles.attribute_points        = "available_points"
//   attributes(player_id) strength/vigor/intelligence/endurance/dexterity
// No columns are duplicated into saved_games, so the 3NF check from
// issue #15 still passes.

const router = express.Router();

// Allowlisted column names. The PATCH endpoint uses the request body to
// pick which column to increment; this map is what prevents that input
// from ever reaching the SQL string as a raw identifier.
const ATTRIBUTE_COLUMNS = {
  STRENGTH:     'strength',
  VIGOR:        'vigor',
  INTELLIGENCE: 'intelligence',
  ENDURANCE:    'endurance',
  DEXTERITY:    'dexterity'
};

const VALID_ARCHETYPES = new Set(['SOLDIER', 'ARCHER', 'MAGE']);

// Resolve a slot id to its player_profile_id, scoped to the user. Used
// by every endpoint here to make sure a request can't read or mutate
// another user's profile/attributes by guessing a saved_games.id.
async function getProfileIdForSlot(conn, slotId, userId) {
  const [rows] = await conn.query(
    'SELECT player_profile_id FROM saved_games WHERE id = ? AND user_id = ?',
    [slotId, userId]
  );
  if (rows.length === 0) return { error: 'slot-not-found' };
  return { profileId: rows[0].player_profile_id };
}

// Task 1 follow-up + bridge from US02 to US29 (archetype selection):
// transactionally create the player_profile + attributes rows for a
// slot, then point saved_games at the new profile. Caller (frontend
// ArchetypeManager) supplies the archetype name and the seeded base
// attributes pulled from ARCHETYPES in GlobalVariables.js, so the
// front-end stays the single source of truth for archetype base stats.
router.post('/api/saved-games/:id/profile', requireAuth, async (req, res) => {
  const { archetype, attribute_points = 0, attributes = {} } = req.body || {};

  if (!VALID_ARCHETYPES.has(archetype)) {
    return res.status(400).json({
      success: false,
      message: 'archetype must be SOLDIER, ARCHER, or MAGE.'
    });
  }

  // Clamp to non-negative ints. The DB columns default to 1, so omitted
  // fields fall back to that.
  const seed = {};
  for (const [key, column] of Object.entries(ATTRIBUTE_COLUMNS)) {
    const raw = attributes[key] ?? attributes[column];
    seed[column] = raw == null ? 1 : Math.max(0, Math.trunc(Number(raw)));
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [slotRows] = await conn.query(
      'SELECT player_profile_id FROM saved_games WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (slotRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Save not found.' });
    }
    if (slotRows[0].player_profile_id) {
      await conn.rollback();
      return res.status(409).json({
        success: false,
        message: 'This slot already has a profile. Delete it first to start over.'
      });
    }

    const [profileResult] = await conn.query(
      `INSERT INTO player_profiles (user_id, archetype, attribute_points)
       VALUES (?, ?, ?)`,
      [req.user.id, archetype, Math.max(0, Math.trunc(Number(attribute_points)))]
    );
    const profileId = profileResult.insertId;

    await conn.query(
      `INSERT INTO attributes (player_id, strength, vigor, intelligence, endurance, dexterity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [profileId, seed.strength, seed.vigor, seed.intelligence, seed.endurance, seed.dexterity]
    );

    await conn.query(
      'UPDATE saved_games SET player_profile_id = ? WHERE id = ? AND user_id = ?',
      [profileId, req.params.id, req.user.id]
    );

    await conn.commit();
    return res.status(201).json({
      success: true,
      profile_id: profileId,
      archetype,
      attribute_points: Math.max(0, Math.trunc(Number(attribute_points))),
      attributes: seed
    });
  } catch (error) {
    await conn.rollback();
    console.error('profile create error:', error);
    return res.status(500).json({ success: false, message: 'Could not create profile.' });
  } finally {
    conn.release();
  }
});

// Task 3: SELECT attributes + available_points for the slot. Single
// JOIN so the Battle Lobby UI (issue #25) can render the chart in one
// request.
router.get('/api/saved-games/:id/attributes', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.strength, a.vigor, a.intelligence, a.endurance, a.dexterity,
              a.updated_at,
              pp.id   AS profile_id,
              pp.attribute_points AS available_points,
              pp.level
         FROM saved_games sg
         JOIN player_profiles pp ON pp.id = sg.player_profile_id
         JOIN attributes      a  ON a.player_id = pp.id
        WHERE sg.id = ? AND sg.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No attributes found. Slot may be missing a profile.'
      });
    }
    return res.json({ success: true, ...rows[0] });
  } catch (error) {
    console.error('attributes fetch error:', error);
    return res.status(500).json({ success: false, message: 'Could not load attributes.' });
  }
});

// Task 2: spend ONE point on a chosen attribute. Transactional so the
// "decrement pool" and "increment attribute" can never get out of sync
// — if either UPDATE affects 0 rows we roll back and return an error.
// The column name is taken from ATTRIBUTE_COLUMNS, never from the body
// directly, so this can't be turned into SQL injection.
router.patch('/api/saved-games/:id/attributes', requireAuth, async (req, res) => {
  const { attribute, amount = 1 } = req.body || {};

  const column = ATTRIBUTE_COLUMNS[String(attribute || '').toUpperCase()];
  if (!column) {
    return res.status(400).json({
      success: false,
      message: 'attribute must be one of STRENGTH, VIGOR, INTELLIGENCE, ENDURANCE, DEXTERITY.'
    });
  }
  const points = Math.max(1, Math.trunc(Number(amount)));

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { profileId, error } = await getProfileIdForSlot(conn, req.params.id, req.user.id);
    if (error || !profileId) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: error ? 'Save not found.' : 'Slot has no profile yet.'
      });
    }

    // Decrement first. The `attribute_points >= ?` predicate is what
    // prevents going negative — affectedRows === 0 means "not enough
    // points" and we bail without touching the attributes row.
    const [pool1] = await conn.query(
      `UPDATE player_profiles
          SET attribute_points = attribute_points - ?
        WHERE id = ? AND attribute_points >= ?`,
      [points, profileId, points]
    );
    if (pool1.affectedRows === 0) {
      await conn.rollback();
      return res.status(409).json({
        success: false,
        message: 'Not enough available points.'
      });
    }

    // Safe: `column` came from ATTRIBUTE_COLUMNS (allowlist), not body.
    const [attr1] = await conn.query(
      `UPDATE attributes SET \`${column}\` = \`${column}\` + ? WHERE player_id = ?`,
      [points, profileId]
    );
    if (attr1.affectedRows === 0) {
      await conn.rollback();
      return res.status(500).json({
        success: false,
        message: 'Profile is missing its attributes row.'
      });
    }

    // Read the new values back so the client can refresh without a
    // separate GET.
    const [after] = await conn.query(
      `SELECT a.strength, a.vigor, a.intelligence, a.endurance, a.dexterity,
              pp.attribute_points AS available_points
         FROM player_profiles pp
         JOIN attributes a ON a.player_id = pp.id
        WHERE pp.id = ?`,
      [profileId]
    );

    await conn.commit();
    return res.json({ success: true, spent: column, ...after[0] });
  } catch (error) {
    await conn.rollback();
    console.error('attributes update error:', error);
    return res.status(500).json({ success: false, message: 'Could not update attributes.' });
  } finally {
    conn.release();
  }
});

// US16 — Issue #52: persist level + accumulated XP after each battle.
// XP/level live on player_profiles (the per-run-surviving meta-progression
// home), reachable from a slot via saved_games.player_profile_id — they are
// deliberately NOT duplicated into saved_games, so the 3NF check still holds.
// Both fields are optional so a caller can patch one without the other; the
// COALESCE keeps the omitted column untouched.
router.patch('/api/saved-games/:id/experience', requireAuth, async (req, res) => {
  const { total_experience, level, attribute_points_granted } = req.body || {};

  // Normalize: clamp XP to a non-negative int and level to >= 1. null means
  // "leave this column as-is" so a single-field patch is possible.
  const xp = total_experience == null
    ? null
    : Math.max(0, Math.trunc(Number(total_experience)));
  const lvl = level == null
    ? null
    : Math.max(1, Math.trunc(Number(level)));
  // Attribute points earned this battle from leveling up. Applied as an INCREMENT
  // (not an overwrite) so it composes correctly with point-spending that happens
  // between battles — the client never has to know the authoritative total. A
  // non-positive/omitted value is a no-op.
  const grant = attribute_points_granted == null
    ? 0
    : Math.max(0, Math.trunc(Number(attribute_points_granted)));

  if (xp == null && lvl == null && grant === 0) {
    return res.status(400).json({
      success: false,
      message: 'Provide total_experience, level and/or attribute_points_granted.'
    });
  }

  const conn = await pool.getConnection();
  try {
    const { profileId, error } = await getProfileIdForSlot(conn, req.params.id, req.user.id);
    if (error || !profileId) {
      return res.status(404).json({
        success: false,
        message: error ? 'Save not found.' : 'Slot has no profile yet.'
      });
    }

    await conn.query(
      `UPDATE player_profiles
          SET total_experience = COALESCE(?, total_experience),
              level            = COALESCE(?, level),
              attribute_points = attribute_points + ?
        WHERE id = ?`,
      [xp, lvl, grant, profileId]
    );

    // Read the stored values back so the client can sync without a second GET.
    // attribute_points is the authoritative remaining pool after the grant.
    const [after] = await conn.query(
      'SELECT total_experience, level, attribute_points FROM player_profiles WHERE id = ?',
      [profileId]
    );

    return res.json({ success: true, ...after[0] });
  } catch (error) {
    console.error('experience update error:', error);
    return res.status(500).json({ success: false, message: 'Could not update experience.' });
  } finally {
    conn.release();
  }
});

export default router;
