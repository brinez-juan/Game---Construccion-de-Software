import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../DB/dbconfig.js'; // Connection pool from US05

const router = express.Router();
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15; // Temporarily lock for 15 minutes

router.post('/auth/login', async (req, res) => {
  const { identifier, password } = req.body; // 'identifier' can be username OR email

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: "All credentials must be offered." });
  }

  try {
    // 1. Search user by username or email (Task 2)
    const [users] = await pool.query(
      'SELECT id, username, email, password_hash, failed_attempts, lock_until FROM users WHERE username = ? OR email = ?',
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const user = users[0];

    // 2. Check if account is temporarily locked (Task 6)
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      const remainingTime = Math.ceil((new Date(user.lock_until) - new Date()) / 60000);
      return res.status(423).json({ 
        success: false, 
        message: `This account has been consumed by shadows. Locked for ${remainingTime} more minutes.` 
      });
    }

    // 3. Compare password against stored hash (Task 3)
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      let newAttempts = user.failed_attempts + 1;
      let lockUntilTime = null;

      // 4. Temporarily lock account after 5 failed attempts (Task 5 & 6)
      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + LOCK_TIME_MINUTES);
        lockUntilTime = lockTime;
        
        await pool.query(
          'UPDATE users SET failed_attempts = ?, lock_until = ? WHERE id = ?',
          [newAttempts, lockUntilTime, user.id]
        );

        return res.status(423).json({
          success: false,
          message: "Too many failed connections. Your portal is sealed for 15 minutes."
        });
      } else {
        // Increment count without locking yet
        await pool.query(
          'UPDATE users SET failed_attempts = ? WHERE id = ?',
          [newAttempts, user.id]
        );

        return res.status(401).json({ 
          success: false, 
          message: `Invalid credentials. ${MAX_FAILED_ATTEMPTS - newAttempts} attempts remain before portal sealing.` 
        });
      }
    }

    // 5. Success state: Reset security metadata trackers on successful login
    await pool.query(
      'UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE id = ?',
      [user.id]
    );

    // 6. Generate session token with 30 min expiration time (Task 4)
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30m' } // Exact 30-minute window
    );

    return res.status(200).json({
      success: true,
      message: "Authentication successful. Ritual initiated.",
      token: token,
      user: { id: user.id, username: user.username }
    });

  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ success: false, message: "Internal server breakdown inside the ritual." });
  }
});

export default router;