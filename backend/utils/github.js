const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const executeGitCommand = (command, cwd = process.env.REPO_PATH) => {
  return new Promise((resolve, reject) => {
    const process = spawn('git', command.split(' '), { cwd });
    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || stdout));
      }
    });
  });
};

const pushToGithub = async (commitMessage = 'Auto-update from backend') => {
  try {
    // Stage all changes
    await executeGitCommand('add .');
    
    // Check if there are changes to commit
    const status = await executeGitCommand('status --short');
    if (!status.trim()) {
      return { success: true, message: 'No changes to commit' };
    }

    // Commit
    await executeGitCommand(`commit -m "${commitMessage}"`);
    
    // Push
    await executeGitCommand('push origin main');
    
    return { success: true, message: 'Pushed to GitHub successfully' };
  } catch (error) {
    console.error('Git error:', error);
    return { success: false, error: error.message };
  }
};

const createMemberFolder = (memberId, memberName) => {
  const membersPath = path.join(process.env.REPO_PATH, 'members', memberId);
  const imagesPath = path.join(membersPath, 'images');

  try {
    // Create folders
    if (!fs.existsSync(membersPath)) {
      fs.mkdirSync(membersPath, { recursive: true });
    }
    if (!fs.existsSync(imagesPath)) {
      fs.mkdirSync(imagesPath, { recursive: true });
    }

    // Create index.html
    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${memberName} - The Besties Gang Wiki</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../style.css" />
</head>
<body>
  <script>
    if (sessionStorage.getItem('thebesties_access') !== 'granted') {
      window.location.href = '../../login.html';
    }
  </script>
  
  <div class="bg-blur"></div>
  
  <header class="topbar">
    <div class="logo">
      <img class="logo-badge" src="../../images/logo_thebesties.png" alt="The Besties Logo" />
      <span class="logo-text">The Besties Wiki</span>
    </div>
    <div class="security-badge">🔒 Chính thức</div>
    <nav class="nav">
      <div class="nav-dropdown">
        <button class="nav-toggle">
          Danh mục
          <span class="nav-chevron">˅</span>
        </button>
        <div class="nav-menu">
          <a href="../../index.html#overview">Giới thiệu</a>
          <a href="../../index.html#leader">Leader</a>
          <a href="../../index.html#members">Thành viên</a>
          <a href="../../index.html#discord">Discord</a>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero-compact section">
      <div class="section-header">
        <h2>${memberName} • Hồ sơ thành viên</h2>
        <p>Trang hồ sơ chi tiết về thành viên ${memberName}.</p>
      </div>

      <div class="member-profile-layout" style="margin-top:18px;">
        <aside class="member-profile-meta">
          <div class="avatar-large">
            <img src="images/avatar.jpg" alt="${memberName}" style="width:96px;height:96px;border-radius:999px;display:block;object-fit:cover;" onerror="this.style.display='none';" />
          </div>
          <h3 class="member-profile-role">${memberName}</h3>

          <div class="member-profile-info">
            <div>
              <dt>Vai trò</dt>
              <dd>Thành viên Gang</dd>
            </div>
            <div>
              <dt>Gia nhập</dt>
              <dd>2025</dd>
            </div>
            <div>
              <dt>Trạng thái</dt>
              <dd>Hoạt động</dd>
            </div>
          </div>
        </aside>

        <div class="member-profile-content">
          <h3>Giới thiệu</h3>
          <p>
            Đây là trang hồ sơ của ${memberName}. Nội dung này có thể được chỉnh sửa bởi chính thành viên hoặc Leader.
          </p>

          <section style="margin-top:18px;">
            <h4>Thông tin Chi tiết</h4>
            <p>
              <strong>Nhân vật:</strong> [Nhân vật game/FiveM của bạn]
            </p>
            <p>
              <strong>Chuyên môn:</strong> [Kỹ năng chính của bạn]
            </p>
            <p>
              <strong>Tiểu sử:</strong> [Câu chuyện của bạn trong Gang]
            </p>
          </section>

          <section style="margin-top:24px;">
            <h4>Hình ảnh & Khoảnh khắc</h4>
            <div class="member-gallery">
              <figure class="member-photo">
                <img src="images/photo1.jpg" alt="Highlight 1" onerror="this.parentElement.style.display='none';" />
                <figcaption>Khoảnh khắc</figcaption>
              </figure>
              <figure class="member-photo">
                <img src="images/photo2.jpg" alt="Highlight 2" onerror="this.parentElement.style.display='none';" />
                <figcaption>Khoảnh khắc</figcaption>
              </figure>
            </div>
          </section>

          <section style="margin-top:24px;">
            <a href="../../dashboard/member.html" class="btn primary">Chỉnh sửa hồ sơ</a>
            <a href="../../index.html#members" class="btn ghost" style="margin-left:8px;">Quay lại danh sách</a>
          </section>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p>
      The Besties Gang • FiveM  
      <span class="footer-sub">Màu hồng nhưng không yếu đuối.</span>
    </p>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(membersPath, 'index.html'), htmlContent);

    return { success: true, path: membersPath };
  } catch (error) {
    console.error('Error creating member folder:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  executeGitCommand,
  pushToGithub,
  createMemberFolder
};
