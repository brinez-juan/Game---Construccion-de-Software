-- cards_5card_rework.sql
-- Reduce the card catalog to the 5 cards we currently have art for, link each
-- card to its sprite via a new `sprite_name` column, and extend the action_type
-- enum with the AOE/HEALING types the game client already defines.
--
-- Run against the `return_game` database. Additive migration; ids 1-5 are kept
-- and repurposed, ids 6-20 are removed.
--
--   USE return_game;
--   SOURCE Database/cards_5card_rework.sql;

-- 1. Extend the action_type enum to match the client's ACTION_TYPES
--    (adds AOE_PHYSIC, AOE_MAGIC, HEALING).
ALTER TABLE `cards`
  MODIFY `action_type`
  enum('ATTACK_PHYSIC','ATTACK_MAGIC','DEFEND_PHYSIC','DEFEND_MAGIC',
       'AOE_PHYSIC','AOE_MAGIC','HEALING') NOT NULL;

-- 2. Add the sprite_name column linking each card to its art file
--    (filename stem in WebPage/Assets/Sprites/cards/, e.g. battle_axe).
--    Run once; drop the line if the column already exists.
ALTER TABLE `cards`
  ADD COLUMN `sprite_name` varchar(100) DEFAULT NULL
  COMMENT 'Art filename stem in Assets/Sprites/cards, e.g. battle_axe'
  AFTER `rarity`;

-- 3. Clear active-deck rows that point at cards we are about to delete.
--    active_deck_cards has no ON DELETE rule, so these must go first.
DELETE FROM `active_deck_cards` WHERE `card_id` NOT IN (1,2,3,4,5);

-- 4. Remove cards 6-20. This cascades player_cards (ON DELETE CASCADE) and
--    null-sets room_sessions.card_reward_id / runs.permanent_card_chosen_id
--    (ON DELETE SET NULL).
DELETE FROM `cards` WHERE `id` > 5;

-- 5. Repurpose ids 1-5 into the five art-backed cards.
UPDATE `cards` SET
  `name`='Vicious Sword',
  `description`='Corte rápido con una espada afilada.',
  `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=10,
  `base_damage`=10,
  `rarity`='COMMON',
  `sprite_name`='vicious_sword',
  `scales_with`='STRENGTH',
  `scaling_factor`=1.20,
  `required_attribute`=NULL,
  `required_value`=0,
  `is_boss_reward`=0
WHERE `id`=1;

UPDATE `cards` SET
  `name`='Battle Axe',
  `description`='Golpe pesado a dos manos con un hacha de guerra.',
  `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=18,
  `base_damage`=18,
  `rarity`='UNCOMMON',
  `sprite_name`='battle_axe',
  `scales_with`='STRENGTH',
  `scaling_factor`=1.50,
  `required_attribute`=NULL,
  `required_value`=0,
  `is_boss_reward`=0
WHERE `id`=2;

UPDATE `cards` SET
  `name`='Hunter Bow',
  `description`='Disparo certero con un arco de cazador.',
  `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=12,
  `base_damage`=12,
  `rarity`='COMMON',
  `sprite_name`='hunter_bow',
  `scales_with`='DEXTERITY',
  `scaling_factor`=1.30,
  `required_attribute`=NULL,
  `required_value`=0,
  `is_boss_reward`=0
WHERE `id`=3;

UPDATE `cards` SET
  `name`='Fireball',
  `description`='Proyectil ígneo que estalla al impactar.',
  `action_type`='ATTACK_MAGIC',
  `stamina_cost`=16,
  `base_damage`=14,
  `rarity`='UNCOMMON',
  `sprite_name`='fireball',
  `scales_with`='INTELLIGENCE',
  `scaling_factor`=1.30,
  `required_attribute`=NULL,
  `required_value`=0,
  `is_boss_reward`=0
WHERE `id`=4;

UPDATE `cards` SET
  `name`='Knight Shield',
  `description`='Defensa física tras un escudo de caballero.',
  `action_type`='DEFEND_PHYSIC',
  `stamina_cost`=8,
  `base_damage`=0,
  `rarity`='COMMON',
  `sprite_name`='knight_shield',
  `scales_with`='ENDURANCE',
  `scaling_factor`=0.90,
  `required_attribute`=NULL,
  `required_value`=0,
  `is_boss_reward`=0
WHERE `id`=5;
