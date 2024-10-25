const {
  createTask,
  findTasksByUserId,
  findTaskById,
  updateTask,
  deleteTask,
} = require('../models/taskModel');

const getTasks = async (req, res) => {
  const tasks = await findTasksByUserId(req.userId);
  res.json(tasks);
};

const getTask = async (req, res) => {
  const task = await findTaskById(req.userId, req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
};

const createNewTask = async (req, res) => {
  const { title, completed } = req.body;
  const task = await createTask(req.userId, title, completed);
  res.status(201).json(task);
};

const updateExistingTask = async (req, res) => {
  const { title, completed } = req.body;
  const task = await updateTask(req.params.id, req.userId, title, completed);
  res.json(task);
};

const deleteExistingTask = async (req, res) => {
  await deleteTask(req.params.id, req.userId);
  res.status(204).end();
};

module.exports = {
  getTasks,
  getTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
};
