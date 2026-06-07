-- rebalance.sql
-- Tough-but-fair rebalance of the card catalog and the enemy roster for "Return".
--
-- Goals (see the design notes in the planning doc):
--   * One coherent stamina/damage economy across ALL cards (no more 1-6 stamina spam).
--   * Heavy weapons (axes) hit hard but cost ~1/3-1/2 of a stamina bar.
--   * AOE cards are deliberately weak per target (further reduced 40% in the client).
--   * EVERY card has a real attribute requirement, gated on one of the 5 attributes.
--   * Magic actually works: magic cards scale_with / require INTELLIGENCE, never the
--     non-existent 'magic' key (which gave 0 scaling and made some cards unequippable).
--   * Enemies have clear identities -- Physical / Magical / Hybrid -- expressed through
--     their damage schools and (crucially) their defenses: each resists its own school
--     and is weak to the opposite, rewarding the player for bringing the off-school.
--
-- Run against the `return_game` database. Re-runnable (pure UPDATEs).
--
--   USE return_game;
--   SOURCE Database/rebalance.sql;

-- ---------------------------------------------------------------------------
-- CARDS
-- ---------------------------------------------------------------------------
-- scales_with / required_attribute are stored UPPERCASE and must be one of
-- STRENGTH, DEXTERITY, INTELLIGENCE, VIGOR, ENDURANCE (the client uppercases
-- them and looks them up against the player's UPPERCASE attribute keys).

-- Physical single-target (STRENGTH) ----------------------------------------
UPDATE `cards` SET `name`='Vicious Sword', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=12, `base_damage`=9, `scales_with`='STRENGTH', `scaling_factor`=1.00,
  `required_attribute`='STRENGTH', `required_value`=1, `rarity`='COMMON', `is_boss_reward`=0
  WHERE `id`=1;

UPDATE `cards` SET `name`='Rusted Longsword', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=10, `base_damage`=8, `scales_with`='STRENGTH', `scaling_factor`=0.90,
  `required_attribute`='STRENGTH', `required_value`=1, `rarity`='COMMON', `is_boss_reward`=0
  WHERE `id`=21;

UPDATE `cards` SET `name`='Mushroomcap Bonk', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=9, `base_damage`=7, `scales_with`='STRENGTH', `scaling_factor`=0.80,
  `required_attribute`='STRENGTH', `required_value`=1, `rarity`='COMMON', `is_boss_reward`=0
  WHERE `id`=23;

UPDATE `cards` SET `name`='Crystal Knuckle', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=14, `base_damage`=11, `scales_with`='STRENGTH', `scaling_factor`=1.00,
  `required_attribute`='STRENGTH', `required_value`=2, `rarity`='COMMON', `is_boss_reward`=0
  WHERE `id`=25;

UPDATE `cards` SET `name`='Dark Sword', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=20, `base_damage`=16, `scales_with`='STRENGTH', `scaling_factor`=1.30,
  `required_attribute`='STRENGTH', `required_value`=4, `rarity`='UNCOMMON', `is_boss_reward`=0
  WHERE `id`=6;

UPDATE `cards` SET `name`='Orcish Meat-Cleaver', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=24, `base_damage`=18, `scales_with`='STRENGTH', `scaling_factor`=1.30,
  `required_attribute`='STRENGTH', `required_value`=4, `rarity`='UNCOMMON', `is_boss_reward`=0
  WHERE `id`=28;

-- Axes: high damage, ~1/3-1/2 stamina bar, high STRENGTH -------------------
UPDATE `cards` SET `name`='Battle Axe', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=30, `base_damage`=22, `scales_with`='STRENGTH', `scaling_factor`=1.40,
  `required_attribute`='STRENGTH', `required_value`=3, `rarity`='UNCOMMON', `is_boss_reward`=0
  WHERE `id`=2;

UPDATE `cards` SET `name`='Crystalheart Maul', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=34, `base_damage`=26, `scales_with`='STRENGTH', `scaling_factor`=1.50,
  `required_attribute`='STRENGTH', `required_value`=5, `rarity`='RARE', `is_boss_reward`=0
  WHERE `id`=34;

UPDATE `cards` SET `name`='Hidden Execution Axe', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=36, `base_damage`=28, `scales_with`='STRENGTH', `scaling_factor`=1.50,
  `required_attribute`='STRENGTH', `required_value`=5, `rarity`='RARE', `is_boss_reward`=1
  WHERE `id`=31;

UPDATE `cards` SET `name`='Galahad Twin Axes', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=40, `base_damage`=32, `scales_with`='STRENGTH', `scaling_factor`=1.60,
  `required_attribute`='STRENGTH', `required_value`=6, `rarity`='EPIC', `is_boss_reward`=1
  WHERE `id`=37;

-- Finesse single-target (DEXTERITY): cheaper, lower damage, sustainable -----
UPDATE `cards` SET `name`='Hunter Bow', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=11, `base_damage`=9, `scales_with`='DEXTERITY', `scaling_factor`=1.10,
  `required_attribute`='DEXTERITY', `required_value`=1, `rarity`='COMMON', `is_boss_reward`=0
  WHERE `id`=3;

UPDATE `cards` SET `name`='Pestilent Hook-Flail', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=13, `base_damage`=10, `scales_with`='DEXTERITY', `scaling_factor`=1.10,
  `required_attribute`='DEXTERITY', `required_value`=2, `rarity`='COMMON', `is_boss_reward`=0
  WHERE `id`=24;

UPDATE `cards` SET `name`='Moonlit Crescent Blade', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=16, `base_damage`=12, `scales_with`='DEXTERITY', `scaling_factor`=1.20,
  `required_attribute`='DEXTERITY', `required_value`=3, `rarity`='UNCOMMON', `is_boss_reward`=0
  WHERE `id`=30;

UPDATE `cards` SET `name`='Sentinel Twinblades', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=18, `base_damage`=13, `scales_with`='DEXTERITY', `scaling_factor`=1.25,
  `required_attribute`='DEXTERITY', `required_value`=3, `rarity`='UNCOMMON', `is_boss_reward`=0
  WHERE `id`=27;

UPDATE `cards` SET `name`='Sentinel Sunblades', `action_type`='ATTACK_PHYSIC',
  `stamina_cost`=26, `base_damage`=18, `scales_with`='DEXTERITY', `scaling_factor`=1.40,
  `required_attribute`='DEXTERITY', `required_value`=5, `rarity`='EPIC', `is_boss_reward`=0
  WHERE `id`=38;

-- Magic single-target (INTELLIGENCE) ---------------------------------------
UPDATE `cards` SET `name`='Ravenwood Crook', `action_type`='ATTACK_MAGIC',
  `stamina_cost`=16, `base_damage`=12, `scales_with`='INTELLIGENCE', `scaling_factor`=1.20,
  `required_attribute`='INTELLIGENCE', `required_value`=2, `rarity`='UNCOMMON', `is_boss_reward`=0
  WHERE `id`=26;

UPDATE `cards` SET `name`='Herald Eye-Wand', `action_type`='ATTACK_MAGIC',
  `stamina_cost`=22, `base_damage`=16, `scales_with`='INTELLIGENCE', `scaling_factor`=1.30,
  `required_attribute`='INTELLIGENCE', `required_value`=4, `rarity`='RARE', `is_boss_reward`=0
  WHERE `id`=32;

UPDATE `cards` SET `name`='Draconic Rose Staff', `action_type`='ATTACK_MAGIC',
  `stamina_cost`=32, `base_damage`=26, `scales_with`='INTELLIGENCE', `scaling_factor`=1.60,
  `required_attribute`='INTELLIGENCE', `required_value`=6, `rarity`='EPIC', `is_boss_reward`=1
  WHERE `id`=35;

-- AOE: weak per target (client reduces a further 40%), hits all enemies -----
UPDATE `cards` SET `name`='Fireball', `action_type`='AOE_MAGIC',
  `stamina_cost`=22, `base_damage`=10, `scales_with`='INTELLIGENCE', `scaling_factor`=1.00,
  `required_attribute`='INTELLIGENCE', `required_value`=1, `rarity`='UNCOMMON', `is_boss_reward`=0
  WHERE `id`=4;

UPDATE `cards` SET `name`='Pale Lancer Pike', `action_type`='AOE_PHYSIC',
  `stamina_cost`=24, `base_damage`=11, `scales_with`='DEXTERITY', `scaling_factor`=1.00,
  `required_attribute`='DEXTERITY', `required_value`=3, `rarity`='UNCOMMON', `is_boss_reward`=0
  WHERE `id`=29;

UPDATE `cards` SET `name`='Rotten Wraith Chain', `action_type`='AOE_MAGIC',
  `stamina_cost`=28, `base_damage`=13, `scales_with`='INTELLIGENCE', `scaling_factor`=1.10,
  `required_attribute`='INTELLIGENCE', `required_value`=4, `rarity`='RARE', `is_boss_reward`=0
  WHERE `id`=33;

-- Defends: binary full block of one matching-school attack. base_damage stays
-- 0; what matters is school and requirement. They cost 0 stamina on purpose:
-- a defend is always affordable, so it doubles as a "recovery turn" (a correct
-- defend resolves as a perfect parry -> +10% stamina) and guarantees the player
-- always has an action -- no more soft-lock when stamina hits 0. Physical defends
-- are gated on ENDURANCE, the magic defend on INTELLIGENCE.
UPDATE `cards` SET `name`='Knight Shield', `action_type`='DEFEND_PHYSIC',
  `stamina_cost`=0, `base_damage`=0, `scales_with`='ENDURANCE', `scaling_factor`=1.00,
  `required_attribute`='ENDURANCE', `required_value`=1, `rarity`='COMMON', `is_boss_reward`=0
  WHERE `id`=5;

-- id 22 repurposed (was the "Kite-Shield Ram" attack) into the only magic
-- defend, so casters/hybrids finally have a counter.
UPDATE `cards` SET `name`='Dark Ward',
  `description`='Una barrera oscura que absorbe un golpe mágico.',
  `action_type`='DEFEND_MAGIC',
  `stamina_cost`=0, `base_damage`=0, `scales_with`='INTELLIGENCE', `scaling_factor`=1.00,
  `required_attribute`='INTELLIGENCE', `required_value`=1, `rarity`='COMMON', `is_boss_reward`=0
  WHERE `id`=22;

UPDATE `cards` SET `name`='Giant Shield', `action_type`='DEFEND_PHYSIC',
  `stamina_cost`=0, `base_damage`=0, `scales_with`='ENDURANCE', `scaling_factor`=1.20,
  `required_attribute`='ENDURANCE', `required_value`=5, `rarity`='RARE', `is_boss_reward`=0
  WHERE `id`=39;

-- Safety net: should any card still reference the non-existent 'magic' key
-- (e.g. rows added outside this script), route it to INTELLIGENCE so it scales
-- and can actually be equipped. The `id > 0` keeps Workbench safe-update mode happy
-- (it wants a key column in the WHERE).
UPDATE `cards` SET `scales_with`='INTELLIGENCE' WHERE `id` > 0 AND LOWER(`scales_with`)='magic';
UPDATE `cards` SET `required_attribute`='INTELLIGENCE' WHERE `id` > 0 AND LOWER(`required_attribute`)='magic';

-- ---------------------------------------------------------------------------
-- ENEMIES
-- ---------------------------------------------------------------------------
-- Identity is enforced by defenses: an enemy resists its own school (high def)
-- and is weak to the opposite (low def). Hybrids carry both damage schools and
-- balanced defenses; the client makes hybrids randomly switch attack school so
-- a single-school defend can't be safely pre-committed.

-- Floor 0 / Forest (floor_id 1) --------------------------------------------
UPDATE `enemies` SET `health_min`=45, `health_max`=55,
  `physical_damage_min`=8, `physical_damage_max`=11, `magic_damage_min`=0, `magic_damage_max`=0,
  `physical_defense`=3, `magic_defense`=1, `xp_reward`=60 WHERE `id`=0;   -- Rick (Physical)

-- Floor 1 / Mystic Courtyard (floor_id 2) ----------------------------------
UPDATE `enemies` SET `health_min`=70, `health_max`=85,
  `physical_damage_min`=13, `physical_damage_max`=16, `magic_damage_min`=0, `magic_damage_max`=0,
  `physical_defense`=10, `magic_defense`=2, `xp_reward`=90 WHERE `id`=1;  -- Corrupted Knight (Physical)

UPDATE `enemies` SET `health_min`=65, `health_max`=80,
  `physical_damage_min`=14, `physical_damage_max`=17, `magic_damage_min`=0, `magic_damage_max`=0,
  `physical_defense`=6, `magic_defense`=3, `xp_reward`=95 WHERE `id`=2;   -- Pale Lancer (Physical)

UPDATE `enemies` SET `health_min`=60, `health_max`=75,
  `physical_damage_min`=0, `physical_damage_max`=0, `magic_damage_min`=13, `magic_damage_max`=16,
  `physical_defense`=2, `magic_defense`=9, `xp_reward`=100 WHERE `id`=3;  -- Hooded Herald (Magical)

UPDATE `enemies` SET `health_min`=190, `health_max`=210,
  `physical_damage_min`=20, `physical_damage_max`=24, `magic_damage_min`=0, `magic_damage_max`=0,
  `physical_defense`=12, `magic_defense`=5, `xp_reward`=500 WHERE `id`=4; -- Galahad (Boss, Physical)

-- Floor 2 / Bloody Halls (floor_id 3) --------------------------------------
UPDATE `enemies` SET `health_min`=95, `health_max`=115,
  `physical_damage_min`=0, `physical_damage_max`=0, `magic_damage_min`=19, `magic_damage_max`=23,
  `physical_defense`=4, `magic_defense`=12, `xp_reward`=170 WHERE `id`=5; -- Bog Witch (Magical)

UPDATE `enemies` SET `health_min`=120, `health_max`=140,
  `physical_damage_min`=13, `physical_damage_max`=16, `magic_damage_min`=12, `magic_damage_max`=15,
  `physical_defense`=11, `magic_defense`=10, `xp_reward`=210 WHERE `id`=6; -- Shield-maiden Wraith (Hybrid)

UPDATE `enemies` SET `health_min`=130, `health_max`=150,
  `physical_damage_min`=20, `physical_damage_max`=24, `magic_damage_min`=0, `magic_damage_max`=0,
  `physical_defense`=9, `magic_defense`=3, `xp_reward`=220 WHERE `id`=7; -- Marauder Orc (Physical)

UPDATE `enemies` SET `health_min`=300, `health_max`=340,
  `physical_damage_min`=8, `physical_damage_max`=11, `magic_damage_min`=24, `magic_damage_max`=28,
  `physical_defense`=9, `magic_defense`=16, `xp_reward`=800 WHERE `id`=8; -- Isolde (Boss, Magical)

-- Floor 3 / Throne of Return (floor_id 4) ----------------------------------
UPDATE `enemies` SET `health_min`=180, `health_max`=205,
  `physical_damage_min`=22, `physical_damage_max`=26, `magic_damage_min`=0, `magic_damage_max`=0,
  `physical_defense`=18, `magic_defense`=5, `xp_reward`=320 WHERE `id`=9; -- Crystal Gargoyle (Physical tank)

UPDATE `enemies` SET `health_min`=170, `health_max`=195,
  `physical_damage_min`=0, `physical_damage_max`=0, `magic_damage_min`=24, `magic_damage_max`=28,
  `physical_defense`=5, `magic_defense`=14, `xp_reward`=350 WHERE `id`=10; -- Rotten Spirit (Magical)

UPDATE `enemies` SET `health_min`=220, `health_max`=250,
  `physical_damage_min`=20, `physical_damage_max`=24, `magic_damage_min`=14, `magic_damage_max`=18,
  `physical_defense`=13, `magic_defense`=11, `xp_reward`=420 WHERE `id`=11; -- Ancient Sentinel (Hybrid)

UPDATE `enemies` SET `health_min`=460, `health_max`=500,
  `physical_damage_min`=28, `physical_damage_max`=34, `magic_damage_min`=16, `magic_damage_max`=20,
  `physical_defense`=18, `magic_defense`=12, `xp_reward`=1200 WHERE `id`=12; -- Eldric (Boss, Hybrid)

UPDATE `enemies` SET `health_min`=480, `health_max`=520,
  `physical_damage_min`=9, `physical_damage_max`=12, `magic_damage_min`=32, `magic_damage_max`=38,
  `physical_defense`=12, `magic_defense`=20, `xp_reward`=1500 WHERE `id`=13; -- Lysara (Boss, Magical)
