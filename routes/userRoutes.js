const express = require('express');
const { register, login, getAllUsers, getUserData, updateUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserData);
router.put('/:id', updateUser);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
