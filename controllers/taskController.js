const {
  createTask,
  findTasksByUserId,
  findTaskById,
  updateTask,
  deleteTask,
} = require('../models/taskModel');

const getTasks = async (req, res) => {
  const { userId } = req;

  if (!userId) {
    return res.status(400).send({
      message: 'UserId is required',
    });
  }
  const tasks = await findTasksByUserId(userId);
  return res.json(tasks);
};

const getTasksByUser = async (req, res) => {
  const { id: userId } = req.params;

  if (!userId) {
    return res.status(400).send({
      message: 'UserId is required',
    });
  }
  const tasks = await findTasksByUserId(userId);
  return res.json(tasks);
};

const getTask = async (req, res) => {
  const task = await findTaskById(req.userId, req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(task);
};

const createNewTask = async (req, res) => {
  const { title, completed } = req.body;
  const task = await createTask(req.userId, title, completed);
  return res.status(201).json(task);
};

const updateExistingTask = async (req, res) => {
  const { title, completed } = req.body;
  const task = await updateTask(req.params.id, req.userId, title, completed);
  return res.json(task);
};

const deleteExistingTask = async (req, res) => {
  await deleteTask(req.params.id, req.userId);
  return res.status(204).end();
};

module.exports = {
  getTasks,
  getTask,
  createNewTask,
  getTasksByUser,
  updateExistingTask,
  deleteExistingTask,
};
