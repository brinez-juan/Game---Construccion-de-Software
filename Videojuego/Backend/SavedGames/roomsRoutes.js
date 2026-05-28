// Router exposing the static floor/room catalog so the game client can map each
// room to its background asset and give it a distinct screen state.
import express from 'express';
import pool from '../DB/dbconfig.js';
import requireAuth from '../Auth/requireAuth.js';

const router = express.Router();

// GET /api/rooms — every room joined with its floor.
//
// Unlike the saved-games/attributes/cards routers, rooms and floors are GLOBAL
// reference data shared by every player, so there is no req.user.id scoping here:
// the query exposes nothing account-specific. requireAuth is kept only so the
// endpoint stays behind the same Bearer-token surface the game client already uses.
router.get('/api/rooms', requireAuth, async (req, res) => {
  try {
    const [rooms] = await pool.query(
      `SELECT r.id, r.room_number, r.is_boss, r.background,
              f.floor_number, f.name AS floor_name
         FROM rooms r
         JOIN floors f ON r.floor_id = f.id
        ORDER BY f.floor_number, r.room_number`
    );
    return res.json({ success: true, rooms });
  } catch (err) {
    console.error('Failed to list rooms:', err);
    return res.status(500).json({ success: false, message: 'Failed to list rooms.' });
  }
});

export default router;
