import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../DB/dbconfig.js';

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Check for missing fields
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  // 2. Validate email format with regex (Task 2)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email." });
  }

  // 3. Validate minimum password criteria (Task 4)
  // Example: Minimum 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      success: false, 
      message: "Password must be at least 8 characters long and contain at least one letter and one number." 
    });
  }

  try {
    // 4. Verify that username and email do not already exist (Task 3)
    const [existingUsers] = await pool.query(
      'SELECT username, email FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      const conflict = existingUsers[0].email === email ? "Email" : "Username";
      return res.status(409).json({ success: false, message: `${conflict} is already registered.` });
    }

    // 5. Hash password before saving (Task 5)
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 6. Save new user into the database (Data Persistence)
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const newUserId = result.insertId;

    // 7. Return a session token if registration is successful (Task 6)
    const token = jwt.sign(
      { id: newUserId, username: username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 1 day
    );

    // Registration Success Response
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token: token,
      user: { id: newUserId, username, email }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during registration." });
  }
});

export default router;