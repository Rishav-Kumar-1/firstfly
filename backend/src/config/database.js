// database.js — This file sets up the connection pool to MySQL
// A "connection pool" means Node.js keeps a set of ready-to-use DB connections
// instead of creating a new one every time — much faster!

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a pool of connections using values from the .env file
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // usually "localhost"
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,         // usually "root"
  password: process.env.DB_PASSWORD, // your MySQL password
  database: process.env.DB_NAME,     // "travelgo"
  waitForConnections: true,          // wait if all connections are busy
  connectionLimit: 10,               // max 10 simultaneous connections
  queueLimit: 0,                     // unlimited waiting queue
  charset: 'utf8mb4',                // supports emojis and all characters
});

// Test the connection when the server starts
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release(); // always release the connection back to the pool
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️  The server will run, but database features will not work.');
    console.log('   Please check your .env DB settings and ensure MySQL is running.');
  }
}

testConnection();

module.exports = pool;
