const pool = require('../config/db');

const createTask = async (userId, title, completed) => {
  const result = await pool.query(
    'INSERT INTO tasks (user_id, title, completed) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, completed]
  );

  return result.rows[0];
};

const findTasksByUserId = async (userId) => {
  const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [
    userId,
  ]);

  return result.rows;
};

const findTaskById = async (userId, taskId) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );
  return result.rows[0];
};

const updateTask = async (taskId, userId, title, completed) => {
  const result = await pool.query(
    'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
    [title, completed, taskId, userId]
  );

  return result.rows[0];
};

const deleteTask = async (taskId, userId) => {
  await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [
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
