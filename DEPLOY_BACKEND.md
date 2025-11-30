# Hướng dẫn Deploy Backend lên Render (Free)

Website frontend chạy trên GitHub Pages, nhưng backend cần deploy lên một service khác vì GitHub Pages chỉ serve static files.

## Bước 1: Deploy Backend lên Render

### 1.1. Tạo tài khoản Render
- Truy cập: https://render.com
- Đăng ký bằng GitHub account (miễn phí)

### 2.2. Tạo Web Service mới
1. Vào Dashboard → **New** → **Web Service**
2. Connect GitHub repository: `lyonmartinez/thebesties`
3. Cấu hình:
   - **Name**: `thebesties-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (có thể sleep sau 15 phút không dùng)

### 2.3. Cấu hình Environment Variables
Trong Render Dashboard → Environment:
```
PORT=10000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_this_123456789
JWT_EXPIRE=7d
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=thebesties
GITHUB_OWNER=lyonmartinez
REPO_PATH=/opt/render/project/src
```

### 2.4. Lấy Backend URL
Sau khi deploy xong, Render sẽ cung cấp URL như:
- `https://thebesties-backend.onrender.com`

## Bước 2: Cập nhật config.js

Sửa file `config.js` trong repo:
```javascript
const API_BASE_URL = isGitHubPages 
  ? 'https://thebesties-backend.onrender.com/api'  // Thay bằng URL của bạn
  : 'http://localhost:5000/api';
```

Sau đó commit và push lên GitHub.

## Bước 3: Enable GitHub Pages

1. Vào GitHub repo: https://github.com/lyonmartinez/thebesties
2. Settings → Pages
3. Source: **GitHub Actions** (sẽ tự động deploy khi push)
4. Save

## Bước 4: Kiểm tra

- Frontend: https://lyonmartinez.github.io/thebesties
- Backend API: https://thebesties-backend.onrender.com/api/health

## Lưu ý

- Render Free tier có thể sleep sau 15 phút không dùng (lần đầu wake up sẽ mất ~30 giây)
- Nếu muốn không sleep, có thể upgrade lên Paid plan ($7/tháng)
- Hoặc sử dụng các service khác: Railway, Fly.io, Heroku, Vercel Serverless Functions

## Alternative: Railway

1. Truy cập: https://railway.app
2. New Project → Deploy from GitHub
3. Chọn repo → Add Service → GitHub Repo
4. Root Directory: `backend`
5. Start Command: `npm start`
6. Thêm Environment Variables tương tự như Render

