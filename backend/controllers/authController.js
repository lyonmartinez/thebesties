const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersPath = path.join(__dirname, '../data/users.json');

const loadUsers = () => {
  const data = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

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
    const { name, character, bio } = req.body;
    const users = loadUsers();
    const userIndex = users.users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) users.users[userIndex].name = name;
    if (character) users.users[userIndex].character = character;
    if (bio) users.users[userIndex].bio = bio;

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

module.exports = {
  login,
  getCurrentUser,
  updateMemberProfile
};
