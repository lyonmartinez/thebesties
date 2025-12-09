const fs = require('fs');
const path = require('path');
const { pushToGithub } = require('../utils/github');

const usersPath = path.join(__dirname, '../data/users.json');

const loadUsers = () => {
  try {
    if (!fs.existsSync(usersPath)) {
      return { users: [] };
    }
    const data = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users.json:', error);
    return { users: [] };
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

// Upload avatar for member
const uploadAvatar = async (req, res) => {
  try {
    const users = loadUsers();
    const user = users.users.find(u => u.id === req.user.id);
    
    if (!user || user.role !== 'member') {
      return res.status(403).json({ error: 'Only members can upload avatars' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const memberFolder = user.folder;
    if (!memberFolder) {
      return res.status(400).json({ error: 'Member folder not found' });
    }

    // Get the correct repo path - go up from backend/controllers to project root
    // __dirname is backend/controllers, so ../.. goes to project root
    const repoPath = process.env.REPO_PATH || path.resolve(__dirname, '../..');
    const imagesDir = path.join(repoPath, 'members', memberFolder, 'images');
    
    console.log('📁 Avatar upload path:', imagesDir);
    console.log('📁 Member folder:', memberFolder);
    
    // Ensure images directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log('✅ Created images directory:', imagesDir);
    }

    // Save avatar as avatar.png
    const avatarPath = path.join(imagesDir, 'avatar.png');
    fs.writeFileSync(avatarPath, req.file.buffer);
    console.log('✅ Avatar saved to:', avatarPath);

    // Update user avatar path
    user.avatar = `members/${memberFolder}/images/avatar.png`;
    const userIndex = users.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users.users[userIndex] = user;
      saveUsers(users);
    }

    // Push to GitHub
    await pushToGithub(`Update avatar for ${user.name}`);

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: `members/${memberFolder}/images/avatar.png`
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: error.message });
  }
};

// Upload gallery images for member
const uploadGalleryImages = async (req, res) => {
  try {
    const users = loadUsers();
    const user = users.users.find(u => u.id === req.user.id);
    
    if (!user || user.role !== 'member') {
      return res.status(403).json({ error: 'Only members can upload images' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const memberFolder = user.folder;
    if (!memberFolder) {
      return res.status(400).json({ error: 'Member folder not found' });
    }

    // Get the correct repo path - go up from backend/controllers to project root
    // __dirname is backend/controllers, so ../.. goes to project root
    const repoPath = process.env.REPO_PATH || path.resolve(__dirname, '../..');
    const imagesDir = path.join(repoPath, 'members', memberFolder, 'images');
    
    console.log('📁 Gallery upload path:', imagesDir);
    console.log('📁 Member folder:', memberFolder);
    
    // Ensure images directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log('✅ Created images directory:', imagesDir);
    }

    // Get existing images count
    const existingImages = fs.existsSync(imagesDir) 
      ? fs.readdirSync(imagesDir).filter(f => f.startsWith('photo') && f.endsWith('.png'))
      : [];
    let nextIndex = existingImages.length + 1;

    const uploadedFiles = [];
    req.files.forEach((file, index) => {
      const filename = `photo${nextIndex + index}.png`;
      const filePath = path.join(imagesDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      console.log('✅ Gallery image saved to:', filePath);
      uploadedFiles.push(`members/${memberFolder}/images/${filename}`);
    });

    // Push to GitHub
    await pushToGithub(`Update gallery images for ${user.name}`);

    res.json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      images: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading gallery images:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadAvatar,
  uploadGalleryImages
};

