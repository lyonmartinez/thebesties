const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { createMemberFolder, pushToGithub } = require('../utils/github');

const usersPath = path.join(__dirname, '../data/users.json');

const loadUsers = () => {
  const data = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

const getAllMembers = (req, res) => {
  try {
    const users = loadUsers();
    const members = users.users
      .filter(u => u.role === 'member' && u.isActive)
      .map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        character: u.character,
        email: u.email,
        folder: u.folder,
        createdAt: u.createdAt,
        discordId: u.discordId || null,
        discordUsername: u.discordUsername || null,
        discordAvatar: u.discordAvatar || null
      }));

    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { discordId } = req.body;

    if (!discordId) {
      return res.status(400).json({ error: 'Discord ID is required' });
    }

    const users = loadUsers();

    // Check if Discord ID already exists
    if (users.users.find(u => u.discordId === discordId)) {
      return res.status(400).json({ error: 'Discord ID already registered' });
    }

    // Fetch Discord user info from Discord API
    let discordUser;
    try {
      const discordResponse = await axios.get(`https://discord.com/api/v10/users/${discordId}`, {
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      });
      discordUser = discordResponse.data;
    } catch (error) {
      console.error('Error fetching Discord user:', error.response?.data || error.message);
      return res.status(400).json({ 
        error: 'Không thể lấy thông tin từ Discord. Kiểm tra Discord ID và đảm bảo bot có quyền truy cập.' 
      });
    }

    // Auto-generate fields from Discord data
    const discordUsername = discordUser.username || `user_${discordId.substring(0, 6)}`;
    const username = discordUsername.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const email = `${username}@thebesties.gang`;
    const name = discordUser.global_name || discordUsername || `Member ${discordId.substring(0, 6)}`;
    const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12); // Random password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate memberId
    const memberId = `member-${Date.now()}`;
    const folder = username.toLowerCase();

    // Build Discord avatar URL
    const discordAvatar = discordUser.avatar 
      ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.${discordUser.avatar.startsWith('a_') ? 'gif' : 'png'}`
      : null;

    // Create member object (only Discord fields + auto-generated ones)
    const newMember = {
      id: memberId,
      discordId,
      discordUsername,
      discordAvatar,
      username, // Auto-generated
      email, // Auto-generated
      password: hashedPassword, // Auto-generated
      role: 'member',
      name, // From Discord
      character: 'Thành viên Gang', // Default
      folder,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Add to users
    users.users.push(newMember);
    saveUsers(users);

    // Create member folder
    const folderResult = createMemberFolder(folder, name);
    if (!folderResult.success) {
      return res.status(500).json({ error: 'Failed to create member folder' });
    }

    // Push to GitHub
    const gitResult = await pushToGithub(`Add new member: ${name}`);
    if (!gitResult.success) {
      console.error('Git push error:', gitResult.error);
      // Don't fail if git push fails, member is still created locally
    }

    res.json({
      success: true,
      message: 'Member created successfully',
      member: {
        id: newMember.id,
        discordId: newMember.discordId,
        discordUsername: newMember.discordUsername,
        discordAvatar: newMember.discordAvatar,
        name: newMember.name,
        username: newMember.username,
        email: newMember.email,
        folder: newMember.folder
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { name, character } = req.body;

    const users = loadUsers();
    const memberIndex = users.users.findIndex(u => u.id === memberId);

    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (name) users.users[memberIndex].name = name;
    if (character !== undefined) users.users[memberIndex].character = character || 'Thành viên Gang';

    saveUsers(users);

    // Push to GitHub
    await pushToGithub(`Update member: ${users.users[memberIndex].name}`);

    res.json({
      success: true,
      message: 'Member updated successfully',
      member: users.users[memberIndex]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const users = loadUsers();
    const memberIndex = users.users.findIndex(u => u.id === memberId);

    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member = users.users[memberIndex];
    const memberFolder = member.folder;

    // Remove member from users list completely
    users.users.splice(memberIndex, 1);
    saveUsers(users);

    // Delete folder from filesystem (static member page)
    const repoPath = process.env.REPO_PATH || path.join(__dirname, '..', '..');
    const folderPath = path.join(repoPath, 'members', memberFolder);
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    // Push to GitHub so GitHub Pages cập nhật
    await pushToGithub(`Remove member: ${member.name}`);

    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember
};
