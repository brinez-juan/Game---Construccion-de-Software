-- Potions -----------------------------------------------------------------------
--
-- Adds the once-per-battle health/stamina potions. RECOVER_STAMINA is a new action
-- type (HEALING already existed); the two potions are catalog cards used only by the
-- lobby's one-slot Potion deck — they are NOT droppable (enemy = NULL) and never seed
-- a starting deck, so they won't appear in the normal inventory/deck flow.
--
-- The restore PERCENT is stored in base_damage (no dedicated column exists): the potion
-- code reads it as a percent of the player's max HP / max stamina, so it scales with the
-- VIGOR/ENDURANCE build and stays tunable from the DB. Run against the return_game schema.

ALTER TABLE `cards`
  MODIFY `action_type` enum('ATTACK_PHYSIC','ATTACK_MAGIC','DEFEND_PHYSIC','DEFEND_MAGIC',
    'AOE_PHYSIC','AOE_MAGIC','HEALING','RECOVER_STAMINA') NOT NULL;

INSERT INTO `cards`
  (`name`,`description`,`action_type`,`stamina_cost`,`base_damage`,`rarity`,`sprite_name`,`enemy`)
VALUES
  ('Health Potion','Restores 40% of max health. One use per battle.','HEALING',0,40,'COMMON','health_potion',NULL),
  ('Stamina Potion','Restores 50% of max stamina. One use per battle.','RECOVER_STAMINA',0,50,'COMMON','stamina_potion',NULL);
