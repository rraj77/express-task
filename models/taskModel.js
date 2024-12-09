const pool = require('../config/db');

const createTask = async (userId, title, completed) => {
  const result = await pool.query(
    'INSERT INTO tasks ("userId", title, completed) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, completed]
  );

  return result.rows[0];
};

const findTasksByUserId = async (userId) => {
  const data = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

  if (data.rows?.[0]?.roleId === 1) {
    const result = await pool.query('SELECT * FROM tasks');

    return result.rows;
  }

  const result = await pool.query('SELECT * FROM tasks WHERE "userId" = $1', [
    userId,
  ]);

  return result.rows;
};

const findTaskById = async (userId, taskId) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1 AND userId = $2',
    [taskId, userId]
  );
  return result.rows[0];
};

const updateTask = async (taskId, userId, title, completed) => {
  const result = await pool.query(
    'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 AND "userId" = $4 RETURNING *',
    [title, completed, taskId, userId]
  );

  return result.rows[0];
};

const deleteTask = async (taskId, userId) => {
  await pool.query('DELETE FROM tasks WHERE id = $1 AND "userId" = $2', [
    taskId,
    userId,
  ]);
};

module.exports = {
  createTask,
  findTasksByUserId,
  findTaskById,
  updateTask,
  deleteTask,
};
