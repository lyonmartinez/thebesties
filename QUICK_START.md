# 🚀 The Besties Gang - Quick Start Guide

## ⚡ Khởi động nhanh (5 phút)

### Windows (PowerShell)

1. Mở PowerShell tại thư mục website
2. Chạy:
```powershell
.\START_BACKEND.ps1
```

### macOS / Linux

```bash
bash START_BACKEND.sh
```

---

## 📝 Bước khởi động chi tiết

### 1️⃣ Cài đặt Node.js (nếu chưa có)
- Tải từ https://nodejs.org/ (LTS version)
- Cài đặt và kiểm tra: `node --version` và `npm --version`

### 2️⃣ Cài đặt Dependencies
```powershell
cd backend
npm install
```

### 3️⃣ Cấu hình GitHub (Tuỳ chọn)
Edit file `backend/.env`:
```
GITHUB_TOKEN=your_github_personal_access_token
```
Tạo token tại: https://github.com/settings/tokens

### 4️⃣ Chạy Backend
```powershell
npm start
```

Kết quả:
```
🚀 The Besties Backend running on http://localhost:5000
```

---

## 🌐 Truy cập các trang

| Trang | URL | Ghi chú |
|------|-----|---------|
| Đăng nhập | http://localhost:5000/dashboard/login.html | Tất cả user |
| Dashboard Member | http://localhost:5000/dashboard/member-dashboard.html | Sau khi đăng nhập |
| Dashboard Leader | http://localhost:5000/dashboard/leader-dashboard.html | Chỉ Leader |
| Website chính | http://localhost:5000/index.html | Công khai |

---

## 👤 Tài khoản test

| Username | Mật khẩu | Vai trò |
|----------|---------|---------|
| leader | (đã hash) | 👑 Leader |
| member1 | (đã hash) | 👥 Member |
| member2 | (đã hash) | 👥 Member |
| member3 | (đã hash) | 👥 Member |
| member4 | (đã hash) | 👥 Member |

**Mật khẩu mặc định:** Các tài khoản đã được hash. Để đổi mật khẩu, liên hệ Leader.

---

## 🎮 Sử dụng chức năng

### 👥 Member - Chỉnh sửa hồ sơ
1. Đăng nhập với tài khoản member
2. Chỉnh sửa tên, vai trò, tiểu sử
3. Nhấn "Lưu thay đổi"
4. Thay đổi được push lên GitHub tự động

### 👑 Leader - Quản lý thành viên
1. Đăng nhập với tài khoản leader
2. Dashboard Leader mở ra
3. **Quản lý thành viên:** Chỉnh sửa hoặc xóa
4. **Thêm thành viên:**
   - Tab "Thêm thành viên"
   - Điền thông tin
   - Nhấn "Tạo thành viên"
   - ✅ Tự động tạo folder
   - ✅ Tự động push GitHub
   - ✅ Cập nhật database

---

## 🔧 Troubleshooting

### ❌ "Port 5000 is already in use"
```powershell
# Tìm process đang dùng port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Hoặc thay đổi PORT trong backend/.env
```

### ❌ "npm: command not found"
- Node.js chưa được cài hoặc không trong PATH
- Cài lại Node.js: https://nodejs.org/

### ❌ "Cannot find module 'express'"
```powershell
cd backend
npm install
```

### ❌ GitHub auto-push không hoạt động
1. Kiểm tra `backend/.env` có `GITHUB_TOKEN`
2. Kiểm tra token còn hạn
3. Kiểm tra quyền repo của token
4. Chạy: `git config user.name` và `git config user.email`

### ❌ Login không hoạt động
- Mở DevTools: F12 → Console
- Kiểm tra lỗi gì
- Xác nhận username/password đúng
- Kiểm tra backend đang chạy

---

## 📚 File quan trọng

```
backend/
├── server.js              # Main server
├── package.json           # Dependencies
├── .env                   # Configuration
├── data/users.json        # User database
├── routes/                # API endpoints
├── controllers/           # Business logic
├── middleware/            # Authentication
└── utils/github.js        # Git operations
```

---

## 🔐 Security Checklist

Trước khi production:

- [ ] Thay đổi `JWT_SECRET` trong `.env`
- [ ] Tạo GitHub token mới
- [ ] Đổi tất cả password mặc định
- [ ] Bật HTTPS
- [ ] Cấu hình CORS đúng
- [ ] Bật rate limiting
- [ ] Backup dữ liệu

---

## 📞 Support

Câu hỏi? Kiểm tra `BACKEND_SETUP.md` để có thêm thông tin chi tiết.

---

**The Besties Gang • FiveM**  
Màu hồng nhưng không yếu đuối. 🎮
