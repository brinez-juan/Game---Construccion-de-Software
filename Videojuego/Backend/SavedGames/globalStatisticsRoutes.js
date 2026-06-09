import express from 'express';
import pool from '../DB/dbconfig.js';
import requireAuth from '../Auth/requireAuth.js';
import requireAdmin from '../Auth/requireAdmin.js';

const router = express.Router();

// These are the routes to get statistics from all the users for them to see
// the global progress made in the game from multiple users

// Endpoint to get the parry stats globally
router.get('/api/global-stats/parry-stats', async (req, res) => {
    try{
        // Sum the parry buckets straight from parry_stats (the source of truth) so the global
        // chart can show missed too — player_global_stats / global_stats only carry perfect and
        // normal totals, not missed.
        const [parryStats] = await pool.query(
            `SELECT
                COALESCE(SUM(perfect_parries), 0) AS global_perfect_parries,
                COALESCE(SUM(normal_parries),  0) AS global_normal_parries,
                COALESCE(SUM(parries_missed),  0) AS global_missed_parries
                FROM parry_stats
            `
        );
        return res.json({ success: true, parryStats: parryStats[0] });
    }
    catch(err){
        console.error('Failed to get total parries:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain stats.' + err.message });
    }
});

// Endpoint to get the global archetype distribution (admin only)
router.get('/api/global-stats/archetype-distribution', requireAuth, requireAdmin, async (req, res) => {
    try{
        const [archetypeDistribution] = await pool.query(
            `SELECT *
                FROM archetypes_selected
            ` 
        );
        return res.json({ success: true, archetypeDistribution: archetypeDistribution}); 
    }
    catch(err){
        console.error('Failed to get archetype distribution:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain archetypes.' });
    }
});

router.get('/api/global-stats/average_completion_time', async (req, res) => {
    try{
        const [averageCompletionTime] = await pool.query(
            `SELECT 
            completion_time_avg FROM 
            global_stats
            `
        );
        return res.json({ success: true, averageCompletionTime: averageCompletionTime[0].completion_time_avg });
    }
    catch(err){
        console.error('Failed to get average completion time:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain average completion time.' });
    }
}); 

router.get('/api/global-stats/cards-collected-avg', async (req, res) => {
    try{
        const [cardsCollectedAvg] = await pool.query(
            `SELECT 
            card_avg FROM 
            global_stats
            `
        );
        return res.json({ success: true, cardsCollectedAvg: cardsCollectedAvg[0]["card_avg"] });
    }
    catch(err){
        console.error('Failed to get average cards collected:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain average cards collected.' });
    }
}); 

router.get('/api/global-stats/top-players', async (req, res) => {
    try{
        const [topPlayers] = await pool.query(
            `SELECT U.username, PG.best_completion_time_seconds, PG.total_perfect_parries, PG.total_cards_collected
            FROM return_game.users AS U INNER JOIN
            return_game.player_profiles AS PP ON U.id = PP.user_id INNER JOIN
            return_game.player_global_stats AS PG ON PP.id = PG.player_id
            WHERE PG.best_completion_time_seconds IS NOT NULL
            ORDER BY PG.best_completion_time_seconds ASC, PG.total_perfect_parries DESC, PG.total_cards_collected DESC
            LIMIT 5;
            `
        );
        return res.json({ success: true, topPlayers });
    }
    catch(err){
        console.error('Failed to get top completion times:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain top completion times.' });
    }
});

router.get('/api/global-stats/parry-success-by-floor', requireAuth, requireAdmin, async (req, res) => {
    try{
        // ORDER BY here (not just in the view) guarantees the rows come back floor-ordered,
        // since a view's GROUP BY does not imply a sort in MySQL 8.
        const [parrySuccessByFloor] = await pool.query(
            `SELECT * FROM parry_success_by_floor ORDER BY floor_number`
        );
        return res.json({ success: true, parrySuccessByFloor });
    }
    catch(err){
        console.error('Failed to get parry success by floor:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain parry success by floor.' });
    }
});

// Endpoint for the per-room session abandonment rate: a room_session that was started but
// has no end_time was never finished (the player quit mid-room), so it counts as abandoned.
// The room_abandonment view gives abandoned vs total sessions for every room; the client
// turns that into an abandonment % per room.
router.get('/api/global-stats/abandonment-rate', requireAuth, requireAdmin, async (req, res) => {
    try{
        const [abandonmentByRoom] = await pool.query(
            `SELECT room_id, floor_number, room_number, is_boss,
                    abandoned_sessions, total_sessions
               FROM room_abandonment
              ORDER BY floor_number, room_number`
        );
        return res.json({ success: true, abandonmentByRoom });
    }
    catch(err){
        console.error('Failed to get abandonment rate:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain abandonment rate.' });
    }
});
export default router;