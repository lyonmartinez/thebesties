# Hướng dẫn Setup GitHub Pages

Website The Besties đã được cấu hình để chạy trên GitHub Pages 24/7.

## ✅ Đã hoàn thành

1. ✅ Tạo `config.js` - Tự động detect GitHub Pages vs localhost
2. ✅ Cập nhật tất cả dashboard files để sử dụng config
3. ✅ Tạo GitHub Actions workflow để auto-deploy
4. ✅ Tạo `.nojekyll` để serve static files đúng cách

## 🚀 Bước tiếp theo

### 1. Enable GitHub Pages

1. Vào GitHub repo: https://github.com/lyonmartinez/thebesties
2. **Settings** → **Pages**
3. **Source**: Chọn **GitHub Actions**
4. Save

### 2. Deploy Backend

Backend cần deploy lên một service khác (Render, Railway, etc.) vì GitHub Pages chỉ serve static files.

Xem hướng dẫn chi tiết: [DEPLOY_BACKEND.md](./DEPLOY_BACKEND.md)

### 3. Cập nhật Backend URL trong config.js

Sau khi deploy backend, sửa file `config.js`:
```javascript
const API_BASE_URL = isGitHubPages 
  ? 'https://your-backend-url.onrender.com/api'  // Thay bằng URL backend của bạn
  : 'http://localhost:5000/api';
```

### 4. Push lên GitHub

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

GitHub Actions sẽ tự động deploy website lên GitHub Pages.

## 🌐 URLs sau khi deploy

- **Frontend (GitHub Pages)**: https://lyonmartinez.github.io/thebesties
- **Backend API**: https://your-backend-url.onrender.com/api

## 📝 Lưu ý

- Website sẽ tự động cập nhật mỗi khi push code lên `main` branch
- Backend URL trong `config.js` sẽ tự động được sử dụng khi chạy trên GitHub Pages
- Khi chạy localhost, vẫn sử dụng `http://localhost:5000/api`

## 🔧 Troubleshooting

### Website không load được
- Kiểm tra GitHub Actions workflow có chạy thành công không
- Kiểm tra Settings → Pages → Source đã chọn GitHub Actions chưa

### API không hoạt động
- Kiểm tra backend đã deploy chưa
- Kiểm tra URL trong `config.js` đã đúng chưa
- Kiểm tra CORS settings trong backend server

### 404 errors
- Đảm bảo file `.nojekyll` có trong repo
- Kiểm tra đường dẫn file có đúng không (case-sensitive)

