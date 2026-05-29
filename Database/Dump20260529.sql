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
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_deck_cards`
--

LOCK TABLES `active_deck_cards` WRITE;
/*!40000 ALTER TABLE `active_deck_cards` DISABLE KEYS */;
INSERT INTO `active_deck_cards` VALUES (1,1,1,1),(2,1,4,2),(3,2,1,1),(4,2,4,2),(5,3,1,1),(6,3,4,2),(7,3,6,3),(8,4,1,1),(9,4,4,2),(10,4,6,3),(11,5,1,1),(12,5,4,2),(13,5,6,3),(14,6,2,1),(15,6,4,2),(16,7,2,1),(17,7,4,2),(18,7,7,3),(19,8,2,1),(20,8,4,2),(21,8,7,3),(22,9,3,1),(23,9,5,2),(24,10,3,1),(25,10,5,2),(26,10,8,3),(27,11,3,1),(28,11,5,2),(29,11,8,3),(30,12,3,1),(31,12,5,2),(32,12,8,3),(33,13,1,1),(34,13,4,2),(35,14,1,1),(36,14,4,2),(37,15,1,1),(38,15,4,2),(39,15,6,3),(40,15,9,4),(41,15,11,5),(42,16,1,1),(43,16,4,2),(44,16,6,3),(45,16,9,4),(46,16,11,5),(47,17,1,1),(48,17,4,2),(49,17,6,3),(50,17,9,4),(51,17,11,5),(52,18,6,1),(53,18,4,2),(54,18,9,3),(55,18,11,4),(56,19,6,1),(57,19,4,2),(58,19,9,3),(59,19,11,4),(60,20,2,1),(61,20,4,2);
/*!40000 ALTER TABLE `active_deck_cards` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (2,2,3,4,1,5,8,'2026-04-02 10:00:00'),(3,3,1,3,10,3,2,'2026-04-03 10:00:00'),(4,4,4,4,1,2,1,'2026-04-05 10:00:00'),(5,5,1,1,1,1,2,'2026-04-07 10:00:00'),(6,6,1,2,7,2,1,'2026-04-10 10:00:00'),(7,7,10,9,1,8,3,'2026-04-12 10:00:00'),(8,8,2,3,1,3,5,'2026-04-15 10:00:00'),(9,9,1,4,8,3,2,'2026-04-18 10:00:00'),(10,10,3,3,1,2,1,'2026-04-20 10:00:00'),(12,12,4,4,0,3,2,'2026-05-28 06:57:30');
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

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
  `action_type` enum('ATTACK_PHYSIC','ATTACK_MAGIC','DEFEND_PHYSIC','DEFEND_MAGIC') NOT NULL,
  `stamina_cost` int NOT NULL,
  `base_damage` int DEFAULT '0',
  `rarity` enum('COMMON','UNCOMMON','RARE','EPIC','LEGENDARY') NOT NULL,
  `scales_with` varchar(20) DEFAULT NULL COMMENT 'Attribute name that boosts this card, e.g. STRENGTH',
  `scaling_factor` decimal(5,2) DEFAULT '0.00' COMMENT 'Damage multiplier per attribute point',
  `required_attribute` varchar(20) DEFAULT NULL COMMENT 'e.g. INTELLIGENCE',
  `required_value` int DEFAULT '0',
  `is_boss_reward` tinyint(1) DEFAULT '0' COMMENT 'True for cards dropped exclusively by bosses',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (1,'Slash','Corte rápido con espada','ATTACK_PHYSIC',10,8,'COMMON','STRENGTH',1.20,NULL,0,0),(2,'Quick Stab','Estocada veloz con daga','ATTACK_PHYSIC',8,6,'COMMON','DEXTERITY',1.10,NULL,0,0),(3,'Fire Bolt','Proyectil ígneo básico','ATTACK_MAGIC',12,10,'COMMON','INTELLIGENCE',1.30,NULL,0,0),(4,'Iron Guard','Defensa física con escudo','DEFEND_PHYSIC',8,0,'COMMON','ENDURANCE',0.80,NULL,0,0),(5,'Arcane Ward','Barrera mágica básica','DEFEND_MAGIC',10,0,'COMMON','INTELLIGENCE',0.90,NULL,0,0),(6,'Heavy Strike','Golpe pesado a dos manos','ATTACK_PHYSIC',18,16,'UNCOMMON','STRENGTH',1.50,'STRENGTH',3,0),(7,'Piercing Shot','Flecha que perfora armadura','ATTACK_PHYSIC',14,12,'UNCOMMON','DEXTERITY',1.40,'DEXTERITY',4,0),(8,'Frost Lance','Lanza de hielo penetrante','ATTACK_MAGIC',16,14,'UNCOMMON','INTELLIGENCE',1.45,'INTELLIGENCE',4,0),(9,'Stone Skin','Piel pétrea, reduce daño físico','DEFEND_PHYSIC',14,0,'RARE','VIGOR',1.20,'VIGOR',5,0),(10,'Mirror Shield','Refleja parte del daño mágico recibido','DEFEND_MAGIC',16,0,'RARE','INTELLIGENCE',1.30,'INTELLIGENCE',5,0),(11,'Crimson Cleave','Tajo ensangrentado, alto daño','ATTACK_PHYSIC',22,24,'RARE','STRENGTH',1.80,'STRENGTH',6,0),(12,'Storm Volley','Lluvia de flechas eléctricas','ATTACK_PHYSIC',28,30,'EPIC','DEXTERITY',2.00,'DEXTERITY',8,0),(13,'Meteor','Invocación de roca incandescente','ATTACK_MAGIC',35,45,'EPIC','INTELLIGENCE',2.20,'INTELLIGENCE',8,1),(14,'Aegis','Escudo legendario de los guardianes','DEFEND_PHYSIC',30,0,'EPIC','ENDURANCE',2.00,'ENDURANCE',7,1),(15,'King\'s Wrath','El golpe final del rey caído','ATTACK_PHYSIC',45,70,'LEGENDARY','STRENGTH',2.50,'STRENGTH',12,1),(16,'Basic Attack','Simple physical strike.','ATTACK_PHYSIC',15,10,'COMMON','STRENGTH',1.00,NULL,0,0),(17,'Heavy Strike','Powerful blow.','ATTACK_PHYSIC',30,25,'UNCOMMON','STRENGTH',1.50,'STRENGTH',3,0),(18,'Shield Block','Brace for incoming hit.','DEFEND_PHYSIC',8,0,'COMMON','STRENGTH',1.00,NULL,0,0),(19,'Fireball','Hurl flame.','ATTACK_MAGIC',25,20,'UNCOMMON','INTELLIGENCE',1.20,'INTELLIGENCE',3,0),(20,'Recover','Mend wounds.','DEFEND_MAGIC',10,0,'COMMON','VIGOR',1.50,NULL,0,0);
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id`),
  KEY `fk_enemy_floor` (`floor_id`),
  CONSTRAINT `fk_enemy_floor` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Special abilities are stored in enemy_abilities.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enemies`
--

LOCK TABLES `enemies` WRITE;
/*!40000 ALTER TABLE `enemies` DISABLE KEYS */;
INSERT INTO `enemies` VALUES (1,'Forest Wolf',40,60,6,10,0,0,2,1,50,0,1),(2,'Wandering Bandit',55,75,8,12,0,0,3,2,70,0,1),(3,'Charles the Cursed',180,200,15,22,5,10,6,5,500,1,1),(4,'Phantom Acolyte',70,90,5,8,10,15,2,6,120,0,2),(5,'Stone Sentinel',110,140,12,18,0,0,10,4,160,0,2),(6,'The Veiled Oracle',260,300,12,18,18,28,7,10,850,1,2),(7,'Bloodclaw Brute',140,170,18,26,0,0,8,4,220,0,3),(8,'Hollow Knight',150,180,16,22,4,8,10,7,250,0,3),(9,'Warden Malphas',380,430,22,30,15,22,12,10,1300,1,3),(10,'Royal Guard',200,230,22,30,0,0,14,6,340,0,4),(11,'Spectral Vizier',180,210,14,20,22,32,6,14,380,0,4),(12,'The Fallen King',600,700,30,42,25,38,16,16,2500,1,4);
/*!40000 ALTER TABLE `enemies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enemy_abilities`
--

DROP TABLE IF EXISTS `enemy_abilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enemy_abilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enemy_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `damage_type` enum('PHYSICAL','MAGIC','DOT','CROWD_CONTROL') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ability_enemy` (`enemy_id`),
  CONSTRAINT `fk_ability_enemy` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enemy_abilities`
--

LOCK TABLES `enemy_abilities` WRITE;
/*!40000 ALTER TABLE `enemy_abilities` DISABLE KEYS */;
INSERT INTO `enemy_abilities` VALUES (1,1,'Pounce','Salta al jugador rompiendo guardia','PHYSICAL'),(2,2,'Backstab','Golpe sigiloso por la espalda','PHYSICAL'),(3,3,'Cursed Slash','Tajo maldito que ignora defensa','PHYSICAL'),(4,3,'Dark Whisper','Reduce stamina del jugador por 3 turnos','DOT'),(5,4,'Shadow Bolt','Proyectil de energía sombría','MAGIC'),(6,5,'Earth Shatter','Golpe en área que aturde','CROWD_CONTROL'),(7,6,'Veil of Thorns','Espinas mágicas que sangran','DOT'),(8,6,'Hex','Reduce la efectividad de cartas mágicas','CROWD_CONTROL'),(9,7,'Frenzy','Aumenta su daño tras recibir golpes','PHYSICAL'),(10,8,'Soul Drain','Drena vida del jugador','DOT'),(11,9,'Iron Chains','Inmoviliza al jugador','CROWD_CONTROL'),(12,9,'Hellfire Wave','Onda ardiente en línea recta','MAGIC'),(13,10,'Royal Cleave','Corte ascendente con espadón','PHYSICAL'),(14,11,'Mind Spike','Pico psíquico que ignora defensa física','MAGIC'),(15,12,'Throne\'s Decree','Invoca múltiples ataques en secuencia','MAGIC');
/*!40000 ALTER TABLE `enemy_abilities` ENABLE KEYS */;
UNLOCK TABLES;

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
  `ambience` varchar(100) DEFAULT NULL COMMENT 'e.g. Calm/Warm | Dark/Mystic | Bloody/Dark | Royal/Deteriorated',
  `color_palette` varchar(100) DEFAULT NULL COMMENT 'e.g. Greens/Steel Blue',
  PRIMARY KEY (`id`),
  UNIQUE KEY `floor_number` (`floor_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,0,'Forest of Beginnings','Calm/Warm','Greens/Steel Blue'),(2,1,'Mystic Courtyard','Dark/Mystic','Purple/Black'),(3,2,'Bloody Halls','Bloody/Dark','Red/Black'),(4,3,'Throne of Return','Royal/Deteriorated','Gold/Crimson');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

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
  `poor_parries` int DEFAULT '0' COMMENT 'Red zone / missed — large HP & stamina loss',
  `parries_missed` int DEFAULT '0' COMMENT 'Did not press spacebar in time',
  PRIMARY KEY (`id`),
  KEY `fk_parry_session` (`session_id`),
  CONSTRAINT `fk_parry_session` FOREIGN KEY (`session_id`) REFERENCES `room_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parry_stats`
--

LOCK TABLES `parry_stats` WRITE;
/*!40000 ALTER TABLE `parry_stats` DISABLE KEYS */;
INSERT INTO `parry_stats` VALUES (1,1,5,4,2,1),(2,2,2,3,5,4),(3,3,8,3,1,0),(4,4,10,4,0,1),(5,5,15,6,2,1),(6,6,6,5,2,1),(7,7,7,4,1,2),(8,8,3,4,4,3),(9,9,4,5,3,2),(10,10,12,4,1,0),(11,11,6,6,2,1),(12,12,18,8,3,2),(13,13,3,4,2,2),(14,14,1,2,3,5),(15,15,9,3,0,0),(16,16,14,5,1,0),(17,17,17,7,1,1),(18,18,22,9,2,1),(19,19,35,12,4,2),(20,20,2,3,4,4);
/*!40000 ALTER TABLE `parry_stats` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_cards`
--

LOCK TABLES `player_cards` WRITE;
/*!40000 ALTER TABLE `player_cards` DISABLE KEYS */;
INSERT INTO `player_cards` VALUES (1,1,1,NULL,NULL,1),(2,1,4,NULL,NULL,1),(3,1,6,2,1,1),(4,2,2,NULL,NULL,1),(5,2,4,NULL,NULL,1),(6,2,7,4,2,1),(7,2,13,3,1,1),(8,3,3,NULL,NULL,1),(9,3,5,NULL,NULL,1),(10,3,8,5,2,1),(11,3,14,5,2,1),(12,3,15,6,3,1),(13,4,1,NULL,NULL,1),(14,4,4,NULL,NULL,1),(15,5,2,NULL,NULL,1),(16,5,4,NULL,NULL,1),(17,6,3,NULL,NULL,1),(18,6,5,NULL,NULL,1),(19,6,8,9,2,1),(20,7,1,NULL,NULL,1),(21,7,4,NULL,NULL,1),(22,7,6,10,1,1),(23,7,9,10,2,1),(24,7,11,10,2,1),(25,7,15,10,3,1),(26,8,2,NULL,NULL,1),(27,8,4,NULL,NULL,1),(28,9,3,NULL,NULL,1),(29,9,5,NULL,NULL,1),(30,9,14,12,2,1),(39,12,1,NULL,NULL,1),(40,12,4,NULL,NULL,1),(41,12,6,NULL,NULL,1),(42,12,19,NULL,NULL,1),(43,12,19,NULL,NULL,1),(44,12,19,NULL,NULL,1);
/*!40000 ALTER TABLE `player_cards` ENABLE KEYS */;
UNLOCK TABLES;

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
  `total_poor_parries` int DEFAULT '0',
  `total_enemies_defeated` int DEFAULT '0',
  `total_bosses_defeated` int DEFAULT '0',
  `total_cards_collected` int DEFAULT '0',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `player_id` (`player_id`),
  CONSTRAINT `fk_global_player` FOREIGN KEY (`player_id`) REFERENCES `player_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_global_stats`
--

LOCK TABLES `player_global_stats` WRITE;
/*!40000 ALTER TABLE `player_global_stats` DISABLE KEYS */;
INSERT INTO `player_global_stats` VALUES (1,1,2,1,2100,40,20,10,25,1,3,'2026-04-03 11:35:00'),(2,2,2,0,NULL,28,18,14,18,0,4,'2026-04-04 16:10:00'),(3,3,2,1,5400,85,35,15,42,2,5,'2026-04-08 22:15:00'),(4,4,1,0,NULL,4,6,5,6,0,2,'2026-04-05 09:15:00'),(5,5,1,0,NULL,2,3,4,4,0,2,'2026-04-07 13:30:00'),(6,6,1,0,NULL,18,12,8,15,0,3,'2026-04-10 20:00:00'),(7,7,1,1,10800,95,40,8,68,4,6,'2026-04-13 00:00:00'),(8,8,1,0,NULL,6,5,4,8,0,2,'2026-04-15 17:25:00'),(9,9,1,0,NULL,30,16,6,22,1,3,'2026-04-18 15:20:00'),(10,10,0,0,NULL,0,0,0,0,0,0,'2026-03-20 19:55:00');
/*!40000 ALTER TABLE `player_global_stats` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Persistent profile that survives individual runs (roguelite meta-progression).';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_profiles`
--

LOCK TABLES `player_profiles` WRITE;
/*!40000 ALTER TABLE `player_profiles` DISABLE KEYS */;
INSERT INTO `player_profiles` VALUES (1,1,'SOLDIER',2400,5,2,'2026-03-01 10:05:00'),(2,2,'ARCHER',5600,8,0,'2026-03-02 11:20:00'),(3,3,'MAGE',12800,12,3,'2026-03-03 09:35:00'),(4,4,'SOLDIER',900,3,1,'2026-03-05 14:50:00'),(5,5,'ARCHER',150,1,4,'2026-03-07 18:25:00'),(6,6,'MAGE',4100,7,0,'2026-03-10 08:05:00'),(7,7,'SOLDIER',18900,15,1,'2026-03-12 22:15:00'),(8,8,'ARCHER',1300,4,2,'2026-03-15 16:35:00'),(9,9,'MAGE',7200,9,0,'2026-03-18 13:05:00'),(10,10,'SOLDIER',500,2,3,'2026-03-20 19:55:00'),(12,11,'SOLDIER',0,1,0,'2026-05-20 14:05:28');
/*!40000 ALTER TABLE `player_profiles` ENABLE KEYS */;
UNLOCK TABLES;

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
  `waves_survived` int DEFAULT '0' COMMENT '1–3 waves per regular room',
  `experience_gained` int DEFAULT NULL,
  `card_reward_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_session_run` (`run_id`),
  KEY `fk_session_room` (`room_id`),
  KEY `fk_session_reward` (`card_reward_id`),
  CONSTRAINT `fk_session_reward` FOREIGN KEY (`card_reward_id`) REFERENCES `cards` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_session_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `fk_session_run` FOREIGN KEY (`run_id`) REFERENCES `runs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Active deck cards are stored in active_deck_cards.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_sessions`
--

LOCK TABLES `room_sessions` WRITE;
/*!40000 ALTER TABLE `room_sessions` DISABLE KEYS */;
INSERT INTO `room_sessions` VALUES (1,1,1,'2026-04-01 10:00:00','2026-04-01 10:08:00','WIN',3,120,NULL),(2,1,2,'2026-04-01 10:09:00','2026-04-01 10:18:00','LOSS',2,60,NULL),(3,2,1,'2026-04-03 11:00:00','2026-04-03 11:09:00','WIN',3,140,NULL),(4,2,2,'2026-04-03 11:10:00','2026-04-03 11:20:00','WIN',3,170,6),(5,2,3,'2026-04-03 11:22:00','2026-04-03 11:35:00','WIN',1,500,13),(6,3,1,'2026-04-02 14:00:00','2026-04-02 14:08:00','WIN',3,130,NULL),(7,3,2,'2026-04-02 14:09:00','2026-04-02 14:18:00','WIN',3,160,NULL),(8,3,3,'2026-04-02 14:20:00','2026-04-02 14:25:00','LOSS',1,80,NULL),(9,5,1,'2026-04-03 18:00:00','2026-04-03 18:12:00','WIN',3,150,NULL),(10,5,3,'2026-04-03 18:30:00','2026-04-03 18:50:00','WIN',1,520,8),(11,5,4,'2026-04-03 19:00:00','2026-04-03 19:10:00','WIN',3,200,NULL),(12,5,6,'2026-04-03 19:15:00','2026-04-03 19:30:00','WIN',1,870,14),(13,7,1,'2026-04-05 09:00:00','2026-04-05 09:07:00','WIN',3,110,NULL),(14,7,2,'2026-04-05 09:08:00','2026-04-05 09:15:00','LOSS',1,30,NULL),(15,10,1,'2026-04-12 21:00:00','2026-04-12 21:10:00','WIN',3,160,NULL),(16,10,3,'2026-04-12 21:25:00','2026-04-12 21:45:00','WIN',1,530,6),(17,10,6,'2026-04-12 22:30:00','2026-04-12 22:55:00','WIN',1,880,9),(18,10,9,'2026-04-12 23:20:00','2026-04-12 23:42:00','WIN',1,1340,11),(19,10,12,'2026-04-12 23:50:00','2026-04-13 00:00:00','WIN',1,2520,15),(20,8,3,'2026-04-07 13:22:00','2026-04-07 13:30:00','LOSS',1,70,NULL);
/*!40000 ALTER TABLE `room_sessions` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,1,0,'forest_0.png'),(2,1,2,0,'forest_0.png'),(3,1,3,1,'forest_0.png'),(4,2,1,0,'courtyard_1_1.png'),(5,2,2,0,'main entrance_1_2.png'),(6,2,3,1,'stairs purple_1_3.png'),(7,3,1,0,'paintings room_2_1.png'),(8,3,2,0,'dining room_2_2.png'),(9,3,3,1,'stairs red_2_3.png'),(10,4,1,0,'library_3_1.png'),(11,4,2,0,'bedroom_3_2.png'),(12,4,3,1,'throne room_3_3.png');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `runs`
--

LOCK TABLES `runs` WRITE;
/*!40000 ALTER TABLE `runs` DISABLE KEYS */;
INSERT INTO `runs` VALUES (1,1,'2026-04-01 10:00:00','2026-04-01 10:18:00',1080,1,2,0,1,NULL),(2,1,'2026-04-03 11:00:00','2026-04-03 11:35:00',2100,1,3,1,NULL,13),(3,2,'2026-04-02 14:00:00','2026-04-02 14:25:00',1500,1,3,0,3,13),(4,2,'2026-04-04 15:00:00','2026-04-04 16:10:00',4200,2,1,0,4,NULL),(5,3,'2026-04-03 18:00:00','2026-04-03 19:30:00',5400,2,3,1,NULL,14),(6,3,'2026-04-08 20:00:00','2026-04-08 22:15:00',8100,3,3,0,9,15),(7,4,'2026-04-05 09:00:00','2026-04-05 09:15:00',900,1,2,0,2,NULL),(8,5,'2026-04-07 13:00:00','2026-04-07 13:30:00',1800,1,3,0,3,NULL),(9,6,'2026-04-10 19:00:00','2026-04-10 20:00:00',3600,2,2,0,5,NULL),(10,7,'2026-04-12 21:00:00','2026-04-13 00:00:00',10800,3,3,1,NULL,15),(11,8,'2026-04-15 17:00:00','2026-04-15 17:25:00',1500,1,3,0,3,NULL),(12,9,'2026-04-18 14:00:00','2026-04-18 15:20:00',4800,2,3,0,6,14);
/*!40000 ALTER TABLE `runs` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_games`
--

LOCK TABLES `saved_games` WRITE;
/*!40000 ALTER TABLE `saved_games` DISABLE KEYS */;
INSERT INTO `saved_games` VALUES (3,11,1,'Cards Test',12,NULL,'2026-05-20 14:05:28','2026-05-20 14:05:28');
/*!40000 ALTER TABLE `saved_games` ENABLE KEYS */;
UNLOCK TABLES;

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
  `wave_number` int DEFAULT NULL COMMENT '1–3',
  `defeated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sed_session` (`session_id`),
  KEY `fk_sed_enemy` (`enemy_id`),
  CONSTRAINT `fk_sed_enemy` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`),
  CONSTRAINT `fk_sed_session` FOREIGN KEY (`session_id`) REFERENCES `room_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_enemies_defeated`
--

LOCK TABLES `session_enemies_defeated` WRITE;
/*!40000 ALTER TABLE `session_enemies_defeated` DISABLE KEYS */;
INSERT INTO `session_enemies_defeated` VALUES (1,1,1,1,'2026-04-01 10:02:00'),(2,1,1,2,'2026-04-01 10:04:00'),(3,1,2,3,'2026-04-01 10:07:00'),(4,2,1,1,'2026-04-01 10:11:00'),(5,2,2,2,'2026-04-01 10:14:00'),(6,3,1,1,'2026-04-03 11:03:00'),(7,3,1,2,'2026-04-03 11:05:00'),(8,3,2,3,'2026-04-03 11:08:00'),(9,4,2,1,'2026-04-03 11:12:00'),(10,4,2,2,'2026-04-03 11:15:00'),(11,4,1,3,'2026-04-03 11:19:00'),(12,5,3,1,'2026-04-03 11:34:00'),(13,6,1,1,'2026-04-02 14:02:00'),(14,6,2,2,'2026-04-02 14:05:00'),(15,6,1,3,'2026-04-02 14:07:00'),(16,7,2,1,'2026-04-02 14:11:00'),(17,7,1,2,'2026-04-02 14:14:00'),(18,7,2,3,'2026-04-02 14:17:00'),(19,9,1,1,'2026-04-03 18:03:00'),(20,9,1,2,'2026-04-03 18:07:00'),(21,9,2,3,'2026-04-03 18:11:00'),(22,10,3,1,'2026-04-03 18:48:00'),(23,11,4,1,'2026-04-03 19:03:00'),(24,11,5,2,'2026-04-03 19:06:00'),(25,11,4,3,'2026-04-03 19:09:00'),(26,12,6,1,'2026-04-03 19:29:00'),(27,15,1,1,'2026-04-12 21:03:00'),(28,15,2,2,'2026-04-12 21:06:00'),(29,15,1,3,'2026-04-12 21:09:00'),(30,16,3,1,'2026-04-12 21:44:00'),(31,17,6,1,'2026-04-12 22:54:00'),(32,18,9,1,'2026-04-12 23:41:00'),(33,19,12,1,'2026-04-12 23:59:00');
/*!40000 ALTER TABLE `session_enemies_defeated` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'kira_wolf','kira@return.game','hash_001_kw','2026-03-01 10:00:00',0,NULL),(2,'darius_03','darius@return.game','hash_002_dr','2026-03-02 11:15:00',0,NULL),(3,'mira_shade','mira@return.game','hash_003_ms','2026-03-03 09:30:00',0,NULL),(4,'valen_iron','valen@return.game','hash_004_vi','2026-03-05 14:45:00',0,NULL),(5,'nyx_runner','nyx@return.game','hash_005_nr','2026-03-07 18:20:00',0,NULL),(6,'elys_oak','elys@return.game','hash_006_eo','2026-03-10 08:00:00',0,NULL),(7,'thane_grim','thane@return.game','hash_007_tg','2026-03-12 22:10:00',0,NULL),(8,'selene_v','selene@return.game','hash_008_sv','2026-03-15 16:30:00',0,NULL),(9,'corvo_x','corvo@return.game','hash_009_cx','2026-03-18 13:00:00',0,NULL),(10,'ilya_starr','ilya@return.game','hash_010_is','2026-03-20 19:50:00',0,NULL),(11,'OMEGA','juanbrinez1111@gmail.com','$2b$10$cq4cc4RvU8hFnH6rePV87eG7v7QR4MMQhr7ftyxjQwfSztcHc8lY6','2026-05-17 22:16:45',0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-29  8:42:43
