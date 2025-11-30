const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
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
        createdAt: u.createdAt
      }));

    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { username, email, password, name, character } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const users = loadUsers();

    // Check if user already exists
    if (users.users.find(u => u.username === username || u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate memberId
    const memberId = `member-${Date.now()}`;
    const folder = username.toLowerCase();

    // Create member object
    const newMember = {
      id: memberId,
      username,
      email,
      password: hashedPassword,
      role: 'member',
      name,
      character: character || 'Thành viên Gang',
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
        username: newMember.username,
        name: newMember.name,
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
    const { name, character, email } = req.body;

    const users = loadUsers();
    const memberIndex = users.users.findIndex(u => u.id === memberId);

    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (name) users.users[memberIndex].name = name;
    if (character) users.users[memberIndex].character = character;
    if (email) users.users[memberIndex].email = email;

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

    const memberFolder = users.users[memberIndex].folder;
    users.users[memberIndex].isActive = false;

    saveUsers(users);

    // Delete folder from filesystem
    const folderPath = path.join(process.env.REPO_PATH, 'members', memberFolder);
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    // Push to GitHub
    await pushToGithub(`Remove member: ${users.users[memberIndex].name}`);

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
