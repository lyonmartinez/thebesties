const express = require('express');
const { login, discordLogin, getCurrentUser, updateMemberProfile, getDiscordConfig, createVerificationCode, checkVerification } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login); // Legacy, can be removed
router.post('/discord', discordLogin);
router.get('/discord-config', getDiscordConfig);
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateMemberProfile);

// Discord Bot Verification
router.post('/discord/verify-code', createVerificationCode);
router.get('/discord/check-verification', checkVerification);

module.exports = router;
