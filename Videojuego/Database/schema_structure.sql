-- schema_structure.sql
-- Full structure of the return_game database: tables, 10 views, 6 triggers, 6 stored
-- procedures. No data (see seed_data.sql). DEFINER clauses are stripped so the objects
-- are created as the importing user (portable across servers).
-- Recreate from scratch:
--   mysql < schema_structure.sql        # creates DB + all objects
--   mysql return_game < seed_data.sql    # loads the data

CREATE DATABASE IF NOT EXISTS `return_game` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `return_game`;

-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: return_game
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `active_deck_cards`
--

DROP TABLE IF EXISTS `active_deck_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `active_deck_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_session_id` int NOT NULL,
  `card_id` int NOT NULL,
  `slot` int DEFAULT NULL COMMENT '1–5',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_session_card` (`room_session_id`,`card_id`),
  UNIQUE KEY `uq_session_slot` (`room_session_id`,`slot`),
  KEY `fk_deck_card` (`card_id`),
  CONSTRAINT `fk_deck_card` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`),
  CONSTRAINT `fk_deck_session` FOREIGN KEY (`room_session_id`) REFERENCES `room_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1211 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--

/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_active_deck_cards_bi_maxsize` BEFORE INSERT ON `active_deck_cards` FOR EACH ROW BEGIN
  IF (SELECT COUNT(*) FROM active_deck_cards WHERE room_session_id = NEW.room_session_id) >= 5 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A battle deck can hold at most 5 cards.';
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `archetype_attribute_averages`
--

DROP TABLE IF EXISTS `archetype_attribute_averages`;
/*!50001 DROP VIEW IF EXISTS `archetype_attribute_averages`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `archetype_attribute_averages` AS SELECT 
 1 AS `archetype`,
 1 AS `avg_strength`,
 1 AS `avg_vigor`,
 1 AS `avg_intelligence`,
 1 AS `avg_endurance`,
 1 AS `avg_dexterity`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `archetypes_selected`
--

DROP TABLE IF EXISTS `archetypes_selected`;
/*!50001 DROP VIEW IF EXISTS `archetypes_selected`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `archetypes_selected` AS SELECT 
 1 AS `archetype`,
 1 AS `amount`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attributes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `strength` int DEFAULT '1' COMMENT 'Increases physical attack damage',
  `vigor` int DEFAULT '1' COMMENT 'Increases max HP',
  `intelligence` int DEFAULT '1' COMMENT 'Improves magic card effectiveness',
  `endurance` int DEFAULT '1' COMMENT 'Increases max stamina & regeneration',
  `dexterity` int DEFAULT '1' COMMENT 'Reduces stamina cost, improves card effects',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `player_id` (`player_id`),
  CONSTRAINT `fk_attr_player` FOREIGN KEY (`player_id`) REFERENCES `player_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Temporary view structure for view `card_usage_stats`
--

DROP TABLE IF EXISTS `card_usage_stats`;
/*!50001 DROP VIEW IF EXISTS `card_usage_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `card_usage_stats` AS SELECT 
 1 AS `card_id`,
 1 AS `name`,
 1 AS `rarity`,
 1 AS `times_equipped`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `action_type` enum('ATTACK_PHYSIC','ATTACK_MAGIC','DEFEND_PHYSIC','DEFEND_MAGIC','AOE_PHYSIC','AOE_MAGIC','HEALING','RECOVER_STAMINA') NOT NULL,
  `stamina_cost` int NOT NULL,
  `base_damage` int DEFAULT '0',
  `rarity` enum('COMMON','UNCOMMON','RARE','EPIC','LEGENDARY') NOT NULL,
  `sprite_name` varchar(100) DEFAULT NULL COMMENT 'Art filename stem in Assets/Sprites/cards, e.g. battle_axe',
  `scales_with` varchar(20) DEFAULT NULL COMMENT 'Attribute name that boosts this card, e.g. STRENGTH',
  `scaling_factor` decimal(5,2) DEFAULT '0.00' COMMENT 'Damage multiplier per attribute point',
  `required_attribute` varchar(20) DEFAULT NULL COMMENT 'e.g. INTELLIGENCE',
  `required_value` int DEFAULT '0',
  `is_boss_reward` tinyint(1) DEFAULT '0' COMMENT 'True for cards dropped exclusively by bosses',
  `enemy` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_carta_enemigo` (`enemy`),
  CONSTRAINT `fk_carta_enemigo` FOREIGN KEY (`enemy`) REFERENCES `enemies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Table structure for table `enemies`
--

DROP TABLE IF EXISTS `enemies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enemies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `health_min` int DEFAULT NULL,
  `health_max` int DEFAULT NULL,
  `physical_damage_min` int DEFAULT NULL,
  `physical_damage_max` int DEFAULT NULL,
  `magic_damage_min` int DEFAULT '0',
  `magic_damage_max` int DEFAULT '0',
  `physical_defense` int DEFAULT '0',
  `magic_defense` int DEFAULT '0',
  `xp_reward` int DEFAULT NULL,
  `is_boss` tinyint(1) DEFAULT '0',
  `floor_id` int DEFAULT NULL COMMENT 'Floor this enemy belongs to',
  `sprite` varchar(100) DEFAULT NULL COMMENT 'Bare filename in Assets/Sprites/characters',
  PRIMARY KEY (`id`),
  KEY `fk_enemy_floor` (`floor_id`),
  CONSTRAINT `fk_enemy_floor` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Special abilities are stored in enemy_abilities.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Temporary view structure for view `enemy_defeat_stats`
--

DROP TABLE IF EXISTS `enemy_defeat_stats`;
/*!50001 DROP VIEW IF EXISTS `enemy_defeat_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `enemy_defeat_stats` AS SELECT 
 1 AS `enemy_id`,
 1 AS `name`,
 1 AS `is_boss`,
 1 AS `times_defeated`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `floor_win_rates`
--

DROP TABLE IF EXISTS `floor_win_rates`;
/*!50001 DROP VIEW IF EXISTS `floor_win_rates`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `floor_win_rates` AS SELECT 
 1 AS `floor_number`,
 1 AS `wins`,
 1 AS `losses`,
 1 AS `finished_sessions`,
 1 AS `win_pct`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `floor_number` int NOT NULL COMMENT '0=Forest(tutorial), 1=Mystic Courtyard, 2=Halls, 3=Throne',
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `floor_number` (`floor_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Temporary view structure for view `global_stats`
--

DROP TABLE IF EXISTS `global_stats`;
/*!50001 DROP VIEW IF EXISTS `global_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `global_stats` AS SELECT 
 1 AS `global_perfect_parries`,
 1 AS `global_normal_parries`,
 1 AS `completion_time_avg`,
 1 AS `card_avg`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `leaderboard_top_players`
--

DROP TABLE IF EXISTS `leaderboard_top_players`;
/*!50001 DROP VIEW IF EXISTS `leaderboard_top_players`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `leaderboard_top_players` AS SELECT 
 1 AS `username`,
 1 AS `best_completion_time_seconds`,
 1 AS `total_perfect_parries`,
 1 AS `total_cards_collected`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `parry_stats`
--

DROP TABLE IF EXISTS `parry_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parry_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `perfect_parries` int DEFAULT '0' COMMENT 'Green zone — no HP loss, gain stamina',
  `normal_parries` int DEFAULT '0' COMMENT 'Yellow zone — small HP loss, small stamina gain',
  `parries_missed` int DEFAULT '0' COMMENT 'Did not press spacebar in time',
  PRIMARY KEY (`id`),
  KEY `fk_parry_session` (`session_id`),
  CONSTRAINT `fk_parry_session` FOREIGN KEY (`session_id`) REFERENCES `room_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--

/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_parry_ai_count` AFTER INSERT ON `parry_stats` FOR EACH ROW BEGIN
  DECLARE v_pid INT;
  SELECT r.player_id INTO v_pid
    FROM room_sessions rs
    JOIN runs r ON r.id = rs.run_id
   WHERE rs.id = NEW.session_id;
  IF v_pid IS NOT NULL THEN
    INSERT INTO player_global_stats (player_id, total_perfect_parries, total_normal_parries)
    VALUES (v_pid, NEW.perfect_parries, NEW.normal_parries)
    ON DUPLICATE KEY UPDATE
      total_perfect_parries = total_perfect_parries + NEW.perfect_parries,
      total_normal_parries  = total_normal_parries  + NEW.normal_parries;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `parry_success_by_floor`
--

DROP TABLE IF EXISTS `parry_success_by_floor`;
/*!50001 DROP VIEW IF EXISTS `parry_success_by_floor`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `parry_success_by_floor` AS SELECT 
 1 AS `floor_number`,
 1 AS `perfect_parries`,
 1 AS `normal_parries`,
 1 AS `missed_parries`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `player_cards`
--

DROP TABLE IF EXISTS `player_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `card_id` int NOT NULL,
  `obtained_at_run` int DEFAULT NULL COMMENT 'NULL if starter card',
  `obtained_at_floor` int DEFAULT NULL COMMENT 'Floor number where the card was obtained',
  `is_permanent` tinyint(1) DEFAULT '1' COMMENT 'Survives death; player chooses 1 boss card on defeat',
  PRIMARY KEY (`id`),
  KEY `fk_pcard_player` (`player_id`),
  KEY `fk_pcard_card` (`card_id`),
  KEY `fk_pcard_run` (`obtained_at_run`),
  CONSTRAINT `fk_pcard_card` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pcard_player` FOREIGN KEY (`player_id`) REFERENCES `player_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pcard_run` FOREIGN KEY (`obtained_at_run`) REFERENCES `runs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=384 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--

/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_player_cards_ai_count` AFTER INSERT ON `player_cards` FOR EACH ROW BEGIN
  INSERT INTO player_global_stats (player_id, total_cards_collected)
  VALUES (NEW.player_id, 1)
  ON DUPLICATE KEY UPDATE total_cards_collected = total_cards_collected + 1;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `player_global_stats`
--

DROP TABLE IF EXISTS `player_global_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player_global_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `total_runs` int DEFAULT '0',
  `total_victories` int DEFAULT '0',
  `best_completion_time_seconds` int DEFAULT NULL,
  `total_perfect_parries` int DEFAULT '0',
  `total_normal_parries` int DEFAULT '0',
  `total_enemies_defeated` int DEFAULT '0',
  `total_bosses_defeated` int DEFAULT '0',
  `total_cards_collected` int DEFAULT '0',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `player_id` (`player_id`),
  CONSTRAINT `fk_global_player` FOREIGN KEY (`player_id`) REFERENCES `player_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Table structure for table `player_profiles`
--

DROP TABLE IF EXISTS `player_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `archetype` enum('SOLDIER','ARCHER','MAGE') NOT NULL,
  `total_experience` int DEFAULT '0',
  `level` int DEFAULT '1',
  `attribute_points` int DEFAULT '0' COMMENT 'Unspent points available to distribute',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_profile_user` (`user_id`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Persistent profile that survives individual runs (roguelite meta-progression).';
/*!40101 SET character_set_client = @saved_cs_client */;

--
--

/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_player_profiles_ai_bootstrap` AFTER INSERT ON `player_profiles` FOR EACH ROW BEGIN
  INSERT IGNORE INTO player_global_stats (player_id) VALUES (NEW.id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `room_abandonment`
--

DROP TABLE IF EXISTS `room_abandonment`;
/*!50001 DROP VIEW IF EXISTS `room_abandonment`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `room_abandonment` AS SELECT 
 1 AS `room_id`,
 1 AS `floor_number`,
 1 AS `room_number`,
 1 AS `is_boss`,
 1 AS `abandoned_sessions`,
 1 AS `total_sessions`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `room_sessions`
--

DROP TABLE IF EXISTS `room_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `run_id` int NOT NULL,
  `room_id` int NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `result` enum('WIN','LOSS') DEFAULT NULL,
  `experience_gained` int DEFAULT NULL,
  `card_reward_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_session_run` (`run_id`),
  KEY `fk_session_room` (`room_id`),
  KEY `fk_session_reward` (`card_reward_id`),
  CONSTRAINT `fk_session_reward` FOREIGN KEY (`card_reward_id`) REFERENCES `cards` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_session_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `fk_session_run` FOREIGN KEY (`run_id`) REFERENCES `runs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Active deck cards are stored in active_deck_cards.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `floor_id` int NOT NULL,
  `room_number` int NOT NULL COMMENT '1 or 2 = regular enemies; 3 = boss room',
  `is_boss` tinyint(1) DEFAULT '0',
  `background` varchar(100) DEFAULT NULL COMMENT 'Background asset filename under Assets/backgrounds/',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_floor_room` (`floor_id`,`room_number`),
  CONSTRAINT `fk_room_floor` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Table structure for table `runs`
--

DROP TABLE IF EXISTS `runs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `runs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `completion_time_seconds` int DEFAULT NULL,
  `final_floor_reached` int DEFAULT NULL COMMENT '0–3',
  `final_room_reached` int DEFAULT NULL COMMENT '1–3',
  `victory` tinyint(1) DEFAULT '0',
  `death_cause` int DEFAULT NULL,
  `permanent_card_chosen_id` int DEFAULT NULL COMMENT 'Boss card the player kept after being defeated',
  PRIMARY KEY (`id`),
  KEY `fk_run_player` (`player_id`),
  KEY `fk_run_card` (`permanent_card_chosen_id`),
  KEY `fk_run_death_enemy` (`death_cause`),
  CONSTRAINT `fk_run_card` FOREIGN KEY (`permanent_card_chosen_id`) REFERENCES `cards` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_run_death_enemy` FOREIGN KEY (`death_cause`) REFERENCES `enemies` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_run_player` FOREIGN KEY (`player_id`) REFERENCES `player_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--

/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_runs_au_finish` AFTER UPDATE ON `runs` FOR EACH ROW BEGIN
  DECLARE v_best INT;
  IF OLD.end_time IS NULL AND NEW.end_time IS NOT NULL THEN
    SET v_best = IF(NEW.victory = 1, NEW.completion_time_seconds, NULL);
    INSERT INTO player_global_stats
      (player_id, total_runs, total_victories, best_completion_time_seconds)
    VALUES (NEW.player_id, 1, NEW.victory, v_best)
    ON DUPLICATE KEY UPDATE
      total_runs      = total_runs + 1,
      total_victories = total_victories + NEW.victory,
      best_completion_time_seconds = LEAST(
          COALESCE(best_completion_time_seconds, v_best),
          COALESCE(v_best, best_completion_time_seconds));
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `saved_games`
--

DROP TABLE IF EXISTS `saved_games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `slot_number` tinyint NOT NULL COMMENT '1..3',
  `name` varchar(64) NOT NULL DEFAULT 'New Run',
  `player_profile_id` int DEFAULT NULL COMMENT 'Set after archetype selection',
  `current_run_id` int DEFAULT NULL COMMENT 'In-progress run; NULL between runs',
  `last_played_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_slot` (`user_id`,`slot_number`),
  KEY `idx_user` (`user_id`),
  KEY `fk_save_profile` (`player_profile_id`),
  KEY `fk_save_run` (`current_run_id`),
  CONSTRAINT `fk_save_profile` FOREIGN KEY (`player_profile_id`) REFERENCES `player_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_save_run` FOREIGN KEY (`current_run_id`) REFERENCES `runs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_save_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_slot_range` CHECK ((`slot_number` between 1 and 3))
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Table structure for table `session_enemies_defeated`
--

DROP TABLE IF EXISTS `session_enemies_defeated`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_enemies_defeated` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `enemy_id` int NOT NULL,
  `defeated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sed_session` (`session_id`),
  KEY `fk_sed_enemy` (`enemy_id`),
  CONSTRAINT `fk_sed_enemy` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`),
  CONSTRAINT `fk_sed_session` FOREIGN KEY (`session_id`) REFERENCES `room_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--

/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 */ /*!50003 TRIGGER `trg_sed_ai_count` AFTER INSERT ON `session_enemies_defeated` FOR EACH ROW BEGIN
  DECLARE v_pid INT;
  DECLARE v_boss TINYINT DEFAULT 0;
  SELECT r.player_id INTO v_pid
    FROM room_sessions rs
    JOIN runs r ON r.id = rs.run_id
   WHERE rs.id = NEW.session_id;
  SELECT COALESCE(is_boss, 0) INTO v_boss FROM enemies WHERE id = NEW.enemy_id;
  IF v_pid IS NOT NULL THEN
    INSERT INTO player_global_stats (player_id, total_enemies_defeated, total_bosses_defeated)
    VALUES (v_pid, 1, v_boss)
    ON DUPLICATE KEY UPDATE
      total_enemies_defeated = total_enemies_defeated + 1,
      total_bosses_defeated  = total_bosses_defeated  + v_boss;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Temporary view structure for view `slot_overview`
--

DROP TABLE IF EXISTS `slot_overview`;
/*!50001 DROP VIEW IF EXISTS `slot_overview`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `slot_overview` AS SELECT 
 1 AS `saved_game_id`,
 1 AS `slot_number`,
 1 AS `name`,
 1 AS `username`,
 1 AS `archetype`,
 1 AS `level`,
 1 AS `total_experience`,
 1 AS `final_floor_reached`,
 1 AS `final_room_reached`,
 1 AS `last_played_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `failed_attempts` int DEFAULT '0',
  `lock_until` datetime DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'TRUE grants access to the admin statistics panel',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
--


--
-- Dumping routines for database 'return_game'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_apply_experience` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_apply_experience`(
  IN p_profile_id       INT,
  IN p_total_experience INT,
  IN p_level            INT,
  IN p_points_granted   INT
)
BEGIN
  UPDATE player_profiles
     SET total_experience = COALESCE(p_total_experience, total_experience),
         level            = COALESCE(p_level, level),
         attribute_points = attribute_points + GREATEST(0, COALESCE(p_points_granted, 0))
   WHERE id = p_profile_id;

  SELECT total_experience, level, attribute_points
    FROM player_profiles WHERE id = p_profile_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_player_profile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_create_player_profile`(
  IN p_saved_game_id INT,
  IN p_user_id       INT,
  IN p_archetype     VARCHAR(16),
  IN p_str INT, IN p_vig INT, IN p_int INT, IN p_end INT, IN p_dex INT,
  IN p_attr_points   INT
)
BEGIN
  DECLARE v_found    INT DEFAULT 1;
  DECLARE v_existing INT;
  DECLARE v_profile  INT;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_found = 0;

  SELECT player_profile_id INTO v_existing
    FROM saved_games WHERE id = p_saved_game_id AND user_id = p_user_id;

  IF v_found = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Save slot not found.';
  END IF;
  IF v_existing IS NOT NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This slot already has a profile.';
  END IF;

  INSERT INTO player_profiles (user_id, archetype, attribute_points)
  VALUES (p_user_id, p_archetype, GREATEST(0, p_attr_points));
  SET v_profile = LAST_INSERT_ID();

  INSERT INTO attributes (player_id, strength, vigor, intelligence, endurance, dexterity)
  VALUES (v_profile, GREATEST(0, p_str), GREATEST(0, p_vig), GREATEST(0, p_int),
          GREATEST(0, p_end), GREATEST(0, p_dex));

  UPDATE saved_games SET player_profile_id = v_profile
   WHERE id = p_saved_game_id AND user_id = p_user_id;

  SELECT v_profile AS profile_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_finish_room_session` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_finish_room_session`(
  IN p_session_id  INT,
  IN p_result      VARCHAR(8),
  IN p_xp          INT,
  IN p_card_reward INT,
  IN p_perfect     INT,
  IN p_normal      INT,
  IN p_missed      INT
)
BEGIN
  DECLARE v_applied TINYINT DEFAULT 0;
  IF (SELECT end_time FROM room_sessions WHERE id = p_session_id) IS NULL THEN
    UPDATE room_sessions
       SET end_time          = NOW(),
           result            = p_result,
           experience_gained = p_xp,
           card_reward_id    = p_card_reward
     WHERE id = p_session_id;

    INSERT INTO parry_stats (session_id, perfect_parries, normal_parries, parries_missed)
    VALUES (p_session_id, GREATEST(0, p_perfect), GREATEST(0, p_normal), GREATEST(0, p_missed));

    SET v_applied = 1;
  END IF;
  SELECT v_applied AS applied;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_finish_run` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_finish_run`(
  IN p_run_id          INT,
  IN p_victory         TINYINT,
  IN p_death_cause     INT,
  IN p_permanent_card  INT
)
BEGIN
  IF (SELECT end_time FROM runs WHERE id = p_run_id) IS NULL THEN
    UPDATE runs
       SET end_time                 = NOW(),
           completion_time_seconds  = TIMESTAMPDIFF(SECOND, start_time, NOW()),
           victory                  = p_victory,
           death_cause              = p_death_cause,
           permanent_card_chosen_id = p_permanent_card
     WHERE id = p_run_id;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_reset_run_on_death` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_reset_run_on_death`(
  IN p_saved_game_id INT,
  IN p_user_id       INT
)
BEGIN
  DECLARE v_profile INT;
  DECLARE v_run     INT;
  DECLARE CONTINUE HANDLER FOR NOT FOUND BEGIN END;

  SELECT player_profile_id, current_run_id INTO v_profile, v_run
    FROM saved_games WHERE id = p_saved_game_id AND user_id = p_user_id;

  IF v_profile IS NOT NULL AND v_run IS NOT NULL THEN
    DELETE FROM player_cards
     WHERE player_id = v_profile AND is_permanent = FALSE AND obtained_at_run = v_run;
  END IF;

  UPDATE saved_games SET current_run_id = NULL
   WHERE id = p_saved_game_id AND user_id = p_user_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_spend_attribute_point` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_spend_attribute_point`(
  IN p_profile_id INT,
  IN p_attribute  VARCHAR(20),
  IN p_amount     INT
)
BEGIN
  DECLARE v_col VARCHAR(20);
  SET v_col = LOWER(p_attribute);

  IF v_col NOT IN ('strength', 'vigor', 'intelligence', 'endurance', 'dexterity') THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'attribute must be STRENGTH, VIGOR, INTELLIGENCE, ENDURANCE or DEXTERITY.';
  END IF;
  IF p_amount < 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'amount must be at least 1.';
  END IF;

  -- Decrement first; the predicate prevents going negative. 0 rows = not enough points.
  UPDATE player_profiles
     SET attribute_points = attribute_points - p_amount
   WHERE id = p_profile_id AND attribute_points >= p_amount;
  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough available points.';
  END IF;

  -- Apply to the chosen column without dynamic SQL (the name was allowlisted above).
  UPDATE attributes
     SET strength     = strength     + IF(v_col = 'strength',     p_amount, 0),
         vigor        = vigor        + IF(v_col = 'vigor',        p_amount, 0),
         intelligence = intelligence + IF(v_col = 'intelligence', p_amount, 0),
         endurance    = endurance    + IF(v_col = 'endurance',    p_amount, 0),
         dexterity    = dexterity    + IF(v_col = 'dexterity',    p_amount, 0)
   WHERE player_id = p_profile_id;

  SELECT a.strength, a.vigor, a.intelligence, a.endurance, a.dexterity,
         pp.attribute_points AS available_points,
         v_col AS spent
    FROM player_profiles pp
    JOIN attributes a ON a.player_id = pp.id
   WHERE pp.id = p_profile_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `archetype_attribute_averages`
--

/*!50001 DROP VIEW IF EXISTS `archetype_attribute_averages`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `archetype_attribute_averages` AS select `pp`.`archetype` AS `archetype`,round(avg(`a`.`strength`),1) AS `avg_strength`,round(avg(`a`.`vigor`),1) AS `avg_vigor`,round(avg(`a`.`intelligence`),1) AS `avg_intelligence`,round(avg(`a`.`endurance`),1) AS `avg_endurance`,round(avg(`a`.`dexterity`),1) AS `avg_dexterity` from (`player_profiles` `pp` join `attributes` `a` on((`a`.`player_id` = `pp`.`id`))) group by `pp`.`archetype` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `archetypes_selected`
--

/*!50001 DROP VIEW IF EXISTS `archetypes_selected`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `archetypes_selected` AS select `ppf`.`archetype` AS `archetype`,count(0) AS `amount` from `player_profiles` `ppf` group by `ppf`.`archetype` order by `amount` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `card_usage_stats`
--

/*!50001 DROP VIEW IF EXISTS `card_usage_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `card_usage_stats` AS select `c`.`id` AS `card_id`,`c`.`name` AS `name`,`c`.`rarity` AS `rarity`,count(`adc`.`id`) AS `times_equipped` from (`cards` `c` left join `active_deck_cards` `adc` on((`adc`.`card_id` = `c`.`id`))) group by `c`.`id`,`c`.`name`,`c`.`rarity` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `enemy_defeat_stats`
--

/*!50001 DROP VIEW IF EXISTS `enemy_defeat_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `enemy_defeat_stats` AS select `e`.`id` AS `enemy_id`,`e`.`name` AS `name`,`e`.`is_boss` AS `is_boss`,count(`sed`.`id`) AS `times_defeated` from (`enemies` `e` left join `session_enemies_defeated` `sed` on((`sed`.`enemy_id` = `e`.`id`))) group by `e`.`id`,`e`.`name`,`e`.`is_boss` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `floor_win_rates`
--

/*!50001 DROP VIEW IF EXISTS `floor_win_rates`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `floor_win_rates` AS select `f`.`floor_number` AS `floor_number`,coalesce(sum((`rs`.`result` = 'WIN')),0) AS `wins`,coalesce(sum((`rs`.`result` = 'LOSS')),0) AS `losses`,count(`rs`.`result`) AS `finished_sessions`,round(((100 * sum((`rs`.`result` = 'WIN'))) / nullif(count(`rs`.`result`),0)),1) AS `win_pct` from ((`floors` `f` left join `rooms` `r` on((`r`.`floor_id` = `f`.`id`))) left join `room_sessions` `rs` on((`rs`.`room_id` = `r`.`id`))) group by `f`.`floor_number` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `global_stats`
--

/*!50001 DROP VIEW IF EXISTS `global_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `global_stats` AS select sum(`pg`.`total_perfect_parries`) AS `global_perfect_parries`,sum(`pg`.`total_normal_parries`) AS `global_normal_parries`,avg(`pg`.`best_completion_time_seconds`) AS `completion_time_avg`,avg(`pg`.`total_cards_collected`) AS `card_avg` from `player_global_stats` `pg` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `leaderboard_top_players`
--

/*!50001 DROP VIEW IF EXISTS `leaderboard_top_players`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `leaderboard_top_players` AS select `u`.`username` AS `username`,`pg`.`best_completion_time_seconds` AS `best_completion_time_seconds`,`pg`.`total_perfect_parries` AS `total_perfect_parries`,`pg`.`total_cards_collected` AS `total_cards_collected` from ((`users` `u` join `player_profiles` `pp` on((`pp`.`user_id` = `u`.`id`))) join `player_global_stats` `pg` on((`pg`.`player_id` = `pp`.`id`))) where (`pg`.`best_completion_time_seconds` is not null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `parry_success_by_floor`
--

/*!50001 DROP VIEW IF EXISTS `parry_success_by_floor`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `parry_success_by_floor` AS select `f`.`floor_number` AS `floor_number`,coalesce(sum(`ps`.`perfect_parries`),0) AS `perfect_parries`,coalesce(sum(`ps`.`normal_parries`),0) AS `normal_parries`,coalesce(sum(`ps`.`parries_missed`),0) AS `missed_parries` from (((`floors` `f` left join `rooms` `r` on((`f`.`id` = `r`.`floor_id`))) left join `room_sessions` `rs` on((`r`.`id` = `rs`.`room_id`))) left join `parry_stats` `ps` on((`rs`.`id` = `ps`.`session_id`))) group by `f`.`floor_number` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `room_abandonment`
--

/*!50001 DROP VIEW IF EXISTS `room_abandonment`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `room_abandonment` AS select `r`.`id` AS `room_id`,`f`.`floor_number` AS `floor_number`,`r`.`room_number` AS `room_number`,`r`.`is_boss` AS `is_boss`,sum((case when (`rs`.`end_time` is null) then 1 else 0 end)) AS `abandoned_sessions`,count(`rs`.`id`) AS `total_sessions` from ((`floors` `f` join `rooms` `r` on((`r`.`floor_id` = `f`.`id`))) left join `room_sessions` `rs` on((`rs`.`room_id` = `r`.`id`))) group by `r`.`id`,`f`.`floor_number`,`r`.`room_number`,`r`.`is_boss` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `slot_overview`
--

/*!50001 DROP VIEW IF EXISTS `slot_overview`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY DEFINER */
/*!50001 VIEW `slot_overview` AS select `sg`.`id` AS `saved_game_id`,`sg`.`slot_number` AS `slot_number`,`sg`.`name` AS `name`,`u`.`username` AS `username`,`pp`.`archetype` AS `archetype`,`pp`.`level` AS `level`,`pp`.`total_experience` AS `total_experience`,`r`.`final_floor_reached` AS `final_floor_reached`,`r`.`final_room_reached` AS `final_room_reached`,`sg`.`last_played_at` AS `last_played_at` from (((`saved_games` `sg` join `users` `u` on((`u`.`id` = `sg`.`user_id`))) left join `player_profiles` `pp` on((`pp`.`id` = `sg`.`player_profile_id`))) left join `runs` `r` on((`r`.`id` = `sg`.`current_run_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-08 23:47:59
