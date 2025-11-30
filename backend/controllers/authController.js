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

// Verification code storage (file-based, shared between server and bot)
const verificationCodesPath = path.join(__dirname, '../data/verification-codes.json');

// Load verification codes from file
const loadVerificationCodes = () => {
  try {
    if (fs.existsSync(verificationCodesPath)) {
      const data = fs.readFileSync(verificationCodesPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading verification codes:', error);
  }
  return {};
};

// Save verification codes to file
const saveVerificationCodes = (codes) => {
  try {
    // Clean up expired codes before saving
    const now = Date.now();
    const cleanedCodes = {};
    for (const [code, data] of Object.entries(codes)) {
      if (data.expiresAt > now) {
        cleanedCodes[code] = data;
      }
    }
    fs.writeFileSync(verificationCodesPath, JSON.stringify(cleanedCodes, null, 2));
  } catch (error) {
    console.error('Error saving verification codes:', error);
  }
};

// Clean up expired codes periodically
setInterval(() => {
  const codes = loadVerificationCodes();
  saveVerificationCodes(codes); // This will clean up expired codes
}, 60000); // Every minute

// Generate random verification code
const generateVerificationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create verification code for Discord bot login
const createVerificationCode = (req, res) => {
  try {
    const code = generateVerificationCode();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const codes = loadVerificationCodes();
    codes[code] = {
      expiresAt,
      verified: false,
      discordId: null,
      userId: null
    };
    saveVerificationCodes(codes);

    console.log(`✅ Verification code created: ${code} (expires in 5 minutes)`);

    res.json({
      success: true,
      code,
      expiresIn: 300, // 5 minutes in seconds
      message: 'Gửi code này cho bot Discord để đăng nhập'
    });
  } catch (error) {
    console.error('❌ Error creating verification code:', error);
    res.status(500).json({ error: error.message || 'Lỗi khi tạo verification code' });
  }
};

// Verify code with Discord ID (called by bot)
const verifyCode = (code, discordId) => {
  try {
    console.log(`🔍 Verifying code: ${code} for Discord ID: ${discordId}`);
    const codes = loadVerificationCodes();
    const verification = codes[code];
    
    if (!verification) {
      console.log(`❌ Code ${code} not found in verification codes`);
      return { success: false, error: 'Code không hợp lệ hoặc đã hết hạn' };
    }

    if (Date.now() > verification.expiresAt) {
      delete codes[code];
      saveVerificationCodes(codes);
      console.log(`❌ Code ${code} has expired`);
      return { success: false, error: 'Code đã hết hạn' };
    }

    if (verification.verified) {
      console.log(`❌ Code ${code} already verified`);
      return { success: false, error: 'Code đã được sử dụng' };
    }

    // Find user by Discord ID
    const users = loadUsers();
    const user = users.users.find(u => u.discordId === discordId);

    if (!user) {
      console.log(`❌ Discord ID ${discordId} not found in users`);
      return { success: false, error: 'Discord ID không được đăng ký trong hệ thống' };
    }

    // Mark as verified
    verification.verified = true;
    verification.discordId = discordId;
    verification.userId = user.id;
    codes[code] = verification;
    saveVerificationCodes(codes);

    console.log(`✅ Code ${code} verified successfully for user: ${user.name}`);
    return { success: true, user };
  } catch (error) {
    console.error('❌ Error verifying code:', error);
    return { success: false, error: 'Lỗi khi xác thực code' };
  }
};

// Check verification status (polling from frontend)
const checkVerification = (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Verification code required' });
    }

    const codes = loadVerificationCodes();
    const verification = codes[code];

    if (!verification) {
      return res.status(404).json({ error: 'Code không hợp lệ hoặc đã hết hạn' });
    }

    if (Date.now() > verification.expiresAt) {
      delete codes[code];
      saveVerificationCodes(codes);
      return res.status(410).json({ error: 'Code đã hết hạn' });
    }

    if (verification.verified && verification.userId) {
      // Load user data
      const users = loadUsers();
      const user = users.users.find(u => u.id === verification.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role: user.role, 
          name: user.name, 
          discordId: user.discordId 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Clean up code
      delete codes[code];
      saveVerificationCodes(codes);

      return res.json({
        success: true,
        verified: true,
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
    }

    // Not verified yet
    res.json({
      success: true,
      verified: false,
      message: 'Đang chờ xác thực từ bot Discord...'
    });
  } catch (error) {
    console.error('Error checking verification:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  discordLogin,
  getDiscordConfig,
  getCurrentUser,
  updateMemberProfile,
  createVerificationCode,
  checkVerification,
  verifyCode
};
