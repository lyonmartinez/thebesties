const express = require('express');
const {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
  getPublicMembers,
  getPublicLeader
} = require('../controllers/leaderController');
const { authenticate, authorizeLeader } = require('../middleware/auth');

const router = express.Router();

// Public routes (no auth required)
router.get('/public/members', getPublicMembers);
router.get('/public/leader', getPublicLeader);

// Protected routes (leader only)
router.get('/members', authenticate, authorizeLeader, getAllMembers);
router.post('/members', authenticate, authorizeLeader, createMember);
router.put('/members/:memberId', authenticate, authorizeLeader, updateMember);
router.delete('/members/:memberId', authenticate, authorizeLeader, deleteMember);

module.exports = router;
