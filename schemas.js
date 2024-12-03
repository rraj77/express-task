const pool = require('./config/db');

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
      VALUES ('Admin', 'User', 'admin', 'hashedpassword123', 1)
      ON CONFLICT (username) DO NOTHING;
    `;

  try {
    await pool.query(createTableQuery);
    await createRolesTable();
    await pool.query(insertDefaultUserQuery);

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
    SELECT * FROM UNNEST(ARRAY['admin', 'user']) 
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
