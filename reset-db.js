const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function resetDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  try {
    console.log(`Dropping and resetting database '${process.env.DB_NAME}'...`);
    
    // Drop database if exists to clean everything
    await connection.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.query(`CREATE DATABASE \`${process.env.DB_NAME}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);
    
    console.log('Database dropped and recreated.');
    
    // Read and run schema.sql
    console.log('Applying schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schemaSql);
    
    console.log('Database successfully reset and initialized with fresh LuxeBook schema!');
  } catch (error) {
    console.error('Error during database reset:', error.message);
  } finally {
    await connection.end();
  }
}

resetDB();
