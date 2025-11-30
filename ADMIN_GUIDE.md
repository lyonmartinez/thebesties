# 👑 Admin Account Management Guide

## Quản lý Tài khoản - Hướng dẫn cho Admin (Leader)

### 📍 Vị trí file database
```
backend/data/users.json
```

---

## 🔑 Đổi Mật khẩu

### Cách 1: Sử dụng Node.js Script (Khuyến khích)

1. Tạo file `backend/hash-password.js`:
```javascript
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node hash-password.js "your_password"');
  process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
  console.log('Hashed password:');
  console.log(hash);
  console.log('\nCopy this hash into users.json');
}).catch(err => console.error(err));
```

2. Chạy:
```powershell
cd backend
node hash-password.js "NewPassword123!"
```

3. Copy hash result vào `users.json`

### Cách 2: Edit file trực tiếp

1. Mở `backend/data/users.json`
2. Tìm user cần đổi mật khẩu
3. Thay thế field `"password"` bằng hash mới (lấy từ script)
4. Lưu file

---

## 👥 Thêm/Xóa User Thủ công

### Thêm User Mới (JSON)
```json
{
  "id": "member-xyz123",
  "username": "newmember",
  "email": "newmember@thebesties.gang",
  "password": "$2a$10$...",
  "role": "member",
  "name": "New Member",
  "character": "Vai trò",
  "folder": "newmember",
  "createdAt": "2025-01-01T00:00:00Z",
  "isActive": true
}
```

### Thay đổi Role
```json
// Từ member → leader
"role": "leader"
```

### Deactivate User (vô hiệu hóa)
```json
"isActive": false
```

---

## 🔄 Backup & Restore

### Backup Database
```powershell
copy "backend\data\users.json" "backend\data\users.backup.json"
```

### Restore từ Backup
```powershell
copy "backend\data\users.backup.json" "backend\data\users.json"
```

---

## 🚨 Emergency Procedures

### Nếu quên password Leader

1. Edit `backend/data/users.json`
2. Tìm user với `"role": "leader"`
3. Hash password mới (xem Đổi Mật khẩu)
4. Cập nhật `"password"` field
5. Restart backend
6. Đăng nhập với password mới

### Nếu ai đó bị account hack

1. Xóa tài khoản hoặc set `"isActive": false`
2. Tạo tài khoản mới
3. Thông báo cho user
4. Commit & push: `git commit -m "Security: Reset compromised account"`

### Nếu .env bị leak

1. **Ngay lập tức:**
   - Tạo GitHub token mới
   - Xóa token cũ: https://github.com/settings/tokens
   - Update `.env` với token mới

2. **Commit:**
   ```
   git add backend/.env
   git commit -m "Security: Rotate GitHub token"
   git push
   ```

---

## 📋 User Status Reference

| Field | Giá trị | Ý nghĩa |
|-------|--------|---------|
| isActive | true | Tài khoản hoạt động |
| isActive | false | Tài khoản bị vô hiệu hóa |
| role | "leader" | Quản trị viên |
| role | "member" | Thành viên bình thường |

---

## 🔐 Password Requirements

Khi tạo mật khẩu, nên tuân theo:
- ✅ Ít nhất 8 ký tự
- ✅ Có chữ hoa + chữ thường
- ✅ Có số + ký tự đặc biệt
- ✅ Không phải tên user hoặc email

Ví dụ tốt:
- `Th3Best1es#2025`
- `Pink&Power99!`
- `GangL3ader@FiveM`

---

## 📊 User Management via Dashboard

### Nên sử dụng Dashboard Leader để:
- ✅ Thêm member mới
- ✅ Chỉnh sửa thông tin
- ✅ Xóa member
- ✅ Xem danh sách

### Edit file JSON chỉ khi:
- 🔒 Cần đổi mật khẩu admin
- 🔒 Server không chạy
- 🔒 Cần backup/restore
- 🔒 Emergency case

---

## 🛡️ Security Best Practices

1. **Không share JSON file**
   - Chứa password hash
   - Giữ bí mật

2. **Đổi JWT_SECRET thường xuyên**
   - Mỗi 3 tháng
   - Khi có người rời gang

3. **Backup thường xuyên**
   - Hàng tuần
   - Lưu ở nơi an toàn

4. **Theo dõi GitHub logs**
   - Xem ai push gì
   - Detect suspicious activity

5. **Use strong passwords**
   - Cho tất cả tài khoản
   - Nhất là leader account

---

## 🆘 Troubleshooting

### ❌ User không thể đăng nhập
```
Kiểm tra:
1. Username/email có đúng không?
2. Password hash đúng chưa?
3. isActive = true chưa?
4. Backend đang chạy chưa?
```

### ❌ Member folder bị xóa
```
Cách khôi phục:
1. Restore users.json từ backup
2. Tạo lại folder members/[username]/
3. Git commit & push
```

### ❌ JWT Token lỗi
```
Giải pháp:
1. Clear localStorage trên browser
2. Restart backend
3. Đăng nhập lại
4. Nếu vẫn lỗi, thay JWT_SECRET
```

---

## 📞 Contact

- Issue? Xem logs: Chạy backend với `npm run dev`
- Need help? Xem `BACKEND_SETUP.md`
- Emergency? Restore từ backup

---

**The Besties Gang**  
Quản lý tài khoản an toàn! 🔒
