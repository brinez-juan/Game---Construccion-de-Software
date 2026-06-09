-- stats_views.sql
-- Idempotent (CREATE OR REPLACE) definitions for the admin stats views that aren't part of
-- the original dump. Safe to run anytime and as many times as needed — it only redefines
-- views, it never drops data or columns.
--
-- Run it to:
--   * add the session_abandonment view (new abandonment-rate admin chart), and
--   * apply the fixed parry_success_by_floor view (LEFT JOIN so every floor shows, and SUM
--     of the actual parries instead of a row COUNT) even if you already ran an older copy of
--     cleanup_unused_columns.sql.
-- Usage: `mysql return_game < stats_views.sql`

USE return_game;

-- Session abandonment: a room_session with no end_time was started but never finished
-- (the player quit mid-room) and counts as abandoned; one with an end_time is completed.
CREATE OR REPLACE VIEW session_abandonment AS
  SELECT
    SUM(CASE WHEN end_time IS NULL     THEN 1 ELSE 0 END) AS abandoned_sessions,
    SUM(CASE WHEN end_time IS NOT NULL THEN 1 ELSE 0 END) AS completed_sessions,
    COUNT(*)                                              AS total_sessions
  FROM return_game.room_sessions;

-- Parry success per floor (fixed): LEFT JOINs keep every floor even with no parry rows, and
-- SUM totals the parries (the old view COUNTed rows, i.e. sessions, not parries).
CREATE OR REPLACE VIEW parry_success_by_floor AS
  SELECT F.floor_number,
         COALESCE(SUM(PS.perfect_parries), 0) AS perfect_parries,
         COALESCE(SUM(PS.normal_parries),  0) AS normal_parries
    FROM return_game.floors AS F
    LEFT JOIN return_game.rooms         AS R  ON F.id  = R.floor_id
    LEFT JOIN return_game.room_sessions AS RS ON R.id  = RS.room_id
    LEFT JOIN return_game.parry_stats   AS PS ON RS.id = PS.session_id
   GROUP BY F.floor_number;
