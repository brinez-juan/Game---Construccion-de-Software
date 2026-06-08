import express from 'express';
import pool from '../DB/dbconfig.js';
import requireAuth from '../Auth/requireAuth.js';

const router = express.Router();

// These are the routes to get statistics from all the users for them to see
// the global progress made in the game from multiple users

// Endpoint to get the parry stats globally
router.get('/api/global-stats/parry-stats', async (req, res) => {
    try{
        const [parryStats] = await pool.query(
            `SELECT
                global_perfect_parries,
                global_normal_parries,
                global_poor_parries
                FROM global_stats
            `
            
        );
        return res.json({ success: true, parryStats: parryStats[0] });
    }
    catch(err){
        console.error('Failed to get total parries:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain stats.' + err.message });
    }
});

// Endpoint to get the global archetype distribution 
router.get('/api/global-stats/archetype-distribution', async (req, res) => {
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

router.get('/api/global-stats/parry-success-by-floor', async (req, res) => {
    try{
        const [parrySuccessByFloor] = await pool.query(
            `SELECT * FROM parry_success_by_floor`
        );
        return res.json({ success: true, parrySuccessByFloor });
    }
    catch(err){
        console.error('Failed to get parry success by floor:', err);
        return res.status(500).json({ success: false, message: 'Failed to obtain parry success by floor.' });
    }
});
export default router;