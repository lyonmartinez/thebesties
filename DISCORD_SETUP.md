# 🔐 Hướng dẫn Cấu hình Discord OAuth2 & Bot

Hướng dẫn chi tiết để thiết lập Discord OAuth2 đăng nhập và Discord Bot cho The Besties Gang.

---

## 📋 Mục lục

1. [Tạo Discord Application](#1-tạo-discord-application)
2. [Cấu hình OAuth2](#2-cấu-hình-oauth2)
3. [Tạo Discord Bot](#3-tạo-discord-bot)
4. [Cấu hình Environment Variables](#4-cấu-hình-environment-variables)
5. [Cập nhật Database](#5-cập-nhật-database)
6. [Khởi động Bot](#6-khởi-động-bot)
7. [Sử dụng Bot Commands](#7-sử-dụng-bot-commands)

---

## 1. Tạo Discord Application

### Bước 1: Truy cập Discord Developer Portal

1. Đăng nhập vào: https://discord.com/developers/applications
2. Nhấn **"New Application"**
3. Đặt tên: `The Besties Gang` (hoặc tên bạn muốn)
4. Nhấn **"Create"**

### Bước 2: Lấy Application ID

1. Vào tab **"General Information"**
2. Copy **"Application ID"** → Đây là `DISCORD_CLIENT_ID`
3. Lưu lại để dùng sau

---

## 2. Cấu hình OAuth2

### Bước 1: Thiết lập OAuth2

1. Vào tab **"OAuth2"** → **"General"**
2. Thêm **Redirect URL**:
   - **Localhost:** `http://localhost:5000/dashboard/login.html`
   - **Production:** `https://lyonmartinez.github.io/thebesties/dashboard/login.html`
3. Nhấn **"Add"** và **"Save Changes"**

### Bước 2: Lấy Client Secret

1. Vào tab **"OAuth2"** → **"General"**
2. Nhấn **"Reset Secret"** (nếu chưa có)
3. Copy **"Client Secret"** → Đây là `DISCORD_CLIENT_SECRET`
4. ⚠️ **Lưu ý:** Secret chỉ hiển thị 1 lần, hãy lưu ngay!

### Bước 3: Chọn Scopes

Trong OAuth2 URL Generator:
- ✅ **identify** - Lấy thông tin cơ bản (username, ID)
- ✅ **email** - Lấy email (nếu có)

---

## 3. Tạo Discord Bot

### Bước 1: Tạo Bot

1. Vào tab **"Bot"**
2. Nhấn **"Add Bot"** → **"Yes, do it!"**
3. Đặt tên bot: `The Besties Bot` (hoặc tên bạn muốn)
4. Tắt **"Public Bot"** (nếu chỉ dùng trong server riêng)

### Bước 2: Lấy Bot Token

1. Vào tab **"Bot"**
2. Nhấn **"Reset Token"** (nếu chưa có)
3. Copy **"Token"** → Đây là `DISCORD_BOT_TOKEN`
4. ⚠️ **Lưu ý:** Token chỉ hiển thị 1 lần, hãy lưu ngay!

### Bước 3: Bật Bot Intents

Trong tab **"Bot"**, bật các intents sau:
- ✅ **MESSAGE CONTENT INTENT** (nếu cần đọc tin nhắn)
- ✅ **SERVER MEMBERS INTENT** (nếu cần thông tin thành viên)

### Bước 4: Mời Bot vào Server

1. Vào tab **"OAuth2"** → **"URL Generator"**
2. Chọn scopes:
   - ✅ **bot**
   - ✅ **applications.commands** (cho slash commands)
3. Chọn permissions (tùy chọn):
   - ✅ **Send Messages**
   - ✅ **Read Message History**
   - ✅ **Use Slash Commands**
4. Copy **"Generated URL"** và mở trong trình duyệt
5. Chọn server và mời bot vào

---

## 4. Cấu hình Environment Variables

### Cập nhật `backend/.env`

Thêm các dòng sau vào file `backend/.env`:

```env
# Discord OAuth2
DISCORD_CLIENT_ID=your_application_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:5000/dashboard/login.html

# Discord Bot
DISCORD_BOT_TOKEN=your_bot_token_here
```

**Lưu ý:**
- `DISCORD_CLIENT_ID`: Application ID từ bước 1.2
- `DISCORD_CLIENT_SECRET`: Client Secret từ bước 2.2
- `DISCORD_REDIRECT_URI`: URL redirect (localhost hoặc production)
- `DISCORD_BOT_TOKEN`: Bot Token từ bước 3.2

### Production (Render/Deploy)

Khi deploy lên Render, cập nhật:
```env
DISCORD_REDIRECT_URI=https://lyonmartinez.github.io/thebesties/dashboard/login.html
```

Và thêm redirect URL này vào Discord OAuth2 settings.

---

## 5. Cập nhật Database

### Thêm Discord ID vào users.json

Mỗi user cần có `discordId` để đăng nhập bằng Discord.

**Cách 1: Lấy Discord ID từ Discord**

1. Bật Developer Mode trong Discord:
   - Settings → Advanced → Developer Mode
2. Right-click vào user → **"Copy User ID"**
3. Thêm vào `backend/data/users.json`:

```json
{
  "users": [
    {
      "id": 1,
      "username": "leader",
      "name": "Leader",
      "email": "leader@thebesties.gang",
      "role": "leader",
      "password": "$2a$10$...",
      "discordId": "123456789012345678",  // ← Thêm dòng này
      "discordUsername": "leader#1234",   // ← Tùy chọn
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Cách 2: Để user tự đăng nhập lần đầu**

Khi user đăng nhập bằng Discord lần đầu, hệ thống sẽ tự động lưu `discordId` vào database (nếu đã có user với username tương ứng).

---

## 6. Khởi động Bot

### Cài đặt Dependencies

```powershell
cd backend
npm install
```

### Chạy Backend (Bot sẽ tự động khởi động)

```powershell
npm start
```

Kết quả mong đợi:
```
🚀 The Besties Backend running on http://localhost:5000
🤖 Discord Bot "The Besties Bot#1234" đã sẵn sàng!
📊 Bot đang hoạt động trên 1 server(s)
✅ Slash commands đã được đăng ký!
```

---

## 7. Sử dụng Bot Commands

### Slash Commands trong Discord

#### `/profile`
Xem hồ sơ của bạn trong The Besties Gang.

**Ví dụ:**
```
/profile
```

**Kết quả:** Hiển thị embed với thông tin:
- Tên
- Vai trò/Character
- Discord ID
- Email
- Quyền (Leader/Member)
- Tiểu sử (nếu có)

#### `/edit-profile`
Chỉnh sửa hồ sơ của bạn.

**Cú pháp:**
```
/edit-profile name:"Tên mới" character:"Vai trò mới" bio:"Tiểu sử mới"
```

**Ví dụ:**
```
/edit-profile name:"Lyon Martinez" character:"Xạ thủ / Hậu cần"
/edit-profile bio:"Thành viên tích cực của The Besties Gang"
/edit-profile name:"New Name" character:"New Role" bio:"New bio"
```

**Lưu ý:**
- Có thể chỉnh sửa 1, 2, hoặc cả 3 thông tin cùng lúc
- Thay đổi sẽ được lưu vào `backend/data/users.json`
- Chỉ có thể chỉnh sửa hồ sơ của chính mình

---

## 🔧 Troubleshooting

### ❌ "Discord authorization failed"

**Nguyên nhân:**
- `DISCORD_CLIENT_ID` hoặc `DISCORD_CLIENT_SECRET` sai
- Redirect URI không khớp với cấu hình trong Discord
- Token đã hết hạn

**Giải pháp:**
1. Kiểm tra lại `.env` file
2. Kiểm tra Redirect URI trong Discord OAuth2 settings
3. Tạo lại Client Secret nếu cần

### ❌ "Discord ID không được đăng ký"

**Nguyên nhân:**
- User chưa có `discordId` trong database

**Giải pháp:**
1. Thêm `discordId` vào `backend/data/users.json`
2. Hoặc liên hệ Leader để được thêm vào hệ thống

### ❌ Bot không phản hồi commands

**Nguyên nhân:**
- Bot chưa được mời vào server
- Bot chưa có quyền sử dụng slash commands
- Bot token sai

**Giải pháp:**
1. Kiểm tra bot đã được mời vào server chưa
2. Kiểm tra bot có quyền "Use Slash Commands"
3. Kiểm tra `DISCORD_BOT_TOKEN` trong `.env`
4. Restart backend server

### ❌ "Cannot find module 'discord.js'"

**Giải pháp:**
```powershell
cd backend
npm install
```

### ❌ Slash commands không hiển thị

**Giải pháp:**
1. Đợi vài phút (Discord cần thời gian sync)
2. Restart bot
3. Kiểm tra bot có quyền "applications.commands" scope

---

## 📚 Tài liệu tham khảo

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord.js Documentation](https://discord.js.org/)
- [Discord OAuth2 Guide](https://discord.com/developers/docs/topics/oauth2)

---

## ✅ Checklist

Trước khi sử dụng, đảm bảo:

- [ ] Đã tạo Discord Application
- [ ] Đã cấu hình OAuth2 Redirect URI
- [ ] Đã lấy Client ID và Client Secret
- [ ] Đã tạo Bot và lấy Bot Token
- [ ] Đã mời Bot vào Discord server
- [ ] Đã cập nhật `backend/.env` với tất cả thông tin
- [ ] Đã thêm `discordId` vào `users.json` (hoặc để user tự đăng nhập)
- [ ] Đã cài đặt dependencies (`npm install`)
- [ ] Backend server đang chạy
- [ ] Bot đã sẵn sàng (kiểm tra console log)

---

**🎉 Hoàn tất! Bây giờ bạn có thể:**
- Đăng nhập bằng Discord OAuth2
- Sử dụng Discord Bot commands để xem/chỉnh sửa hồ sơ
- Quản lý thành viên qua Discord

