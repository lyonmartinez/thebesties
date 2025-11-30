# The Besties Gang Wiki - Backend Setup Guide

## Tổng quan hệ thống

Website The Besties hiện đã được nâng cấp với đầy đủ frontend và backend:

### ✨ Tính năng chính:

1. **Hệ thống xác thực (Authentication)**
   - Đăng nhập cho Member và Leader
   - JWT Token-based authentication
   - Quản lý tài khoản trực tiếp

2. **Dashboard Member**
   - Chỉnh sửa hồ sơ cá nhân
   - Cập nhật tiểu sử, vai trò, nhân vật
   - Xem thông tin của mình

3. **Dashboard Leader**
   - Quản lý toàn bộ thành viên
   - Thêm thành viên mới (tự động tạo folder)
   - Chỉnh sửa thông tin thành viên
   - Xóa thành viên

4. **GitHub Auto-Push**
   - Khi tạo/sửa/xóa member, tự động push lên GitHub
   - Tự động tạo folder member mới
   - Tự động commit và push

## Cấu trúc thư mục

```
Website The Besties/
├── backend/                          # API Server
│   ├── server.js                     # Main server file
│   ├── package.json                  # Dependencies
│   ├── .env                          # Environment variables
│   ├── config/                       # Configuration files
│   ├── routes/                       # API routes
│   │   ├── auth.js                   # Authentication routes
│   │   └── leader.js                 # Leader management routes
│   ├── controllers/                  # Business logic
│   │   ├── authController.js         # Auth logic
│   │   └── leaderController.js       # Leader logic
│   ├── middleware/                   # Custom middleware
│   │   └── auth.js                   # JWT authentication middleware
│   ├── utils/                        # Utility functions
│   │   └── github.js                 # Git/GitHub operations
│   └── data/
│       └── users.json                # User database
├── dashboard/                         # Frontend dashboards
│   ├── login.html                    # Login page
│   ├── member-dashboard.html         # Member profile editor
│   └── leader-dashboard.html         # Leader management panel
├── members/                           # Member folders (auto-generated)
├── images/
├── style.css
├── index.html
└── ...
```

## Cài đặt & Chạy

### 1. Cài đặt Dependencies

```powershell
cd backend
npm install
```

### 2. Cấu hình Environment Variables

Edit file `backend/.env`:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789
JWT_EXPIRE=7d
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=thebesties
GITHUB_OWNER=lyonmartinez
REPO_PATH=c:\Users\ADMID\Desktop\Website The Besties
```

**Lưu ý:**
- `JWT_SECRET`: Thay bằng một chuỗi bí mật dài hơn trong production
- `GITHUB_TOKEN`: Tạo từ https://github.com/settings/tokens (cần repo access)
- `REPO_PATH`: Đường dẫn tuyệt đối đến folder website

### 3. Chạy Backend

```powershell
cd backend
npm start
```

Server sẽ chạy trên `http://localhost:5000`

### 4. Truy cập Frontend

- **Đăng nhập:** http://localhost:5000/dashboard/login.html
- **Website chính:** http://localhost:5000/index.html

## Tài khoản mặc định

| Tài khoản | Mật khẩu | Vai trò |
|----------|---------|---------|
| leader | (hash) | Leader |
| member1 | (hash) | Member |
| member2 | (hash) | Member |
| member3 | (hash) | Member |
| member4 | (hash) | Member |

**⚠️ Đổi mật khẩu ngay sau khi cài đặt!**

Để hash mật khẩu mới, chạy:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('your_password', 10).then(hash => console.log(hash));
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật profile

### Leader Management
- `GET /api/leader/members` - Lấy danh sách thành viên
- `POST /api/leader/members` - Tạo thành viên mới
- `PUT /api/leader/members/:memberId` - Chỉnh sửa thành viên
- `DELETE /api/leader/members/:memberId` - Xóa thành viên

## Quy trình tạo Member mới

1. Leader đăng nhập vào `leader-dashboard.html`
2. Vào tab "Thêm thành viên"
3. Điền thông tin:
   - Tên đăng nhập
   - Tên hiển thị
   - Email
   - Mật khẩu
   - Vai trò (tuỳ chọn)
4. Nhấn "Tạo thành viên"

**Hệ thống sẽ tự động:**
- ✅ Tạo tài khoản
- ✅ Tạo folder `members/[username]/` với trang HTML
- ✅ Commit và push lên GitHub
- ✅ Cập nhật `users.json`

## Các tính năng GitHub Auto-Push

### Tạo Member
```
$ git add .
$ git commit -m "Add new member: Member Name"
$ git push origin main
```

### Cập nhật Member
```
$ git add .
$ git commit -m "Update member: Member Name"
$ git push origin main
```

### Xóa Member
```
$ git add .
$ git commit -m "Remove member: Member Name"
$ git push origin main
```

## Troubleshooting

### Backend không kết nối được
- Kiểm tra port 5000 có đang bị chiếm không
- Chạy `npm install` lại
- Kiểm tra `backend/.env`

### GitHub auto-push không hoạt động
- Kiểm tra `GITHUB_TOKEN` trong `.env`
- Kiểm tra `REPO_PATH` có đúng không
- Kiểm tra git config: `git config user.name` và `git config user.email`

### Login không hoạt động
- Kiểm tra token JWT trong localStorage
- Mở DevTools (F12) để xem lỗi
- Kiểm tra CORS settings trong `server.js`

### Folder member không được tạo
- Kiểm tra quyền ghi file của Node.js
- Kiểm tra `REPO_PATH` có tồn tại không
- Xem logs của backend

## Security Notes

⚠️ **Trước khi deploy production:**

1. Thay đổi `JWT_SECRET` thành một chuỗi dài, ngẫu nhiên
2. Tạo GitHub Personal Access Token mới
3. Cấu hình HTTPS
4. Thay đổi tất cả password mặc định
5. Bật CORS chỉ cho domain của bạn
6. Sử dụng environment variables thật (không hardcode)
7. Bật rate limiting
8. Implement logging và monitoring

## Contact & Support

- Leader: Quản lý tài khoản
- GitHub: Push to repo
- Email: contact@thebesties.gang (tuỳ chọn)

---

**The Besties Gang • FiveM** 🎮
Màu hồng nhưng không yếu đuối.
