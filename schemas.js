const pool = require('./config/db');

const createUsersTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
        );
      `;

  try {
    await pool.query(createTableQuery);
    console.log('Users table created (if it did not exist).');
  } catch (err) {
    console.error('Error creating users table:', err.message);
  }
};

createUsersTable();
