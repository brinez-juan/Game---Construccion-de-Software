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
-- Dumping data for table `active_deck_cards`
--

LOCK TABLES `active_deck_cards` WRITE;
/*!40000 ALTER TABLE `active_deck_cards` DISABLE KEYS */;
INSERT INTO `active_deck_cards` VALUES (1,1,1,1),(2,1,4,2),(3,2,1,1),(4,2,4,2),(5,3,1,1),(6,3,4,2),(8,4,1,1),(9,4,4,2),(11,5,1,1),(12,5,4,2),(14,6,2,1),(15,6,4,2),(16,7,2,1),(17,7,4,2),(19,8,2,1),(20,8,4,2),(22,9,3,1),(23,9,5,2),(24,10,3,1),(25,10,5,2),(27,11,3,1),(28,11,5,2),(30,12,3,1),(31,12,5,2),(33,13,1,1),(34,13,4,2),(35,14,1,1),(36,14,4,2),(37,15,1,1),(38,15,4,2),(42,16,1,1),(43,16,4,2),(47,17,1,1),(48,17,4,2),(53,18,4,2),(57,19,4,2),(60,20,2,1),(61,20,4,2),(839,200,1,1),(840,200,2,2),(841,200,5,3),(842,201,1,1),(843,201,2,2),(844,201,5,3),(845,201,23,4),(846,202,1,1),(847,202,2,2),(848,202,5,3),(849,203,1,1),(850,203,2,2),(851,203,5,3),(852,204,1,1),(853,204,2,2),(854,204,5,3),(855,205,1,1),(856,205,2,2),(857,205,5,3),(858,206,1,1),(859,206,2,2),(860,206,5,3),(861,207,1,1),(862,207,2,2),(863,207,5,3),(864,208,1,1),(865,208,2,2),(866,208,5,3),(867,209,1,1),(868,209,2,2),(869,209,5,3),(870,209,21,4),(876,211,1,1),(877,211,2,2),(878,211,5,3),(879,211,21,4),(880,212,1,1),(881,212,2,2),(882,212,5,3),(883,212,21,4),(884,213,1,1),(885,213,2,2),(886,213,5,3),(887,213,21,4),(888,214,1,1),(889,214,2,2),(890,214,5,3),(891,214,21,4),(892,215,1,1),(893,215,2,2),(894,215,5,3),(895,215,21,4),(896,216,1,1),(897,216,2,2),(898,216,5,3),(899,216,21,4),(900,216,37,5),(901,217,1,1),(902,217,2,2),(903,217,5,3),(904,217,21,4),(905,217,37,5),(906,218,1,1),(907,218,2,2),(908,218,5,3),(909,218,21,4),(910,218,37,5),(911,219,1,1),(912,219,2,2),(913,219,5,3),(914,219,37,4),(918,221,1,1),(919,221,2,2),(920,221,5,3),(921,221,37,4),(922,222,1,1),(923,222,2,2),(924,222,5,3),(925,222,37,4),(926,223,1,1),(927,223,2,2),(928,223,5,3),(929,223,37,4),(930,224,1,1),(931,224,2,2),(932,224,5,3),(933,224,37,4),(942,227,1,1),(943,227,2,2),(944,227,5,3),(945,227,37,4),(946,228,1,1),(947,228,2,2),(948,228,5,3),(949,228,37,4),(950,229,1,1),(951,229,2,2),(952,229,5,3),(953,229,37,4),(954,230,1,1),(955,230,2,2),(956,230,5,3),(957,230,37,4),(958,230,21,5),(959,231,1,1),(960,231,2,2),(961,231,5,3),(962,231,37,4),(963,231,22,5),(964,232,1,1),(965,232,2,2),(966,232,5,3),(967,232,37,4),(968,232,22,5),(969,233,1,1),(970,233,2,2),(971,233,5,3),(972,233,37,4),(973,233,22,5),(974,234,1,1),(975,234,2,2),(976,234,5,3),(977,234,37,4),(978,234,22,5),(979,235,1,1),(980,235,2,2),(981,235,5,3),(982,235,37,4),(983,235,22,5),(988,237,1,1),(989,237,2,2),(990,237,5,3),(991,237,37,4),(992,237,22,5),(993,238,1,1),(994,238,2,2),(995,238,5,3),(996,238,37,4),(997,238,22,5),(998,239,1,1),(999,239,2,2),(1000,239,5,3),(1001,239,37,4),(1002,239,22,5),(1007,241,1,1),(1008,241,2,2),(1009,241,5,3),(1010,241,37,4),(1011,241,22,5),(1012,242,1,1),(1013,242,2,2),(1014,242,5,3),(1015,242,37,4),(1016,242,22,5),(1083,259,1,1),(1084,259,2,2),(1085,259,5,3),(1086,260,1,1),(1087,260,2,2),(1088,260,5,3),(1089,261,1,1),(1090,261,2,2),(1091,261,5,3),(1092,261,23,4),(1093,262,1,1),(1094,262,2,2),(1095,262,5,3),(1096,262,23,4),(1097,263,1,1),(1098,263,2,2),(1099,263,5,3),(1100,263,23,4),(1101,264,1,1),(1102,264,2,2),(1103,264,5,3),(1104,264,32,4),(1105,265,1,1),(1106,265,2,2),(1107,265,5,3),(1108,265,32,4),(1109,266,1,1),(1110,266,2,2),(1111,266,5,3),(1112,266,32,4),(1113,266,21,5),(1114,267,1,1),(1115,267,2,2),(1116,267,5,3),(1117,267,32,4),(1118,267,21,5),(1119,268,1,1),(1120,268,2,2),(1121,268,5,3),(1122,268,32,4),(1123,268,21,5),(1124,269,1,1),(1125,269,2,2),(1126,269,5,3),(1127,269,32,4),(1128,269,21,5),(1129,270,1,1),(1130,270,2,2),(1131,270,5,3),(1132,270,32,4),(1133,270,21,5),(1134,271,1,1),(1135,271,2,2),(1136,271,5,3),(1137,271,32,4),(1138,271,21,5),(1139,272,1,1),(1140,272,2,2),(1141,272,5,3),(1142,272,32,4),(1143,272,21,5),(1144,273,1,1),(1145,273,37,2),(1146,273,5,3),(1147,273,32,4),(1148,273,21,5),(1149,274,1,1),(1150,274,37,2),(1151,274,5,3),(1152,274,32,4),(1153,274,21,5),(1154,275,1,1),(1155,275,37,2),(1156,275,5,3),(1157,275,32,4),(1158,275,21,5),(1159,276,1,1),(1160,276,37,2),(1161,276,5,3),(1162,276,32,4),(1163,276,21,5),(1164,277,22,1),(1165,277,37,2),(1166,277,5,3),(1167,277,32,4),(1168,277,21,5),(1169,278,22,1),(1170,278,37,2),(1171,278,5,3),(1172,278,32,4),(1173,278,21,5),(1174,279,22,1),(1175,279,37,2),(1176,279,5,3),(1177,279,32,4),(1178,279,21,5),(1179,280,22,1),(1180,280,37,2),(1181,280,5,3),(1182,280,1,4),(1183,280,21,5),(1184,281,1,1),(1185,281,2,2),(1186,281,5,3),(1187,281,32,4),(1188,281,21,5),(1189,282,1,1),(1190,282,2,2),(1191,282,5,3),(1192,282,32,4),(1193,282,21,5),(1194,283,1,1),(1195,283,2,2),(1196,283,5,3),(1197,283,32,4),(1198,283,21,5),(1199,284,1,1),(1200,284,37,2),(1201,284,5,3),(1202,284,32,4),(1203,284,21,5),(1204,285,1,1),(1205,285,2,2),(1206,285,5,3),(1207,286,1,1),(1208,286,2,2),(1209,286,5,3),(1210,286,23,4);
/*!40000 ALTER TABLE `active_deck_cards` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_active_deck_cards_bi_maxsize` BEFORE INSERT ON `active_deck_cards` FOR EACH ROW BEGIN
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
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (2,2,3,4,1,5,8,'2026-04-02 10:00:00'),(3,3,1,3,10,3,2,'2026-04-03 10:00:00'),(4,4,4,4,1,2,1,'2026-04-05 10:00:00'),(5,5,1,1,1,1,2,'2026-04-07 10:00:00'),(6,6,1,2,7,2,1,'2026-04-10 10:00:00'),(7,7,10,9,1,8,3,'2026-04-12 10:00:00'),(8,8,2,3,1,3,5,'2026-04-15 10:00:00'),(9,9,1,4,8,3,2,'2026-04-18 10:00:00'),(10,10,3,3,1,2,1,'2026-04-20 10:00:00'),(64,64,7,2,0,4,1,'2026-06-07 14:17:08'),(69,69,6,2,1,5,1,'2026-06-08 13:35:56'),(70,70,3,2,0,2,1,'2026-06-08 23:44:12');
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (1,'Vicious Sword','Corte rápido con una espada afilada.','ATTACK_PHYSIC',12,9,'COMMON','vicious_sword','STRENGTH',1.00,'STRENGTH',1,0,NULL),(2,'Battle Axe','Golpe pesado a dos manos con un hacha de guerra.','ATTACK_PHYSIC',30,22,'UNCOMMON','battle_axe','STRENGTH',1.40,'STRENGTH',3,0,NULL),(3,'Hunter Bow','Disparo certero con un arco de cazador.','ATTACK_PHYSIC',11,9,'COMMON','hunter_bow','DEXTERITY',1.10,'DEXTERITY',1,0,NULL),(4,'Fireball','Proyectil ígneo que estalla al impactar.','AOE_MAGIC',22,10,'UNCOMMON','fireball','INTELLIGENCE',1.00,'INTELLIGENCE',1,0,NULL),(5,'Knight Shield','Defensa física tras un escudo de caballero.','DEFEND_PHYSIC',0,0,'COMMON','knight_shield','ENDURANCE',1.00,'ENDURANCE',1,0,NULL),(6,'Dark Sword','Corte pesado con una espada maldita','ATTACK_PHYSIC',20,16,'UNCOMMON','dark_sword','STRENGTH',1.30,'STRENGTH',4,0,NULL),(21,'Rusted Longsword','A battered knightly blade. Reliable, simple, and inexpensive to play.','ATTACK_PHYSIC',10,8,'COMMON','rusted_longsword','STRENGTH',0.90,'STRENGTH',1,0,1),(22,'Dark Ward','Una barrera oscura que absorbe un golpe mágico.','DEFEND_MAGIC',0,0,'COMMON','dark_shield','INTELLIGENCE',1.00,'INTELLIGENCE',1,0,1),(23,'Mushroomcap Bonk','A deceptively heavy fungal club. A cheap early-game strike inspired by the forest critter.','ATTACK_PHYSIC',9,7,'COMMON','mushroom_bonk','STRENGTH',0.80,'STRENGTH',1,0,0),(24,'Pestilent Hook-Flail','A spiked flail recovered from a masked scavenger. Its description can later support a poison status effect.','ATTACK_PHYSIC',13,10,'COMMON','hooked_flail','DEXTERITY',1.10,'DEXTERITY',2,0,10),(25,'Crystal Knuckle','A shard-covered gauntlet carved from a crystal gargoyle. Heavy enough to crack armor.','ATTACK_PHYSIC',14,11,'COMMON','crystal_knuckle','STRENGTH',1.00,'STRENGTH',2,0,9),(26,'Ravenwood Crook','A crooked staff crowned by a crimson familiar. A basic occult projectile weapon.','ATTACK_MAGIC',16,12,'UNCOMMON','ravenwood_staff','INTELLIGENCE',1.20,'INTELLIGENCE',2,0,5),(27,'Sentinel Twinblades','Matched silver blades with gold trim. Fast, elegant, and suited to dexterity builds.','ATTACK_PHYSIC',18,13,'UNCOMMON','sentinel_twinblades','DEXTERITY',1.25,'DEXTERITY',3,0,11),(28,'Orcish Meat-Cleaver','An oversized butcher weapon built for raw force rather than finesse.','ATTACK_PHYSIC',24,18,'UNCOMMON','orc_club','STRENGTH',1.30,'STRENGTH',4,0,7),(29,'Pale Lancer Pike','A long spear used by an armored revenant. Excellent reach with a demanding stamina cost.','AOE_PHYSIC',24,11,'UNCOMMON','lance_pike','DEXTERITY',1.00,'DEXTERITY',3,0,2),(30,'Moonlit Crescent Blade','A curved ritual blade with a pale edge. It feels halfway between a duelist weapon and a ceremonial relic.','ATTACK_PHYSIC',16,12,'UNCOMMON','moonlit_blade','DEXTERITY',1.20,'DEXTERITY',3,0,3),(31,'Hidden Execution Axe','A brutal axe drawn from beneath a horned warrior\'s cloak. Slow, direct, and punishing.','ATTACK_PHYSIC',36,28,'RARE','execution_axe','STRENGTH',1.50,'STRENGTH',5,1,4),(32,'Herald Eye-Wand','A one-eyed focus wrapped in violet cloth. Its future effect could mark enemies for amplified damage.','ATTACK_MAGIC',22,16,'RARE','eye_wand','INTELLIGENCE',1.30,'INTELLIGENCE',4,0,3),(33,'Rotten Wraith Chain','A spectral chain soaked in grave-cold residue. Designed as a mid-game magic weapon with a decay theme.','AOE_MAGIC',28,13,'RARE','rotted_chain','INTELLIGENCE',1.10,'INTELLIGENCE',4,0,10),(34,'Crystalheart Maul','A dense hammer assembled from golden crystal growths. Expensive, but excellent against durable enemies.','ATTACK_PHYSIC',34,26,'RARE','crystal_maul','STRENGTH',1.50,'STRENGTH',5,0,9),(35,'Draconic Rose Staff','A living crimson staff wielded by a draconic maiden. A premium spell weapon suited to burn-themed effects.','ATTACK_MAGIC',32,26,'EPIC','draconic_staff','INTELLIGENCE',1.60,'INTELLIGENCE',6,1,8),(37,'Galahad Twin Axes','A paired set of ceremonial war axes taken from the horned champion. Built for a strength-focused boss reward.','ATTACK_PHYSIC',40,32,'EPIC','twin_axes','STRENGTH',1.60,'STRENGTH',6,1,4),(38,'Sentinel Sunblades','The radiant upgrade to the sentinel\'s matched weapons. Fast enough for a future multi-hit effect.','ATTACK_PHYSIC',26,18,'EPIC','sentinel_sunblades','DEXTERITY',1.40,'DEXTERITY',5,0,11),(39,'Giant Shield','A giant Iron shield that protects from any attack','DEFEND_PHYSIC',0,0,'RARE','giant_shield','ENDURANCE',1.20,'ENDURANCE',5,0,6),(41,'Health Potion','Restores 40% of max health. One use per battle.','HEALING',0,40,'COMMON','health_potion',NULL,0.00,NULL,0,0,NULL),(42,'Stamina Potion','Restores 50% of max stamina. One use per battle.','RECOVER_STAMINA',0,50,'COMMON','stamina_potion',NULL,0.00,NULL,0,0,NULL);
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
  `sprite` varchar(100) DEFAULT NULL COMMENT 'Bare filename in Assets/Sprites/characters',
  PRIMARY KEY (`id`),
  KEY `fk_enemy_floor` (`floor_id`),
  CONSTRAINT `fk_enemy_floor` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Special abilities are stored in enemy_abilities.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enemies`
--

LOCK TABLES `enemies` WRITE;
/*!40000 ALTER TABLE `enemies` DISABLE KEYS */;
INSERT INTO `enemies` VALUES (0,'Rick, Forest Critter',45,55,8,11,0,0,3,1,60,1,1,'forest_critter_0.png'),(1,'Corrupted Knight',70,85,13,16,0,0,10,2,90,0,2,'corrupt_knight_1.png'),(2,'Pale Lancer',65,80,14,17,0,0,6,3,95,0,2,'pale_lancer_1.png'),(3,'Hooded Herald',60,75,0,0,13,16,2,9,100,0,2,'hooded_herald_1.png'),(4,'Galahad of the Hidden Axe',190,210,20,24,0,0,12,5,500,1,2,'galahad_hidden_axe_1.png'),(5,'Bog Witch',95,115,0,0,19,23,4,12,170,0,3,'bog_witch_2.png'),(6,'Shield-maiden wraith',120,140,13,16,12,15,11,10,210,0,3,'shield_maiden_2.png'),(7,'Marauder Orc',130,150,20,24,0,0,9,3,220,0,3,'marauder_orc_2.png'),(8,'Isolde, Draconic Maiden',300,300,8,11,24,28,9,16,800,1,3,'Isolde_draconic_maiden_2.png'),(9,'Crystal Gargoyle',180,205,22,26,0,0,18,5,320,0,4,'crystal_gargoyle_3.png'),(10,'Rotten Spirit',170,195,0,0,24,28,5,14,350,0,4,'rotten_spirit_3.png'),(11,'Ancient Sentinel',220,250,20,24,14,18,13,11,420,0,4,'ancient_sentinel_3.png'),(12,'Eldric the Forlorn King',460,500,28,34,16,20,18,12,1200,1,4,'eldric_king_3.png'),(13,'Lysara the Veiled Sorcer',480,520,9,12,32,38,12,20,1500,1,4,'lysara_sorcerer_3.png');
/*!40000 ALTER TABLE `enemies` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,0,'Forest of Beginnings'),(2,1,'Mystic Courtyard'),(3,2,'Bloody Halls'),(4,3,'Throne of Return');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `parry_stats`
--

LOCK TABLES `parry_stats` WRITE;
/*!40000 ALTER TABLE `parry_stats` DISABLE KEYS */;
INSERT INTO `parry_stats` VALUES (1,1,5,4,1),(2,2,2,3,4),(3,3,8,3,0),(4,4,10,4,1),(5,5,15,6,1),(6,6,6,5,1),(7,7,7,4,2),(8,8,3,4,3),(9,9,4,5,2),(10,10,12,4,0),(11,11,6,6,1),(12,12,18,8,2),(13,13,3,4,2),(14,14,1,2,5),(15,15,9,3,0),(16,16,14,5,0),(17,17,17,7,1),(18,18,22,9,1),(19,19,35,12,2),(20,20,2,3,4),(21,285,5,0,1),(22,286,0,1,7);
/*!40000 ALTER TABLE `parry_stats` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_parry_ai_count` AFTER INSERT ON `parry_stats` FOR EACH ROW BEGIN
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
-- Dumping data for table `player_cards`
--

LOCK TABLES `player_cards` WRITE;
/*!40000 ALTER TABLE `player_cards` DISABLE KEYS */;
INSERT INTO `player_cards` VALUES (1,1,1,NULL,NULL,1),(2,1,4,NULL,NULL,1),(4,2,2,NULL,NULL,1),(5,2,4,NULL,NULL,1),(8,3,3,NULL,NULL,1),(9,3,5,NULL,NULL,1),(13,4,1,NULL,NULL,1),(14,4,4,NULL,NULL,1),(15,5,2,NULL,NULL,1),(16,5,4,NULL,NULL,1),(17,6,3,NULL,NULL,1),(18,6,5,NULL,NULL,1),(20,7,1,NULL,NULL,1),(21,7,4,NULL,NULL,1),(26,8,2,NULL,NULL,1),(27,8,4,NULL,NULL,1),(28,9,3,NULL,NULL,1),(29,9,5,NULL,NULL,1),(318,64,1,NULL,NULL,1),(319,64,2,NULL,NULL,1),(320,64,5,NULL,NULL,1),(326,64,37,72,1,1),(329,64,22,74,1,1),(359,69,1,NULL,NULL,1),(360,69,2,NULL,NULL,1),(361,69,5,NULL,NULL,1),(366,69,32,82,1,1),(368,69,21,84,1,1),(376,69,30,86,1,0),(377,69,29,86,1,0),(378,69,22,86,1,0),(379,69,37,86,1,0),(380,70,1,NULL,NULL,1),(381,70,2,NULL,NULL,1),(382,70,5,NULL,NULL,1);
/*!40000 ALTER TABLE `player_cards` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_player_cards_ai_count` AFTER INSERT ON `player_cards` FOR EACH ROW BEGIN
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
-- Dumping data for table `player_global_stats`
--

LOCK TABLES `player_global_stats` WRITE;
/*!40000 ALTER TABLE `player_global_stats` DISABLE KEYS */;
INSERT INTO `player_global_stats` VALUES (1,1,2,1,2100,40,20,0,0,2,'2026-06-08 22:20:15'),(2,2,2,0,NULL,16,13,0,0,2,'2026-06-08 22:20:15'),(3,3,2,1,5400,40,23,0,0,2,'2026-06-08 22:20:15'),(4,4,1,0,NULL,4,6,0,0,2,'2026-06-08 22:20:15'),(5,5,1,0,NULL,2,3,0,0,2,'2026-06-08 22:20:15'),(6,6,1,0,NULL,0,0,0,0,2,'2026-06-08 22:20:15'),(7,7,1,1,10800,97,36,0,0,2,'2026-06-08 22:20:15'),(8,8,1,0,NULL,0,0,0,0,2,'2026-06-08 22:20:15'),(9,9,1,0,NULL,0,0,0,0,2,'2026-06-08 22:20:15'),(10,10,0,0,NULL,0,0,0,0,0,'2026-03-20 19:55:00'),(12,64,5,0,NULL,0,0,0,0,5,'2026-06-08 22:20:15'),(13,69,5,0,NULL,0,0,0,0,9,'2026-06-08 22:20:15'),(14,70,1,0,NULL,5,1,0,0,4,'2026-06-08 23:46:16');
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
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Persistent profile that survives individual runs (roguelite meta-progression).';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_profiles`
--

LOCK TABLES `player_profiles` WRITE;
/*!40000 ALTER TABLE `player_profiles` DISABLE KEYS */;
INSERT INTO `player_profiles` VALUES (1,1,'SOLDIER',2400,5,2,'2026-03-01 10:05:00'),(2,2,'ARCHER',5600,8,0,'2026-03-02 11:20:00'),(3,3,'MAGE',12800,12,3,'2026-03-03 09:35:00'),(4,4,'SOLDIER',900,3,1,'2026-03-05 14:50:00'),(5,5,'ARCHER',150,1,4,'2026-03-07 18:25:00'),(6,6,'MAGE',4100,7,0,'2026-03-10 08:05:00'),(7,7,'SOLDIER',18900,15,1,'2026-03-12 22:15:00'),(8,8,'ARCHER',1300,4,2,'2026-03-15 16:35:00'),(9,9,'MAGE',7200,9,0,'2026-03-18 13:05:00'),(10,10,'SOLDIER',500,2,3,'2026-03-20 19:55:00'),(64,11,'SOLDIER',3090,7,0,'2026-06-07 12:55:42'),(69,11,'SOLDIER',4710,8,0,'2026-06-08 13:07:00'),(70,11,'SOLDIER',120,2,1,'2026-06-08 23:44:12');
/*!40000 ALTER TABLE `player_profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_player_profiles_ai_bootstrap` AFTER INSERT ON `player_profiles` FOR EACH ROW BEGIN
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
-- Dumping data for table `room_sessions`
--

LOCK TABLES `room_sessions` WRITE;
/*!40000 ALTER TABLE `room_sessions` DISABLE KEYS */;
INSERT INTO `room_sessions` VALUES (1,1,1,'2026-04-01 10:00:00','2026-04-01 10:08:00','WIN',120,NULL),(2,1,2,'2026-04-01 10:09:00','2026-04-01 10:18:00','LOSS',60,NULL),(3,2,1,'2026-04-03 11:00:00','2026-04-03 11:09:00','WIN',140,NULL),(4,2,2,'2026-04-03 11:10:00','2026-04-03 11:20:00','WIN',170,NULL),(5,2,3,'2026-04-03 11:22:00','2026-04-03 11:35:00','WIN',500,NULL),(6,3,1,'2026-04-02 14:00:00','2026-04-02 14:08:00','WIN',130,NULL),(7,3,2,'2026-04-02 14:09:00','2026-04-02 14:18:00','WIN',160,NULL),(8,3,3,'2026-04-02 14:20:00','2026-04-02 14:25:00','LOSS',80,NULL),(9,5,1,'2026-04-03 18:00:00','2026-04-03 18:12:00','WIN',150,NULL),(10,5,3,'2026-04-03 18:30:00','2026-04-03 18:50:00','WIN',520,NULL),(11,5,4,'2026-04-03 19:00:00','2026-04-03 19:10:00','WIN',200,NULL),(12,5,6,'2026-04-03 19:15:00','2026-04-03 19:30:00','WIN',870,NULL),(13,7,1,'2026-04-05 09:00:00','2026-04-05 09:07:00','WIN',110,NULL),(14,7,2,'2026-04-05 09:08:00','2026-04-05 09:15:00','LOSS',30,NULL),(15,10,1,'2026-04-12 21:00:00','2026-04-12 21:10:00','WIN',160,NULL),(16,10,3,'2026-04-12 21:25:00','2026-04-12 21:45:00','WIN',530,NULL),(17,10,6,'2026-04-12 22:30:00','2026-04-12 22:55:00','WIN',880,NULL),(18,10,9,'2026-04-12 23:20:00','2026-04-12 23:42:00','WIN',1340,NULL),(19,10,12,'2026-04-12 23:50:00','2026-04-13 00:00:00','WIN',2520,NULL),(20,8,3,'2026-04-07 13:22:00','2026-04-07 13:30:00','LOSS',70,NULL),(200,71,1,'2026-06-07 12:55:53',NULL,NULL,NULL,NULL),(201,71,4,'2026-06-07 12:58:15',NULL,NULL,NULL,NULL),(202,72,4,'2026-06-07 13:18:12',NULL,NULL,NULL,NULL),(203,72,4,'2026-06-07 13:18:37',NULL,NULL,NULL,NULL),(204,72,4,'2026-06-07 13:18:44',NULL,NULL,NULL,NULL),(205,72,4,'2026-06-07 13:19:51',NULL,NULL,NULL,NULL),(206,72,4,'2026-06-07 13:20:32',NULL,NULL,NULL,NULL),(207,72,4,'2026-06-07 13:22:00',NULL,NULL,NULL,NULL),(208,72,5,'2026-06-07 13:22:25',NULL,NULL,NULL,NULL),(209,72,6,'2026-06-07 13:25:00',NULL,NULL,NULL,NULL),(211,72,6,'2026-06-07 14:02:01',NULL,NULL,NULL,NULL),(212,72,5,'2026-06-07 14:03:10',NULL,NULL,NULL,NULL),(213,72,4,'2026-06-07 14:06:21',NULL,NULL,NULL,NULL),(214,72,5,'2026-06-07 14:06:47',NULL,NULL,NULL,NULL),(215,72,6,'2026-06-07 14:07:11',NULL,NULL,NULL,NULL),(216,72,7,'2026-06-07 14:10:41',NULL,NULL,NULL,NULL),(217,72,8,'2026-06-07 14:13:23',NULL,NULL,NULL,NULL),(218,72,9,'2026-06-07 14:17:09',NULL,NULL,NULL,NULL),(219,73,4,'2026-06-07 14:18:41',NULL,NULL,NULL,NULL),(221,74,4,'2026-06-07 14:29:13',NULL,NULL,NULL,NULL),(222,74,4,'2026-06-07 14:32:40',NULL,NULL,NULL,NULL),(223,74,5,'2026-06-07 14:33:06',NULL,NULL,NULL,NULL),(224,74,6,'2026-06-07 14:35:39',NULL,NULL,NULL,NULL),(227,74,4,'2026-06-07 14:36:25',NULL,NULL,NULL,NULL),(228,74,6,'2026-06-07 14:36:43',NULL,NULL,NULL,NULL),(229,74,7,'2026-06-07 14:38:53',NULL,NULL,NULL,NULL),(230,74,7,'2026-06-07 14:39:31',NULL,NULL,NULL,NULL),(231,76,4,'2026-06-07 14:44:56',NULL,NULL,NULL,NULL),(232,76,4,'2026-06-07 14:45:03',NULL,NULL,NULL,NULL),(233,76,4,'2026-06-07 14:45:09',NULL,NULL,NULL,NULL),(234,76,4,'2026-06-07 14:45:49',NULL,NULL,NULL,NULL),(235,76,4,'2026-06-07 14:47:32',NULL,NULL,NULL,NULL),(237,76,4,'2026-06-07 14:48:24',NULL,NULL,NULL,NULL),(238,76,4,'2026-06-07 14:48:38',NULL,NULL,NULL,NULL),(239,76,4,'2026-06-07 14:48:52',NULL,NULL,NULL,NULL),(241,76,4,'2026-06-07 14:49:04',NULL,NULL,NULL,NULL),(242,76,4,'2026-06-07 14:49:12',NULL,NULL,NULL,NULL),(259,82,1,'2026-06-08 13:07:03',NULL,NULL,NULL,NULL),(260,82,4,'2026-06-08 13:07:53',NULL,NULL,NULL,NULL),(261,82,5,'2026-06-08 13:11:17',NULL,NULL,NULL,NULL),(262,82,6,'2026-06-08 13:13:01',NULL,NULL,NULL,NULL),(263,82,6,'2026-06-08 13:13:22',NULL,NULL,NULL,NULL),(264,83,4,'2026-06-08 13:15:55',NULL,NULL,NULL,NULL),(265,84,4,'2026-06-08 13:16:53',NULL,NULL,NULL,NULL),(266,84,5,'2026-06-08 13:17:57',NULL,NULL,NULL,NULL),(267,84,5,'2026-06-08 13:18:14',NULL,NULL,NULL,NULL),(268,84,6,'2026-06-08 13:18:58',NULL,NULL,NULL,NULL),(269,85,4,'2026-06-08 13:20:46',NULL,NULL,NULL,NULL),(270,85,5,'2026-06-08 13:21:47',NULL,NULL,NULL,NULL),(271,85,6,'2026-06-08 13:22:21',NULL,NULL,NULL,NULL),(272,85,7,'2026-06-08 13:23:40',NULL,NULL,NULL,NULL),(273,85,8,'2026-06-08 13:25:06',NULL,NULL,NULL,NULL),(274,85,5,'2026-06-08 13:25:48',NULL,NULL,NULL,NULL),(275,85,8,'2026-06-08 13:28:42',NULL,NULL,NULL,NULL),(276,85,8,'2026-06-08 13:32:03',NULL,NULL,NULL,NULL),(277,85,9,'2026-06-08 13:36:05',NULL,NULL,NULL,NULL),(278,85,9,'2026-06-08 13:36:15',NULL,NULL,NULL,NULL),(279,85,9,'2026-06-08 13:39:29',NULL,NULL,NULL,NULL),(280,85,9,'2026-06-08 13:42:06',NULL,NULL,NULL,NULL),(281,86,4,'2026-06-08 13:47:36',NULL,NULL,NULL,NULL),(282,86,5,'2026-06-08 13:49:50',NULL,NULL,NULL,NULL),(283,86,6,'2026-06-08 13:51:29',NULL,NULL,NULL,NULL),(284,86,7,'2026-06-08 13:55:45',NULL,NULL,NULL,NULL),(285,87,1,'2026-06-08 23:44:15','2026-06-08 23:45:32','WIN',120,23),(286,87,4,'2026-06-08 23:45:39','2026-06-08 23:46:11','LOSS',0,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `runs`
--

LOCK TABLES `runs` WRITE;
/*!40000 ALTER TABLE `runs` DISABLE KEYS */;
INSERT INTO `runs` VALUES (1,1,'2026-04-01 10:00:00','2026-04-01 10:18:00',1080,1,2,0,NULL,NULL),(2,1,'2026-04-03 11:00:00','2026-04-03 11:35:00',2100,1,3,1,NULL,NULL),(3,2,'2026-04-02 14:00:00','2026-04-02 14:25:00',1500,1,3,0,NULL,NULL),(4,2,'2026-04-04 15:00:00','2026-04-04 16:10:00',4200,2,1,0,NULL,NULL),(5,3,'2026-04-03 18:00:00','2026-04-03 19:30:00',5400,2,3,1,NULL,NULL),(6,3,'2026-04-08 20:00:00','2026-04-08 22:15:00',8100,3,3,0,NULL,NULL),(7,4,'2026-04-05 09:00:00','2026-04-05 09:15:00',900,1,2,0,NULL,NULL),(8,5,'2026-04-07 13:00:00','2026-04-07 13:30:00',1800,1,3,0,NULL,NULL),(9,6,'2026-04-10 19:00:00','2026-04-10 20:00:00',3600,2,2,0,NULL,NULL),(10,7,'2026-04-12 21:00:00','2026-04-13 00:00:00',10800,3,3,1,NULL,NULL),(11,8,'2026-04-15 17:00:00','2026-04-15 17:25:00',1500,1,3,0,NULL,NULL),(12,9,'2026-04-18 14:00:00','2026-04-18 15:20:00',4800,2,3,0,NULL,NULL),(71,64,'2026-06-07 12:55:42',NULL,NULL,NULL,NULL,0,NULL,NULL),(72,64,'2026-06-07 13:18:10',NULL,NULL,2,2,0,NULL,NULL),(73,64,'2026-06-07 14:18:34',NULL,NULL,NULL,NULL,0,NULL,NULL),(74,64,'2026-06-07 14:29:10',NULL,NULL,1,3,0,NULL,NULL),(76,64,'2026-06-07 14:44:53',NULL,NULL,NULL,NULL,0,NULL,NULL),(82,69,'2026-06-08 13:07:00',NULL,NULL,1,2,0,NULL,NULL),(83,69,'2026-06-08 13:15:50',NULL,NULL,NULL,NULL,0,NULL,NULL),(84,69,'2026-06-08 13:16:51',NULL,NULL,1,2,0,NULL,NULL),(85,69,'2026-06-08 13:20:41',NULL,NULL,2,2,0,NULL,NULL),(86,69,'2026-06-08 13:47:20',NULL,NULL,1,3,0,NULL,NULL),(87,70,'2026-06-08 23:44:13','2026-06-08 23:46:16',123,NULL,NULL,0,3,NULL),(88,70,'2026-06-08 23:46:18',NULL,NULL,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `runs` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_runs_au_finish` AFTER UPDATE ON `runs` FOR EACH ROW BEGIN
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
-- Dumping data for table `saved_games`
--

LOCK TABLES `saved_games` WRITE;
/*!40000 ALTER TABLE `saved_games` DISABLE KEYS */;
INSERT INTO `saved_games` VALUES (55,11,2,'New Run',64,76,'2026-06-07 14:44:53','2026-06-07 12:55:27'),(60,11,3,'New Run',69,86,'2026-06-08 13:47:20','2026-06-08 13:06:59'),(61,11,1,'New Run',70,88,'2026-06-08 23:46:18','2026-06-08 23:44:12');
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
  `defeated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sed_session` (`session_id`),
  KEY `fk_sed_enemy` (`enemy_id`),
  CONSTRAINT `fk_sed_enemy` FOREIGN KEY (`enemy_id`) REFERENCES `enemies` (`id`),
  CONSTRAINT `fk_sed_session` FOREIGN KEY (`session_id`) REFERENCES `room_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_enemies_defeated`
--

LOCK TABLES `session_enemies_defeated` WRITE;
/*!40000 ALTER TABLE `session_enemies_defeated` DISABLE KEYS */;
/*!40000 ALTER TABLE `session_enemies_defeated` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_sed_ai_count` AFTER INSERT ON `session_enemies_defeated` FOR EACH ROW BEGIN
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
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'kira_wolf','kira@return.game','hash_001_kw','2026-03-01 10:00:00',0,NULL,0),(2,'darius_03','darius@return.game','hash_002_dr','2026-03-02 11:15:00',0,NULL,0),(3,'mira_shade','mira@return.game','hash_003_ms','2026-03-03 09:30:00',0,NULL,0),(4,'valen_iron','valen@return.game','hash_004_vi','2026-03-05 14:45:00',0,NULL,0),(5,'nyx_runner','nyx@return.game','hash_005_nr','2026-03-07 18:20:00',0,NULL,0),(6,'elys_oak','elys@return.game','hash_006_eo','2026-03-10 08:00:00',0,NULL,0),(7,'thane_grim','thane@return.game','hash_007_tg','2026-03-12 22:10:00',0,NULL,0),(8,'selene_v','selene@return.game','hash_008_sv','2026-03-15 16:30:00',0,NULL,0),(9,'corvo_x','corvo@return.game','hash_009_cx','2026-03-18 13:00:00',0,NULL,0),(10,'ilya_starr','ilya@return.game','hash_010_is','2026-03-20 19:50:00',0,NULL,0),(11,'OMEGA','juanbrinez1111@gmail.com','$2b$10$cq4cc4RvU8hFnH6rePV87eG7v7QR4MMQhr7ftyxjQwfSztcHc8lY6','2026-05-17 22:16:45',0,NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_apply_experience`(
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_player_profile`(
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_finish_room_session`(
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_finish_run`(
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_reset_run_on_death`(
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_spend_attribute_point`(
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
