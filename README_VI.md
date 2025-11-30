# 🎮 The Besties Gang • FiveM Wiki

**Màu hồng nhưng không yếu đuối!**

Đây là website wiki chính thức của Gang The Besties trên FiveM server, với hệ thống quản lý đầy đủ frontend và backend.

---

## 🌟 Tính năng chính

### 📖 Website chính
- Trang chủ đẹp mắt với logo BAS1125
- Giới thiệu gang và sứ mệnh
- Hồ sơ chi tiết của Leader
- Danh sách 4 thành viên chính
- Phần bảo mật & an toàn
- Tin tức & cập nhật gang
- Discord integration
- Responsive trên mọi thiết bị

### 🔐 Hệ thống xác thực
- Đăng nhập an toàn với JWT Token
- Role-based access (Member & Leader)
- Password hashing (bcryptjs)
- Session management tự động

### 👤 Dashboard Member
- Chỉnh sửa hồ sơ cá nhân
- Cập nhật tên, vai trò, nhân vật
- Thêm tiểu sử & giới thiệu
- Upload hình ảnh
- Tự động push lên GitHub

### 👑 Dashboard Leader
- Quản lý toàn bộ thành viên
- Thêm member mới tự động:
  - Tạo tài khoản
  - Tạo folder & trang web
  - Tạo git commit & push
- Chỉnh sửa thông tin member
- Xóa member
- Quản lý cài đặt gang

### 🤖 GitHub Auto-Integration
- Tự động tạo commit khi có thay đổi
- Tự động push lên main branch
- Tự động tạo folder member mới
- Full git history & tracking

---

## 📁 Cấu trúc dự án

```
Website The Besties/
├── 📄 index.html                 # Trang chủ
├── 📄 style.css                  # Styling chung
├── 📁 dashboard/                 # Dashboards
│   ├── login.html                # Trang đăng nhập
│   ├── member-dashboard.html     # Dashboard member
│   └── leader-dashboard.html     # Dashboard leader
├── 📁 members/                   # Folder members (auto-generated)
│   ├── member1/
│   ├── member2/
│   ├── member3/
│   └── member4/
├── 📁 images/                    # Hình ảnh
│   └── logo_thebesties.png       # Logo gang
├── 📁 backend/                   # Backend API
│   ├── server.js                 # Main server
│   ├── package.json              # Dependencies
│   ├── .env                      # Configuration
│   ├── 📁 routes/                # API endpoints
│   ├── 📁 controllers/           # Business logic
│   ├── 📁 middleware/            # Authentication
│   ├── 📁 utils/                 # Helper functions
│   └── 📁 data/
│       └── users.json            # User database
├── 📄 QUICK_START.md             # Khởi động nhanh
├── 📄 BACKEND_SETUP.md           # Hướng dẫn chi tiết
├── 📄 ADMIN_GUIDE.md             # Quản lý tài khoản
├── 📄 FEATURES.md                # Danh sách tính năng
└── 📄 START_BACKEND.ps1          # Startup script
```

---

## 🚀 Khởi động nhanh

### Yêu cầu
- Node.js 14+ (Tải: https://nodejs.org/)
- Git (Tải: https://git-scm.com/)

### Windows (PowerShell)

1. Mở PowerShell tại folder website
2. Chạy script:
```powershell
.\START_BACKEND.ps1
```

3. Truy cập:
- Dashboard: http://localhost:5000/dashboard/login.html
- Website: http://localhost:5000/index.html

### macOS / Linux

```bash
bash START_BACKEND.sh
```

### Manual Setup

```bash
cd backend
npm install
npm start
```

---

## 👤 Tài khoản test

| Username | Mật khẩu | Vai trò |
|----------|---------|---------|
| leader | (đã hash) | 👑 Leader - Quản lý gang |
| member1 | (đã hash) | 👥 Member |
| member2 | (đã hash) | 👥 Member |
| member3 | (đã hash) | 👥 Member |
| member4 | (đã hash) | 👥 Member |

⚠️ **Đổi mật khẩu sau khi cài đặt!** (Xem `ADMIN_GUIDE.md`)

---

## 📚 Hướng dẫn sử dụng

### Member - Cập nhật hồ sơ

1. Truy cập: http://localhost:5000/dashboard/login.html
2. Đăng nhập với tài khoản member
3. Chỉnh sửa:
   - Tên hiển thị
   - Vai trò/Nhân vật (FiveM)
   - Tiểu sử cá nhân
4. Nhấn "Lưu thay đổi"
5. ✅ Thay đổi được push lên GitHub tự động

### Leader - Quản lý gang

#### Xem danh sách members
1. Đăng nhập với tài khoản leader
2. Dashboard Leader mở ra
3. Tab "Quản lý thành viên" xem danh sách

#### Thêm member mới
1. Tab "Thêm thành viên"
2. Điền thông tin:
   - Tên đăng nhập (username)
   - Tên hiển thị
   - Email
   - Mật khẩu
   - Vai trò (tuỳ chọn)
3. Nhấn "Tạo thành viên"
4. ✅ Hệ thống tự động:
   - Tạo tài khoản
   - Tạo folder `members/[username]/`
   - Tạo trang HTML
   - Commit & push GitHub

#### Chỉnh sửa member
1. Danh sách → Nhấn "✏️ Sửa"
2. Cập nhật thông tin
3. Lưu
4. ✅ Push GitHub tự động

#### Xóa member
1. Danh sách → Nhấn "🗑️ Xóa"
2. Xác nhận
3. ✅ Folder & tài khoản bị xóa
4. ✅ Push GitHub tự động

---

## 🔗 API Documentation

### Endpoints chính

```
POST   /api/auth/login              # Đăng nhập
GET    /api/auth/me                 # Lấy user hiện tại
PUT    /api/auth/profile            # Cập nhật profile
GET    /api/leader/members          # Danh sách members (Leader)
POST   /api/leader/members          # Tạo member mới (Leader)
PUT    /api/leader/members/:id      # Cập nhật member (Leader)
DELETE /api/leader/members/:id      # Xóa member (Leader)
```

Chi tiết: Xem `BACKEND_SETUP.md`

---

## 📖 Tài liệu

| File | Nội dung |
|------|---------|
| **QUICK_START.md** | Khởi động nhanh 5 phút |
| **BACKEND_SETUP.md** | Hướng dẫn chi tiết setup |
| **ADMIN_GUIDE.md** | Quản lý tài khoản & bảo mật |
| **FEATURES.md** | Danh sách tính năng đầy đủ |

---

## 🔒 Bảo mật

### ✅ Đã cấu hình
- JWT Token authentication
- Password hashing (bcryptjs)
- Role-based authorization
- CORS protection
- Environment variables

### ⚠️ Cần làm trước production
- Thay đổi `JWT_SECRET` trong `.env`
- Tạo GitHub token mới
- Thay đổi tất cả mật khẩu mặc định
- Cấu hình HTTPS
- Bật rate limiting
- Setup email verification

Chi tiết: Xem `ADMIN_GUIDE.md`

---

## 🤝 GitHub Integration

### Auto-commit & Push

Khi Leader tạo/cập nhật/xóa member:

```
Action: Tạo member mới
│
├─ Backend tạo tài khoản
├─ Backend tạo folder
├─ Backend tạo HTML file
│
├─ Git commit "Add new member: [Name]"
├─ Git push origin main
│
└─ ✅ Tất cả thay đổi trên GitHub
```

### Repository Info
- **Repo:** https://github.com/lyonmartinez/thebesties
- **Branch:** main
- **Auto-deploy:** Có thể config GitHub Actions

---

## 🛠️ Troubleshooting

### ❌ Backend không khởi động
```powershell
# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Cài lại dependencies
cd backend
npm install
npm start
```

### ❌ Port 5000 đang dùng
```powershell
# Tìm process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Hoặc thay port trong .env
```

### ❌ GitHub auto-push không hoạt động
1. Kiểm tra `GITHUB_TOKEN` trong `.env`
2. Token có quyền repo không?
3. Kiểm tra `git config user.name`
4. Kiểm tra `git config user.email`

### ❌ Login không hoạt động
1. Mở DevTools (F12)
2. Kiểm tra Console có lỗi?
3. Backend đang chạy?
4. Username/password đúng?

Chi tiết: Xem `BACKEND_SETUP.md`

---

## 📞 Support

- **Documentation:** Xem folder này
- **Backend Logs:** Chạy `npm run dev` để xem chi tiết
- **GitHub Issues:** Report bugs tại repository

---

## 🎯 Roadmap

### Phase 1 ✅ (Hoàn thành)
- ✅ Frontend website
- ✅ Backend API
- ✅ Member dashboard
- ✅ Leader dashboard
- ✅ GitHub auto-push

### Phase 2 (Có thể phát triển)
- [ ] Database thực (MongoDB)
- [ ] Email verification
- [ ] Password reset
- [ ] 2FA authentication
- [ ] Image upload storage
- [ ] Activity logging
- [ ] Analytics dashboard
- [ ] Mobile app

---

## 👨‍💻 Developers

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** JSON (có thể upgrade MongoDB)
- **Auth:** JWT + bcryptjs
- **Deployment:** GitHub Pages / Custom Server
- **CI/CD:** GitHub Actions (tuỳ chọn)

---

## 📜 License

Dự án này được tạo cho **The Besties Gang** trên FiveM server.
Sử dụng nội bộ.

---

## 🎉 Getting Started

1. **Đọc hướng dẫn:**
   - Quick: `QUICK_START.md` (5 phút)
   - Chi tiết: `BACKEND_SETUP.md`

2. **Khởi động backend:**
   ```powershell
   .\START_BACKEND.ps1
   ```

3. **Truy cập website:**
   - Đăng nhập: http://localhost:5000/dashboard/login.html
   - Website: http://localhost:5000/index.html

4. **Bắt đầu sử dụng:**
   - Member: Cập nhật hồ sơ
   - Leader: Thêm/quản lý members

---

## 📊 Stats

- **Lines of Code:** 2500+
- **API Endpoints:** 8
- **Dashboards:** 3 (login, member, leader)
- **GitHub Auto Actions:** 3 (create, update, delete)
- **Documentation Pages:** 5

---

**The Besties Gang • FiveM**

*Đông tết hội hè mà mình còn nhớ được anh em sau này cùng vào đó*

🎮 Chơi lành, chơi fair, support team!
