const express = require('express');
const { login, getCurrentUser, updateMemberProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateMemberProfile);

module.exports = router;
