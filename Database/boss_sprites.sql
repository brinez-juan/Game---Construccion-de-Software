-- Final-boss sprites -----------------------------------------------------------
--
-- Assigns the two final bosses' idle sprite filenames (enemies.sprite), which were
-- left NULL in the dump. The client (dataAdapter.enemySpriteStatesFor) derives the
-- attack/defend variants from the idle filename — e.g. eldric_king_3.png ->
-- eldric_king_attack_3.png / eldric_king_defend_3.png, all of which ship in
-- Videojuego/WebPage/Assets/Sprites/characters/ — and falls back to idle for any
-- pose whose file is missing. Run against the return_game schema.

UPDATE `enemies` SET `sprite` = 'eldric_king_3.png'     WHERE `id` = 12; -- Eldric the Forlorn King
UPDATE `enemies` SET `sprite` = 'lysara_sorcerer_3.png' WHERE `id` = 13; -- Lysara the Veiled Sorcer
