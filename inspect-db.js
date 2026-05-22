const mysql = require('mysql2/promise');
require('dotenv').config();

async function inspect() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables in database:', tables);
    for (let row of tables) {
      const tableName = Object.values(row)[0];
      const [columns] = await connection.query(`DESCRIBE \`${tableName}\``);
      console.log(`\nColumns in ${tableName}:`);
      console.table(columns);
    }
  } catch (error) {
    console.error('Inspection error:', error.message);
  } finally {
    await connection.end();
  }
}

inspect();
