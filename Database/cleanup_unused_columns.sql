-- cleanup_unused_columns.sql
-- One-time cleanup that removes columns the implemented game does not use and that do
-- not fit its design:
--   * floors.ambience / floors.color_palette  -> descriptive flavor, never read.
--   * room_sessions.waves_survived             -> the game has no wave system.
--   * session_enemies_defeated.wave_number     -> the game has no wave system.
--   * parry_stats.poor_parries                 -> parries are only perfect / good / miss.
--   * player_global_stats.total_poor_parries   -> same; no "poor" parry exists.
--
-- The global_stats and parry_success_by_floor views read the two poor columns, so they are
-- recreated WITHOUT poor first; otherwise the column drop would leave them invalid.
-- Run this against the return_game database (e.g. `mysql return_game < cleanup_unused_columns.sql`).

USE return_game;

-- 1) Recreate the poor-referencing views without poor ------------------------------------

CREATE OR REPLACE VIEW global_stats AS
  SELECT SUM(PG.total_perfect_parries)      AS global_perfect_parries,
         SUM(PG.total_normal_parries)       AS global_normal_parries,
         AVG(PG.best_completion_time_seconds) AS completion_time_avg,
         AVG(PG.total_cards_collected)      AS card_avg
    FROM return_game.player_global_stats AS PG;

-- LEFT JOINs so every floor appears even with no parry data yet (the chart maps one bar
-- group per row, so a missing floor would otherwise misalign it). SUM totals the actual
-- parries per floor; the previous COUNT(...) only counted how many sessions had a row.
CREATE OR REPLACE VIEW parry_success_by_floor AS
  SELECT F.floor_number,
         COALESCE(SUM(PS.perfect_parries), 0) AS perfect_parries,
         COALESCE(SUM(PS.normal_parries),  0) AS normal_parries
    FROM return_game.floors AS F
    LEFT JOIN return_game.rooms         AS R  ON F.id  = R.floor_id
    LEFT JOIN return_game.room_sessions AS RS ON R.id  = RS.room_id
    LEFT JOIN return_game.parry_stats   AS PS ON RS.id = PS.session_id
   GROUP BY F.floor_number;

-- 2) Drop the unused / eliminated columns ------------------------------------------------

ALTER TABLE floors
  DROP COLUMN ambience,
  DROP COLUMN color_palette;

ALTER TABLE room_sessions
  DROP COLUMN waves_survived;

ALTER TABLE session_enemies_defeated
  DROP COLUMN wave_number;

ALTER TABLE parry_stats
  DROP COLUMN poor_parries;

ALTER TABLE player_global_stats
  DROP COLUMN total_poor_parries;
