import pool from '../DB/dbconfig.js';

// Express middleware that allows only admin users through. MUST run AFTER requireAuth, which
// sets req.user from the verified token. Admin status is read live from the DB (not trusted
// from the token), so promoting/demoting a user takes effect immediately without them needing
// a fresh token, and an old token can never carry stale admin rights.
export default async function requireAdmin(req, res, next) {
  if (!req.user || req.user.id == null) {
    return res.status(401).json({ success: false, message: 'Missing authentication token.' });
  }
  try {
    const [rows] = await pool.query('SELECT isAdmin FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0 || !rows[0].isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    return next();
  } catch (err) {
    console.error('Admin check failed:', err);
    return res.status(500).json({ success: false, message: 'Could not verify admin access.' });
  }
}
