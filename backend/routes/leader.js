const express = require('express');
const {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/leaderController');
const { authenticate, authorizeLeader } = require('../middleware/auth');

const router = express.Router();

router.get('/members', authenticate, authorizeLeader, getAllMembers);
router.post('/members', authenticate, authorizeLeader, createMember);
router.put('/members/:memberId', authenticate, authorizeLeader, updateMember);
router.delete('/members/:memberId', authenticate, authorizeLeader, deleteMember);

module.exports = router;
