const express = require('express');
const { login, discordLogin, getCurrentUser, updateMemberProfile, getDiscordConfig } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login); // Legacy, can be removed
router.post('/discord', discordLogin);
router.get('/discord-config', getDiscordConfig);
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateMemberProfile);

module.exports = router;
