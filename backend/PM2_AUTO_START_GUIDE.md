# 🚀 Hướng dẫn Auto-Start Bot với PM2 trên Windows

## 📋 Tổng quan

Bot sẽ **tự động khởi động** khi bạn đăng nhập vào Windows, không cần phải chạy thủ công mỗi lần.

## ⚠️ Lưu ý quan trọng

**Bot KHÔNG THỂ chạy khi máy tính đã TẮT HOÀN TOÀN.**

Bot chỉ có thể:
- ✅ Tự động khởi động khi Windows khởi động (máy tính bật)
- ✅ Tự động khởi động khi bạn đăng nhập
- ✅ Tự động restart nếu bot bị crash

Nếu bạn muốn bot chạy 24/7 mà không cần máy tính bật, bạn cần:
- 🌐 Deploy bot lên cloud server (VPS, AWS, Heroku, Railway, etc.)

---

## 🛠️ Cài đặt Auto-Start

### Bước 1: Chạy script setup

1. Mở **PowerShell với quyền Administrator**:
   - Nhấn `Win + X`
   - Chọn "Windows PowerShell (Admin)" hoặc "Terminal (Admin)"

2. Chạy script setup:
   ```powershell
   cd "C:\Users\ADMID\Desktop\Website The Besties\backend"
   .\setup-auto-start.ps1
   ```

3. Script sẽ:
   - Tạo Windows Task Scheduler task
   - Bot sẽ tự động khởi động khi bạn đăng nhập vào Windows

### Bước 2: Kiểm tra

Sau khi setup xong, bạn có thể:
- Khởi động lại máy tính để test
- Hoặc chạy thủ công: `pm2 status` để xem bot có chạy không

---

## 📝 Các lệnh PM2 hữu ích

```bash
# Xem trạng thái bot
pm2 status

# Xem logs
pm2 logs thebesties-bot

# Restart bot
pm2 restart thebesties-bot

# Stop bot
pm2 stop thebesties-bot

# Start bot (nếu đã stop)
pm2 start ecosystem.config.js

# Xem monitor
pm2 monit
```

Hoặc dùng npm scripts:
```bash
npm run pm2:status
npm run pm2:logs
npm run pm2:restart
npm run pm2:stop
```

---

## 🔧 Xóa Auto-Start

Nếu bạn muốn xóa auto-start:

```powershell
cd "C:\Users\ADMID\Desktop\Website The Besties\backend"
.\remove-auto-start.ps1
```

Hoặc thủ công:
```powershell
Unregister-ScheduledTask -TaskName "TheBestiesBotAutoStart"
```

---

## 🎯 Cách hoạt động

1. **PM2 Save**: Lưu danh sách process hiện tại
   ```bash
   pm2 save
   ```

2. **Windows Task Scheduler**: Tự động chạy `start-bot.bat` khi đăng nhập

3. **start-bot.bat**: Chạy `pm2 resurrect` để khôi phục các process đã lưu

---

## 🐛 Troubleshooting

### Bot không tự động khởi động?

1. Kiểm tra Task Scheduler:
   - Mở Task Scheduler (`Win + R` → `taskschd.msc`)
   - Tìm task "TheBestiesBotAutoStart"
   - Kiểm tra xem có bị disable không

2. Kiểm tra PM2:
   ```bash
   pm2 status
   pm2 save  # Lưu lại danh sách
   ```

3. Chạy thủ công để test:
   ```bash
   .\start-bot.bat
   ```

### Bot bị crash?

PM2 sẽ tự động restart bot (theo config trong `ecosystem.config.js`):
- `autorestart: true` - Tự động restart
- `max_restarts: 10` - Tối đa 10 lần restart
- `restart_delay: 4000` - Delay 4 giây trước khi restart

---

## 🌐 Deploy lên Cloud (Chạy 24/7)

Nếu bạn muốn bot chạy 24/7 mà không cần máy tính bật:

### Các lựa chọn:

1. **Railway** (Dễ nhất, miễn phí)
   - https://railway.app
   - Connect GitHub repo
   - Auto-deploy

2. **Heroku** (Có free tier)
   - https://heroku.com
   - Cần thêm Procfile

3. **VPS** (DigitalOcean, AWS, etc.)
   - Full control
   - Cần setup server

4. **Replit** (Miễn phí, dễ dùng)
   - https://replit.com
   - Chạy trực tiếp trên browser

---

## ✅ Checklist

- [x] PM2 đã được cài đặt
- [x] Bot đã chạy với PM2
- [x] `pm2 save` đã được chạy
- [x] Auto-start script đã được setup
- [ ] Test: Khởi động lại máy và kiểm tra bot có tự động chạy không

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. PM2 logs: `pm2 logs thebesties-bot`
2. Windows Event Viewer: Xem logs của Task Scheduler
3. Kiểm tra `.env` file có đầy đủ config không

