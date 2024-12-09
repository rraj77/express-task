const pool = require('./config/db');
const bcrypt = require('bcrypt');

const createUsersTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          firstName VARCHAR(50) NOT NULL,
          lastName VARCHAR(50) NOT NULL,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          "roleId" INTEGER REFERENCES roles(id) ON DELETE SET NULL
        );
      `;

  const insertDefaultUserQuery = `
      INSERT INTO users (firstName, lastName, username, password, "roleId")
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (username) DO NOTHING;
    `;

  try {
    await pool.query(createTableQuery);

    await createRolesTable();

    const hashedPassword = await bcrypt.hash('12345678', 10);

    await pool.query(insertDefaultUserQuery, [
      'Admin',
      'abc',
      'admin@gmail.com',
      hashedPassword,
      1,
    ]);

    await createTasksTable();
  } catch (err) {
    console.error('Error creating users table:', err.message);
  }
};

const createTasksTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(50) NOT NULL,
          completed BOOLEAN NOT NULL,
          "userId" INTEGER REFERENCES users(id) ON DELETE SET NULL
        );
      `;

  try {
    await pool.query(createTableQuery);
  } catch (err) {
    console.error('Error creating tasks table:', err.message);
  }
};

const createRolesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE
    );
  `;

  const insertRolesQuery = `
    INSERT INTO roles (name) 
    SELECT * FROM UNNEST(ARRAY['Admin', 'User']) 
    AS new_role(name) 
    ON CONFLICT (name) DO NOTHING;
  `;

  try {
    await pool.query(createTableQuery);

    await pool.query(insertRolesQuery);

    console.log(
      'Roles table created and default roles added (if not already present).'
    );
  } catch (err) {
    console.error('Error creating roles table:', err.message);
  }
};

createUsersTable();
