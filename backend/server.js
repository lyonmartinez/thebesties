const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leaderRoutes = require('./routes/leader');

// Initialize Discord Bot (if configured)
let discordBot = null;
if (process.env.DISCORD_BOT_TOKEN) {
  try {
    discordBot = require('./bot/bot');
    console.log('🤖 Discord Bot đã được khởi động');
  } catch (error) {
    console.warn('⚠️  Không thể khởi động Discord Bot:', error.message);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Set default JWT values if not in .env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'default_jwt_secret_change_in_production_123456789';
  console.warn('⚠️  WARNING: Using default JWT_SECRET. Please set JWT_SECRET in .env file!');
}
if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = '7d';
}

// Middleware
app.use(cors({
  origin: '*', // Cho phép tất cả origins (có thể thay đổi trong production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
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

// 404 - Only for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Serve index.html for root and other non-API routes (SPA fallback)
app.get('*', (req, res) => {
  // Don't serve HTML for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  // For other routes, let express.static handle it
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`🚀 The Besties Backend running on http://localhost:${PORT}`);
  console.log(`📚 API docs:`);
  console.log(`   POST /api/auth/login - Login (Legacy)`);
  console.log(`   POST /api/auth/discord - Discord OAuth2 Login`);
  console.log(`   GET /api/auth/discord-config - Get Discord OAuth2 config`);
  console.log(`   POST /api/auth/discord/verify-code - Create Discord bot verification code`);
  console.log(`   GET /api/auth/discord/check-verification - Check verification status`);
  console.log(`   GET /api/auth/me - Get current user`);
  console.log(`   PUT /api/auth/profile - Update profile`);
  console.log(`   GET /api/leader/public/members - Get all members (Public)`);
  console.log(`   GET /api/leader/public/leader - Get leader info (Public)`);
  console.log(`   GET /api/leader/members - Get all members (Leader only)`);
  console.log(`   POST /api/leader/members - Create member (Leader only)`);
  console.log(`   PUT /api/leader/members/:id - Update member (Leader only)`);
  console.log(`   DELETE /api/leader/members/:id - Delete member (Leader only)`);
  if (discordBot) {
    console.log(`🤖 Discord Bot: Đang hoạt động`);
  } else {
    console.log(`⚠️  Discord Bot: Chưa được cấu hình (DISCORD_BOT_TOKEN)`);
  }
});

module.exports = app;
