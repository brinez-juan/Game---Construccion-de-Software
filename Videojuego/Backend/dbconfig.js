import mysql from 'mysql2/promise'; // Using ES Modules, or use require() if using CommonJS
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Allows multiple concurrent users
  queueLimit: 0
});

export default pool;