const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = {
  host: 'sql12.freesqldatabase.com',
  port: 3306,
  user: 'sql12837706',
  password: 'iGhCVbwMq6',
  database: 'sql12837706',
  multipleStatements: true,
};

function clean(sql) {
  return sql
    .replace(/CREATE\s+DATABASE[^;]+;/gi, '')
    .replace(/DROP\s+DATABASE[^;]+;/gi, '')
    .replace(/USE\s+\w+\s*;/gi, '');
}

async function deploy() {
  console.log('Connecting...');
  const conn = await mysql.createConnection(config);
  console.log('Connected!');

  const schemaSQL = clean(fs.readFileSync(path.join(__dirname, 'schema_compat.sql'), 'utf8'));
  const seedSQL   = clean(fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8'));

  try {
    console.log('Creating tables...');
    await conn.query(schemaSQL);
    console.log('Tables created!');

    console.log('Inserting seed data...');
    await conn.query(seedSQL);
    console.log('Seed data inserted!');

    console.log('\n✅ Database is ready!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await conn.end();
  }
}

deploy();
