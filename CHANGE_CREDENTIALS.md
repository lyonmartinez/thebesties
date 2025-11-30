# 🔐 Hướng dẫn Thay đổi Username & Password

## 📋 Thông tin hiện tại
- File database: `backend/data/users.json`
- Password hiện tại (tất cả user): `123456`

---

## 🔑 Cách 1: Thay đổi Password (Dễ nhất)

### Bước 1: Generate hash mới cho password mới

1. Mở PowerShell trong thư mục `backend`
2. Chạy lệnh:
```powershell
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password_moi', 10, (err, hash) => { if (err) console.error(err); else console.log(hash); });"
```

**Ví dụ:** Nếu bạn muốn password là `Admin@123`
```powershell
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin@123', 10, (err, hash) => { if (err) console.error(err); else console.log(hash); });"
```

Sẽ in ra hash như: `$2a$10$...`

### Bước 2: Cập nhật file users.json

1. Mở `backend/data/users.json`
2. Tìm user bạn muốn đổi password
3. Thay đổi trường `password`:

```json
{
  "id": "member-001",
  "username": "member1",
  "password": "PASTE_HASH_MỚI_TẠI_ĐÂY",
  ...
}
```

### Bước 3: Lưu và khởi động lại server

```powershell
node server.js
```

---

## 👤 Cách 2: Thay đổi Username

### Bước 1: Mở file `backend/data/users.json`

### Bước 2: Sửa trường `username`

```json
{
  "id": "member-001",
  "username": "username_moi",  // ← Thay đổi tại đây
  "email": "member1@thebesties.gang",
  "password": "$2a$10$...",
  ...
}
```

### Bước 3: Lưu file và khởi động lại server

---

## 📝 Ví dụ Thực tế

### Thay đổi member1 thành "MyUsername" + Password "MyPassword@123"

1. **Generate hash:**
```powershell
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('MyPassword@123', 10, (err, hash) => { if (err) console.error(err); else console.log(hash); });"
```
Kết quả: `$2a$10$xyz...abc`

2. **Sửa users.json:**
```json
{
  "id": "member-001",
  "username": "MyUsername",
  "email": "member1@thebesties.gang",
  "password": "$2a$10$xyz...abc",
  "role": "member",
  "name": "Member 1",
  ...
}
```

3. **Khởi động lại backend**

4. **Đăng nhập với:**
   - Username: `MyUsername`
   - Password: `MyPassword@123`

---

## 🚀 Script tự động (Nâng cao)

Tạo file `change-password.js` trong folder `backend`:

```javascript
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
  console.error('Cách dùng: node change-password.js <username> <new_password>');
  process.exit(1);
}

bcrypt.hash(newPassword, 10, (err, hash) => {
  if (err) {
    console.error('Lỗi:', err);
    process.exit(1);
  }

  const usersPath = path.join(__dirname, 'data/users.json');
  const data = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

  const user = data.users.find(u => u.username === username);
  if (!user) {
    console.error(`User '${username}' không tìm thấy`);
    process.exit(1);
  }

  user.password = hash;
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
  
  console.log(`✅ Đổi password cho '${username}' thành công!`);
  console.log(`📝 Password mới: ${newPassword}`);
});
```

**Cách dùng:**
```powershell
node change-password.js member1 MyPassword@123
```

---

## ⚠️ Lưu ý quan trọng

✅ Lưu luôn file sau khi sửa
✅ Khởi động lại backend sau mỗi thay đổi
✅ Password phải đúng format hash bcryptjs
❌ Không chỉnh sửa trực tiếp trường password mà không hash
❌ Không xóa dấu `$2a$10$` ở đầu hash

---

## 🆘 Gặp vấn đề?

**Lỗi: "Cannot find module 'bcryptjs'"**
→ Chạy: `npm install bcryptjs`

**Lỗi: "Username not found"**
→ Kiểm tra lại username có tồn tại trong users.json

**Login vẫn không được**
→ Kiểm tra xem backend có đang chạy trên port 5000 không
→ Xem console backend có lỗi gì không
