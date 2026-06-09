-- backfill_global_stats.sql
-- One-time backfill that (re)computes player_global_stats for EVERY player_profile from the
-- data already in the database, and seeds rows for profiles that never had one (e.g. the real
-- account's profiles 57/64/68). Safe to re-run: each total is recomputed from source, not
-- incremented, so running it twice yields the same result.
--
-- Notes:
--   * total_enemies_defeated / total_bosses_defeated come from session_enemies_defeated, which
--     is empty for historical data, so they backfill to 0 and start filling from new gameplay.
--   * "poor" parries no longer exist; only perfect/normal are aggregated.
-- Run AFTER cleanup_unused_columns.sql (so total_poor_parries is gone) against return_game.

USE return_game;

-- The recomputed values are built once in the `src` derived table and referenced from the
-- ON DUPLICATE KEY UPDATE clause (src.col), which is the non-deprecated replacement for the
-- VALUES(col) function. Each total is overwritten with the freshly computed value (recompute,
-- not increment), so the script is idempotent.
INSERT INTO player_global_stats
  (player_id, total_runs, total_victories, best_completion_time_seconds,
   total_perfect_parries, total_normal_parries,
   total_enemies_defeated, total_bosses_defeated, total_cards_collected)
SELECT
  src.player_id, src.total_runs, src.total_victories, src.best_completion_time_seconds,
  src.total_perfect_parries, src.total_normal_parries,
  src.total_enemies_defeated, src.total_bosses_defeated, src.total_cards_collected
FROM (
  SELECT
    pp.id AS player_id,
    (SELECT COUNT(*)                         FROM runs r WHERE r.player_id = pp.id) AS total_runs,
    (SELECT COALESCE(SUM(r.victory), 0)      FROM runs r WHERE r.player_id = pp.id) AS total_victories,
    (SELECT MIN(r.completion_time_seconds)   FROM runs r WHERE r.player_id = pp.id AND r.victory = 1) AS best_completion_time_seconds,
    (SELECT COALESCE(SUM(ps.perfect_parries), 0)
       FROM runs r
       JOIN room_sessions rs ON rs.run_id = r.id
       JOIN parry_stats   ps ON ps.session_id = rs.id
      WHERE r.player_id = pp.id) AS total_perfect_parries,
    (SELECT COALESCE(SUM(ps.normal_parries), 0)
       FROM runs r
       JOIN room_sessions rs ON rs.run_id = r.id
       JOIN parry_stats   ps ON ps.session_id = rs.id
      WHERE r.player_id = pp.id) AS total_normal_parries,
    (SELECT COUNT(*)
       FROM runs r
       JOIN room_sessions rs            ON rs.run_id = r.id
       JOIN session_enemies_defeated sed ON sed.session_id = rs.id
      WHERE r.player_id = pp.id) AS total_enemies_defeated,
    (SELECT COUNT(*)
       FROM runs r
       JOIN room_sessions rs            ON rs.run_id = r.id
       JOIN session_enemies_defeated sed ON sed.session_id = rs.id
       JOIN enemies e                    ON e.id = sed.enemy_id
      WHERE r.player_id = pp.id AND e.is_boss = 1) AS total_bosses_defeated,
    (SELECT COUNT(*) FROM player_cards pc WHERE pc.player_id = pp.id) AS total_cards_collected
  FROM player_profiles pp
) AS src
ON DUPLICATE KEY UPDATE
  total_runs                   = src.total_runs,
  total_victories              = src.total_victories,
  best_completion_time_seconds = src.best_completion_time_seconds,
  total_perfect_parries        = src.total_perfect_parries,
  total_normal_parries         = src.total_normal_parries,
  total_enemies_defeated       = src.total_enemies_defeated,
  total_bosses_defeated        = src.total_bosses_defeated,
  total_cards_collected        = src.total_cards_collected;
