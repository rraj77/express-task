const express = require('express');
const { register, login, getAllUsers, getUserData } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserData);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
