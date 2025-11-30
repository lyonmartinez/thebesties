const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leaderRoutes = require('./routes/leader');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leader', leaderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'The Besties Backend is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 The Besties Backend running on http://localhost:${PORT}`);
  console.log(`📚 API docs:`);
  console.log(`   POST /api/auth/login - Login`);
  console.log(`   GET /api/auth/me - Get current user`);
  console.log(`   PUT /api/auth/profile - Update profile`);
  console.log(`   GET /api/leader/members - Get all members (Leader only)`);
  console.log(`   POST /api/leader/members - Create member (Leader only)`);
  console.log(`   PUT /api/leader/members/:id - Update member (Leader only)`);
  console.log(`   DELETE /api/leader/members/:id - Delete member (Leader only)`);
});

module.exports = app;
