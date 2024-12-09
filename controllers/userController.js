const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  createUser,
  findUserByUsername,
  getUsers,
  getUser,
} = require('../models/userModel');

const register = async (req, res) => {
  const { firstName, lastName, username, password, roleId } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createUser(
      firstName,
      lastName,
      username,
      hashedPassword,
      roleId
    );

    const { password, ...rest } = user;
    res.status(201).json(rest);
  } catch (error) {
    res.status(409).send({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  
  const { password: pass, ...rest } = user;
  res.json({ ...rest, token });
};

const getAllUsers = async (req, res) => {
  const users = await getUsers();

  res.json(users);
};

const getUserData = async (req, res) => {
  const users = await getUser(req.params.id);

  res.json(users);
};

module.exports = { register, login, getAllUsers, getUserData };
