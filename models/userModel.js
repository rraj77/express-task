const pool = require('../config/db');

const createUser = async (
  firstName,
  lastName,
  username,
  hashedPassword,
  roleId
) => {
  const result = await pool.query(
    'INSERT INTO users (firstName, lastName, username, password, "roleId") VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [firstName, lastName, username, hashedPassword, roleId]
  );

  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT 
        users.id, 
        users.firstname, 
        users.lastname, 
        users.username,
        users.password, 
        roles.id AS role_id, 
        roles.name AS role_name 
     FROM users
     LEFT JOIN roles ON roles.id = users."roleId"
     WHERE users.username = $1`,
    [username]
  );

  const user = result.rows[0];

  if (user) {
    return {
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      username: user.username,
      password: user.password,
      role: user.role_id
        ? {
            id: user.role_id,
            name: user.role_name,
          }
        : null,
    };
  }

  return null;
};

const getUsers = async () => {
  const result = await pool.query(`
  SELECT 
    u.id,
    u.username,
    u.firstName,
    u.lastName,
    json_build_object('id', r.id, 'name', r.name) AS roles
  FROM users u
  LEFT JOIN roles r ON u."roleId" = r.id
  GROUP BY u.id, u.username, u.firstName, u.lastName, r.id;
`);

  const data = result.rows.map((user) => ({
    id: user.id,
    firstName: user.firstname,
    lastName: user.lastname,
    username: user.username,
    password: user.password,
    role: user.roles
      ? {
          id: user.roles.id,
          name: user.roles.name,
        }
      : null,
  }));

  return data;
};

const getUser = async (id) => {
  const result = await pool.query(
    `
  SELECT 
    u.id,
    u.username,
    u.firstName,
    u.lastName,
    json_build_object('id', r.id, 'name', r.name) AS role
  FROM users u
  LEFT JOIN roles r ON u."roleId" = r.id
  WHERE u.id = $1;
  `,
    [id]
  );

  return result.rows[0];
};

const updateUserDetails = async (id, data) => {
  const fields = Object.keys(data)
    .map((key, index) => `"${key}" = $${index + 2}`)
    .join(', ');

  const values = Object.values(data);

  const result = await pool.query(
    `
  UPDATE users
  SET ${fields}
  WHERE id = $1
  RETURNING *;
  `,
    [id, ...values]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByUsername,
  getUsers,
  getUser,
  updateUserDetails,
};
