import express from 'express';
import pool from './dbconfig.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sample Route testing the DB connection with a parameterized query
app.get('/api/test', async (req, res) => {
  try {
    // Basic test query: selecting standard system information or a placeholder
    // Using a parameterized array [1] even for simple queries to prove configuration
    const [rows] = await pool.query('SELECT ? AS connection_status', [1]);
    
    if (rows.length > 0) {
      res.json({
        success: true,
        message: "Successfully connected to the database!",
        data: rows[0]
      });
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection error",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});