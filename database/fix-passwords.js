// fix-passwords.js — Updates all demo user passwords to 'password123'
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function fix() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const hash = await bcrypt.hash('password123', 12);
  await conn.query('UPDATE users SET password = ?', [hash]);

  const [users] = await conn.query('SELECT id, name, email, role FROM users');
  console.log('\n✅ All passwords updated to: password123\n');
  console.log('Users in database:');
  users.forEach(u => console.log(`  [${u.role}] ${u.name} — ${u.email}`));
  console.log('\nDemo Login:');
  console.log('  Admin:    admin@travelgo.in / password123');
  console.log('  Customer: rahul@example.com / password123\n');

  await conn.end();
}

fix().catch(console.error);
