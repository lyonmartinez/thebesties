const express = require('express');
const multer = require('multer');
const { login, discordLogin, getCurrentUser, updateMemberProfile, getDiscordConfig, createVerificationCode, checkVerification } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { uploadAvatar, uploadGalleryImages } = require('../controllers/uploadController');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG images are allowed'), false);
    }
  }
});

router.post('/login', login); // Legacy, can be removed
router.post('/discord', discordLogin);
router.get('/discord-config', getDiscordConfig);
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateMemberProfile);

// Image upload routes
router.post('/upload/avatar', authenticate, upload.single('avatar'), uploadAvatar);
router.post('/upload/gallery', authenticate, upload.array('images', 5), uploadGalleryImages);

// Discord Bot Verification
router.post('/discord/verify-code', createVerificationCode);
router.get('/discord/check-verification', checkVerification);

module.exports = router;
