// setup.js — Run this script to create the travelgo database and tables
// Usage: node database/setup.js
// Make sure your .env has the correct DB_PASSWORD before running

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function setup() {
  console.log('\n🗄️  TravelGo Database Setup\n');

  // First connect WITHOUT specifying a database (to create it)
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST || 'localhost',
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true, // needed to run multiple SQL statements at once
  });

  try {
    console.log('✅ Connected to MySQL');

    // Read schema.sql
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    console.log('📋 Running schema.sql...');
    await connection.query(schema);
    console.log('✅ Tables created successfully');

    // Read seed.sql
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('🌱 Running seed.sql...');
    await connection.query(seed);
    console.log('✅ Demo data inserted successfully');

    console.log('\n🎉 Database setup complete!');
    console.log('   Database: travelgo');
    console.log('   Tables: users, vehicles, drivers, destinations, tour_packages,');
    console.log('           bookings, reviews, enquiries, notifications\n');
    console.log('   Demo Login:');
    console.log('   Admin:    admin@travelgo.in / password123');
    console.log('   Customer: rahul@example.com / password123\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check DB_PASSWORD in backend/.env');
    console.log('2. Make sure MySQL service is running');
    console.log('3. Make sure the MySQL user has CREATE DATABASE permission\n');
  } finally {
    await connection.end();
  }
}

setup();
