// Router that closes out room sessions and runs, recording the end-of-battle and
// end-of-run statistics the forward-progression routes never wrote: room_sessions
// end columns + parry_stats + session_enemies_defeated per session, and the runs end
// columns + the player_global_stats aggregate per run.
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

    await conn.query(
      `UPDATE room_sessions
          SET end_time          = NOW(),
              result            = ?,
              experience_gained = ?,
              card_reward_id    = ?
        WHERE id = ?`,
      [result, xp, rewardId, req.params.sessionId]
    );

    // One parry_stats row per session. ON DUPLICATE-style guard isn't available (no UNIQUE
    // on session_id), so delete any prior row first to keep finish idempotent on retry.
    await conn.query('DELETE FROM parry_stats WHERE session_id = ?', [req.params.sessionId]);
    await conn.query(
      `INSERT INTO parry_stats (session_id, perfect_parries, normal_parries, parries_missed)
       VALUES (?, ?, ?, ?)`,
      [req.params.sessionId, perfect, normal, missed]
    );

    // Re-record the defeated enemies for this session (idempotent on retry).
    await conn.query('DELETE FROM session_enemies_defeated WHERE session_id = ?', [req.params.sessionId]);
    if (enemyIds.length > 0) {
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

    // Ownership: the run's profile must belong to this user. Grab player_id for the aggregate.
    const [own] = await conn.query(
      `SELECT r.id, r.player_id
         FROM runs r
         JOIN player_profiles pp ON pp.id = r.player_id
        WHERE r.id = ? AND pp.user_id = ?`,
      [req.params.runId, req.user.id]
    );
    if (own.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Run not found.' });
    }
    const playerId = own[0].player_id;

    await conn.query(
      `UPDATE runs
          SET end_time                 = NOW(),
              completion_time_seconds  = TIMESTAMPDIFF(SECOND, start_time, NOW()),
              victory                  = ?,
              death_cause              = ?,
              permanent_card_chosen_id = ?
        WHERE id = ?`,
      [won, deathCause, keptCard, req.params.runId]
    );

    // The run's completion time (only meaningful for a victory) — used for best-time tracking.
    const [timeRows] = await conn.query(
      'SELECT completion_time_seconds AS secs FROM runs WHERE id = ?',
      [req.params.runId]
    );
    const completionSecs = timeRows[0]?.secs ?? null;

    // This run's parry totals, summed across its sessions' parry_stats rows.
    const [parrySum] = await conn.query(
      `SELECT COALESCE(SUM(ps.perfect_parries), 0) AS perfect,
              COALESCE(SUM(ps.normal_parries),  0) AS normal
         FROM room_sessions rs
         JOIN parry_stats ps ON ps.session_id = rs.id
        WHERE rs.run_id = ?`,
      [req.params.runId]
    );

    // Enemies (and of those, bosses) defeated this run.
    const [enemySum] = await conn.query(
      `SELECT COUNT(*) AS enemies,
              COALESCE(SUM(e.is_boss), 0) AS bosses
         FROM room_sessions rs
         JOIN session_enemies_defeated sed ON sed.session_id = rs.id
         JOIN enemies e ON e.id = sed.enemy_id
        WHERE rs.run_id = ?`,
      [req.params.runId]
    );

    // Cards collected during this run.
    const [cardSum] = await conn.query(
      'SELECT COUNT(*) AS cards FROM player_cards WHERE obtained_at_run = ?',
      [req.params.runId]
    );

    const perfect = Number(parrySum[0]?.perfect ?? 0);
    const normal = Number(parrySum[0]?.normal ?? 0);
    const enemies = Number(enemySum[0]?.enemies ?? 0);
    const bosses = Number(enemySum[0]?.bosses ?? 0);
    const cards = Number(cardSum[0]?.cards ?? 0);
    // Only feed a real victory time into the best-time tracking.
    const bestSeed = won && completionSecs != null ? completionSecs : null;

    // UPSERT the per-profile aggregate (player_global_stats.player_id is UNIQUE). On insert
    // the row starts from this run's contribution; on update each total is incremented and the
    // best completion time is the lowest non-NULL of the old and new values. The `AS newrun`
    // row alias is the non-deprecated replacement for the VALUES(col) function (MySQL 8.0.19+).
    await conn.query(
      `INSERT INTO player_global_stats
         (player_id, total_runs, total_victories, best_completion_time_seconds,
          total_perfect_parries, total_normal_parries,
          total_enemies_defeated, total_bosses_defeated, total_cards_collected)
       VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?) AS newrun
       ON DUPLICATE KEY UPDATE
         total_runs                   = total_runs + 1,
         total_victories              = total_victories + newrun.total_victories,
         best_completion_time_seconds = LEAST(
             COALESCE(best_completion_time_seconds, newrun.best_completion_time_seconds),
             COALESCE(newrun.best_completion_time_seconds, best_completion_time_seconds)),
         total_perfect_parries        = total_perfect_parries + newrun.total_perfect_parries,
         total_normal_parries         = total_normal_parries  + newrun.total_normal_parries,
         total_enemies_defeated       = total_enemies_defeated + newrun.total_enemies_defeated,
         total_bosses_defeated        = total_bosses_defeated  + newrun.total_bosses_defeated,
         total_cards_collected        = total_cards_collected  + newrun.total_cards_collected`,
      [playerId, won, bestSeed, perfect, normal, enemies, bosses, cards]
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
