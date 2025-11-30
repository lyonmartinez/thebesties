# ✅ Bot Discord đã được cấu hình thành công!

## 🎉 Đã hoàn thành

### ✅ Cấu hình Bot
- **Client ID:** `1444665930025144402` ✅
- **Bot Token:** Đã được cấu hình ✅
- **Bot Name:** The Besties#2522 ✅
- **Bot ID:** 1444665930025144402 ✅

### ✅ Dependencies
- `discord.js` đã được cài đặt ✅
- `axios` đã được cài đặt ✅

### ✅ Files đã cập nhật
- `backend/.env` - Đã thêm Discord config
- Bot đã được test và hoạt động thành công

---

## ⚠️ Cần bổ sung (cho OAuth2 đăng nhập)

### DISCORD_CLIENT_SECRET

Để sử dụng tính năng **"Đăng nhập với Discord"**, bạn cần:

1. Vào https://discord.com/developers/applications
2. Chọn application của bạn (ID: 1444665930025144402)
3. Vào tab **"OAuth2"** → **"General"**
4. Copy **"Client Secret"**
5. Cập nhật trong `backend/.env`:
   ```env
   DISCORD_CLIENT_SECRET=your_actual_client_secret_here
   ```

**Lưu ý:** Client Secret chỉ hiển thị 1 lần. Nếu đã mất, nhấn "Reset Secret" để tạo mới.

---

## 🚀 Cách khởi động

### 1. Khởi động Backend Server (Bot sẽ tự động chạy)

```powershell
cd backend
npm start
```

Bot sẽ tự động khởi động khi server chạy!

### 2. Kiểm tra Bot

Khi server chạy, bạn sẽ thấy:
```
🤖 Discord Bot đã được khởi động
🚀 The Besties Backend running on http://localhost:5000
🤖 Discord Bot: Đang hoạt động
```

---

## 📝 Mời Bot vào Discord Server

### Bước 1: Tạo Invite Link

1. Vào https://discord.com/developers/applications
2. Chọn application của bạn
3. Vào tab **"OAuth2"** → **"URL Generator"**
4. Chọn scopes:
   - ✅ **bot**
   - ✅ **applications.commands** (cho slash commands)
5. Chọn permissions (tùy chọn):
   - ✅ **Send Messages**
   - ✅ **Read Message History**
   - ✅ **Use Slash Commands**
6. Copy **"Generated URL"**

### Bước 2: Mời Bot

1. Mở URL đã copy trong trình duyệt
2. Chọn Discord server của bạn
3. Nhấn **"Authorize"**
4. Bot sẽ xuất hiện trong server!

---

## 🎮 Sử dụng Bot Commands

Sau khi bot đã vào server, bạn có thể dùng:

### `/profile`
Xem hồ sơ của bạn trong The Besties Gang

### `/edit-profile`
Chỉnh sửa hồ sơ:
- `name` - Tên hiển thị
- `character` - Vai trò/Character
- `bio` - Tiểu sử

**Ví dụ:**
```
/edit-profile name:"Lyon Martinez" character:"Xạ thủ / Hậu cần"
```

---

## 🔍 Troubleshooting

### Bot không phản hồi commands?

1. Kiểm tra bot đã vào server chưa
2. Kiểm tra bot có quyền "Use Slash Commands"
3. Đợi vài phút để commands được đăng ký (Discord cần thời gian sync)

### Bot không khởi động?

1. Kiểm tra `DISCORD_BOT_TOKEN` trong `backend/.env`
2. Kiểm tra token có hợp lệ không
3. Xem logs trong console để biết lỗi cụ thể

### OAuth2 không hoạt động?

1. Kiểm tra `DISCORD_CLIENT_SECRET` đã được cấu hình chưa
2. Kiểm tra `DISCORD_REDIRECT_URI` khớp với Discord OAuth2 settings
3. Đảm bảo redirect URI đã được thêm vào Discord OAuth2 → Redirects

---

## 📚 Tài liệu tham khảo

- [DISCORD_SETUP.md](./DISCORD_SETUP.md) - Hướng dẫn chi tiết
- [DISCORD_INTEGRATION_SUMMARY.md](./DISCORD_INTEGRATION_SUMMARY.md) - Tóm tắt tích hợp
- [Discord Developer Portal](https://discord.com/developers/applications)

---

**🎉 Bot đã sẵn sàng! Chỉ cần khởi động server và mời bot vào Discord server của bạn!**

