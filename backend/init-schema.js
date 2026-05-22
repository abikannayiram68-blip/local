const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true // critical to execute whole script
  });

  try {
    console.log('Initializing database schema...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // Execute the schema script
    await connection.query(schemaSql);
    console.log('Schema initialized and seed data inserted successfully!');
  } catch (error) {
    console.error('Error initializing schema:', error.message);
  } finally {
    await connection.end();
  }
}

initSchema();
