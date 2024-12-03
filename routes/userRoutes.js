const express = require('express');
const { register, login, getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
