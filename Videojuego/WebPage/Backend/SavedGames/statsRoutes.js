// Router that closes out room sessions and runs. It writes the raw end-of-battle/end-of-run
// rows (room_sessions end columns + parry_stats + session_enemies_defeated per session, and the
// runs end columns) via stored procedures; the player_global_stats aggregate is maintained by
// triggers (see Database/triggers.sql), so it is NOT computed here.
//
// All queries are parameterized and scoped to req.user.id via the ownership JOIN chain
//   room_sessions -> runs -> player_profiles -> users
// so a request can't close or score another account's session/run by guessing ids.
// Multi-step writes run inside a transaction so a half-written finish can't leave a
// session with end columns set but no parry/enemy rows (or vice versa).
import express from 'express';
import pool from '../DB/dbconfig.js';
import requireAuth from '../Auth/requireAuth.js';

const router = express.Router();

const VALID_RESULTS = new Set(['WIN', 'LOSS']);

// Clamp to a non-negative integer; null/undefined/garbage becomes 0.
function nonNegInt(value) {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// US: close out a room session (called on both a win and a death). Writes the session
// end columns, the single parry_stats row for the session, and one
// session_enemies_defeated row per enemy defeated, all atomically.
// Body: { result: 'WIN'|'LOSS', experience_gained, card_reward_id?,
//         parries: { perfect, normal, missed }, enemies_defeated: [enemyId, ...] }
router.patch('/api/room-sessions/:sessionId/finish', requireAuth, async (req, res) => {
  const { result, experience_gained, card_reward_id = null, parries = {}, enemies_defeated = [] } = req.body || {};

  if (!VALID_RESULTS.has(result)) {
    return res.status(400).json({ success: false, message: "result must be 'WIN' or 'LOSS'." });
  }

  const xp = nonNegInt(experience_gained);
  const perfect = nonNegInt(parries.perfect);
  const normal = nonNegInt(parries.normal);
  const missed = nonNegInt(parries.missed);
  // Keep only valid positive ids; the FK to enemies(id) would reject the rest anyway.
  const enemyIds = Array.isArray(enemies_defeated)
    ? enemies_defeated.map(id => Math.trunc(Number(id))).filter(id => Number.isInteger(id) && id > 0)
    : [];
  const rewardId = card_reward_id == null ? null : Math.trunc(Number(card_reward_id)) || null;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Ownership: the session's run must belong to a profile owned by this user.
    const [own] = await conn.query(
      `SELECT rs.id
         FROM room_sessions rs
         JOIN runs r            ON r.id  = rs.run_id
         JOIN player_profiles pp ON pp.id = r.player_id
        WHERE rs.id = ? AND pp.user_id = ?`,
      [req.params.sessionId, req.user.id]
    );
    if (own.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    // sp_finish_room_session sets the end columns and writes the single parry_stats row,
    // guarded on end_time IS NULL so a retry is a no-op. It returns applied=1 only on the first
    // finish; we insert the defeated-enemy rows only then, so the parry/enemy triggers fold each
    // session into player_global_stats exactly once.
    const [callRes] = await conn.query(
      'CALL sp_finish_room_session(?, ?, ?, ?, ?, ?, ?)',
      [req.params.sessionId, result, xp, rewardId, perfect, normal, missed]
    );
    const applied = !!callRes[0][0].applied;

    if (applied && enemyIds.length > 0) {
      const values = enemyIds.map(id => [req.params.sessionId, id]);
      await conn.query(
        'INSERT INTO session_enemies_defeated (session_id, enemy_id) VALUES ?',
        [values]
      );
    }

    await conn.commit();
    return res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    if (error && error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'A referenced enemy or card does not exist.' });
    }
    console.error('finish-session error:', error);
    return res.status(500).json({ success: false, message: 'Could not finish session.' });
  } finally {
    conn.release();
  }
});

// US: end a run (called on a death or a full victory). Writes the run end columns
// (completion time computed server-side from start_time) and folds this run's totals
// into the player_global_stats aggregate. The aggregate contribution is derived entirely
// from the rows already written for this run, so the client never sends totals.
// Body: { victory: bool, death_cause?: enemyId, permanent_card_chosen_id?: cardId }
router.patch('/api/runs/:runId/finish', requireAuth, async (req, res) => {
  const { victory = false, death_cause = null, permanent_card_chosen_id = null } = req.body || {};
  const deathCause = death_cause == null ? null : Math.trunc(Number(death_cause)) || null;
  const keptCard = permanent_card_chosen_id == null ? null : Math.trunc(Number(permanent_card_chosen_id)) || null;
  const won = victory ? 1 : 0;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Ownership: the run's profile must belong to this user.
    const [own] = await conn.query(
      `SELECT r.id
         FROM runs r
         JOIN player_profiles pp ON pp.id = r.player_id
        WHERE r.id = ? AND pp.user_id = ?`,
      [req.params.runId, req.user.id]
    );
    if (own.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Run not found.' });
    }

    // sp_finish_run sets the run end columns (completion time computed in SQL), guarded on
    // end_time IS NULL so it applies once. The trg_runs_au_finish trigger then folds the run
    // into player_global_stats (total_runs / total_victories / best time) — so the aggregate is
    // maintained in exactly one place (the DB), never double-counted here.
    await conn.query(
      'CALL sp_finish_run(?, ?, ?, ?)',
      [req.params.runId, won, deathCause, keptCard]
    );

    await conn.commit();
    return res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    if (error && error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ success: false, message: 'A referenced enemy or card does not exist.' });
    }
    console.error('finish-run error:', error);
    return res.status(500).json({ success: false, message: 'Could not finish run.' });
  } finally {
    conn.release();
  }
});

export default router;
