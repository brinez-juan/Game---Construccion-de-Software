// Router exposing the global card and enemy catalogs so the game client can
// source combat data from the DB instead of hardcoding it.
import express from 'express';
import pool from '../DB/dbconfig.js';
import requireAuth from '../Auth/requireAuth.js';

const router = express.Router();

// GET /api/cards — the full card catalog.
//
// Like /api/rooms, cards are GLOBAL reference data shared by every player, so
// there is no req.user.id scoping here: the query exposes nothing
// account-specific. requireAuth is kept only so the endpoint stays behind the
// same Bearer-token surface the game client already uses. Used both as the card
// source of truth and to resolve archetype starting-card slugs -> card ids.
router.get('/api/cards', requireAuth, async (req, res) => {
  try {
    const [cards] = await pool.query(
      `SELECT id, name, description, action_type, stamina_cost, base_damage,
              rarity, sprite_name, scales_with, scaling_factor, required_attribute,
              required_value, is_boss_reward, enemy
         FROM cards
        ORDER BY id`
    );
    return res.json({ success: true, cards });
  } catch (err) {
    console.error('Failed to list cards:', err);
    return res.status(500).json({ success: false, message: 'Failed to list cards.' });
  }
});

// GET /api/enemies — the enemy catalog joined with its floor.
//
// The join is required because enemies.floor_id references floors.id (1-4),
// while rooms expose floor_number (0-3); the client groups enemies by
// floor_number to pick a room-appropriate pool, so the response carries it.
// Global reference data — see the /api/cards note on scoping.
router.get('/api/enemies', requireAuth, async (req, res) => {
  try {
    const [enemies] = await pool.query(
      `SELECT e.id, e.name, e.health_min, e.health_max,
              e.physical_damage_min, e.physical_damage_max,
              e.magic_damage_min, e.magic_damage_max,
              e.physical_defense, e.magic_defense,
              e.xp_reward, e.is_boss, e.sprite, f.floor_number
         FROM enemies e
         JOIN floors f ON f.id = e.floor_id
        ORDER BY f.floor_number, e.is_boss`
    );
    return res.json({ success: true, enemies });
  } catch (err) {
    console.error('Failed to list enemies:', err);
    return res.status(500).json({ success: false, message: 'Failed to list enemies.' });
  }
});

export default router;
