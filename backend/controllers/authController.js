const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const usersPath = path.join(__dirname, '../data/users.json');

const loadUsers = () => {
  const data = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

// Discord OAuth2 Login
const discordLogin = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Discord authorization code required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = userResponse.data;
    const discordId = discordUser.id;

    // Find user by Discord ID
    const users = loadUsers();
    let user = users.users.find(u => u.discordId === discordId);

    if (!user) {
      return res.status(401).json({ 
        error: 'Discord ID không được đăng ký trong hệ thống. Vui lòng liên hệ Leader để được thêm vào.' 
      });
    }

    // Update Discord info if needed
    if (!user.discordUsername || user.discordUsername !== discordUser.username) {
      user.discordUsername = discordUser.username;
      user.discordAvatar = discordUser.avatar 
        ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png`
        : null;
      saveUsers(users);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name, discordId: user.discordId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        discordId: user.discordId,
        discordUsername: user.discordUsername,
        discordAvatar: user.discordAvatar
      }
    });
  } catch (error) {
    console.error('Discord login error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Discord authorization failed. Please try again.' });
    }
    res.status(500).json({ error: error.message || 'Discord login failed' });
  }
};

// Legacy login (kept for backward compatibility, but can be removed)
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const users = loadUsers();
    const user = users.users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUser = (req, res) => {
  try {
    const users = loadUsers();
    const user = users.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      character: user.character,
      folder: user.folder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMemberProfile = async (req, res) => {
  try {
    const { name, character, bio, avatar } = req.body;
    const users = loadUsers();
    const userIndex = users.users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) users.users[userIndex].name = name;
    if (character) users.users[userIndex].character = character;
    if (bio) users.users[userIndex].bio = bio;
    if (avatar) users.users[userIndex].avatar = avatar;

    saveUsers(users);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: users.users[userIndex]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Discord OAuth2 configuration
const getDiscordConfig = (req, res) => {
  try {
    res.json({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      redirectUri: process.env.DISCORD_REDIRECT_URI || ''
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  discordLogin,
  getDiscordConfig,
  getCurrentUser,
  updateMemberProfile
};
