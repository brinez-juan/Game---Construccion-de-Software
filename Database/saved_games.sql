-- US02 / Issue #20 — saved_games table (additive script).
-- Run this against the existing return_game database, AFTER the full
-- DB Schema v2 has already been applied (users, player_profiles, runs,
-- attributes, cards, ... must exist first).
--
-- Open in MySQL Workbench: File > Open SQL Script... > pick this file,
-- make sure `return_game` is the active schema, then run it with the
-- lightning-bolt button.
--
-- Design notes:
--   * One row per save slot. UNIQUE (user_id, slot_number) caps the UI
--     at 3 slots (issue #21) at the DB layer; CHECK enforces 1..3.
--   * player_profile_id is NULLABLE on purpose: SaveManager.newGame()
--     creates the slot BEFORE the archetype is picked, so the profile
--     row (which REQUIRES a non-null archetype enum) only exists after
--     ArchetypeManager.onArchetypeSelected runs.
--   * current_run_id tracks the in-progress run so we can resume it.
--   * Deleting a profile cascades to the slot via fk_save_profile;
--     deleting a run nulls current_run_id via fk_save_run.

USE return_game;

CREATE TABLE IF NOT EXISTS saved_games (
    id                INT          AUTO_INCREMENT PRIMARY KEY,
    user_id           INT          NOT NULL,
    slot_number       TINYINT      NOT NULL COMMENT '1..3',
    name              VARCHAR(64)  NOT NULL DEFAULT 'New Run',
    player_profile_id INT          NULL COMMENT 'Set after archetype selection',
    current_run_id    INT          NULL COMMENT 'In-progress run; NULL between runs',
    last_played_at    DATETIME     DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,
    created_at        DATETIME     DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_slot (user_id, slot_number),
    KEY idx_user (user_id),
    CONSTRAINT chk_slot_range CHECK (slot_number BETWEEN 1 AND 3),
    CONSTRAINT fk_save_user
        FOREIGN KEY (user_id)           REFERENCES users(id)            ON DELETE CASCADE,
    CONSTRAINT fk_save_profile
        FOREIGN KEY (player_profile_id) REFERENCES player_profiles(id)  ON DELETE CASCADE,
    CONSTRAINT fk_save_run
        FOREIGN KEY (current_run_id)    REFERENCES runs(id)             ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
