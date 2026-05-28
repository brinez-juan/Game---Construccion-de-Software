-- Additive migration: link each room to its background asset.
--
-- The background art ships in Videojuego/WebPage/Assets/backgrounds/. The asset's
-- first number is floors.floor_number (0-3, NOT floors.id which is 1-4) and the
-- second is rooms.room_number. The descriptive prefix (courtyard, library, ...) is
-- not derivable from the numbers, so the full filename is stored here and served by
-- GET /api/rooms. Rooms 1-3 belong to the Forest tutorial (floor_number 0) and share
-- the single forest_0.png background.
--
-- The rest of the return_game schema (floors, rooms, ...) is applied separately; this
-- file is the source of truth only for the new rooms.background column.

ALTER TABLE `rooms`
  ADD COLUMN `background` VARCHAR(100) NULL COMMENT 'Background asset filename under Assets/backgrounds/';

UPDATE `rooms` SET `background` = 'forest_0.png'           WHERE `id` = 1;  -- Forest (tutorial), room 1
UPDATE `rooms` SET `background` = 'forest_0.png'           WHERE `id` = 2;  -- Forest (tutorial), room 2
UPDATE `rooms` SET `background` = 'forest_0.png'           WHERE `id` = 3;  -- Forest (tutorial), room 3 (boss)
UPDATE `rooms` SET `background` = 'courtyard_1_1.png'      WHERE `id` = 4;  -- Mystic Courtyard, room 1
UPDATE `rooms` SET `background` = 'main entrance_1_2.png'  WHERE `id` = 5;  -- Mystic Courtyard, room 2
UPDATE `rooms` SET `background` = 'stairs purple_1_3.png'  WHERE `id` = 6;  -- Mystic Courtyard, room 3 (boss)
UPDATE `rooms` SET `background` = 'paintings room_2_1.png' WHERE `id` = 7;  -- Bloody Halls, room 1
UPDATE `rooms` SET `background` = 'dining room_2_2.png'    WHERE `id` = 8;  -- Bloody Halls, room 2
UPDATE `rooms` SET `background` = 'stairs red_2_3.png'     WHERE `id` = 9;  -- Bloody Halls, room 3 (boss)
UPDATE `rooms` SET `background` = 'library_3_1.png'        WHERE `id` = 10; -- Throne of Return, room 1
UPDATE `rooms` SET `background` = 'bedroom_3_2.png'        WHERE `id` = 11; -- Throne of Return, room 2
UPDATE `rooms` SET `background` = 'throne room_3_3.png'    WHERE `id` = 12; -- Throne of Return, room 3 (boss)
