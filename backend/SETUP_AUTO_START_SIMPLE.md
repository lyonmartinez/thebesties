# 🚀 Setup Auto-Start Bot - Hướng dẫn đơn giản

## ⚠️ QUAN TRỌNG: Bot KHÔNG thể chạy khi máy tính TẮT

Bot chỉ có thể:
- ✅ Tự động khởi động khi Windows khởi động (máy tính bật)
- ✅ Tự động restart nếu bị crash
- ❌ **KHÔNG thể chạy khi máy tính đã tắt hoàn toàn**

**Để bot chạy 24/7 mà không cần máy tính bật → Deploy lên cloud (Railway, Heroku, VPS)**

---

## 🎯 Cách 1: Windows Startup Folder (Đơn giản nhất - KHÔNG CẦN ADMIN)

### Bước 1: Mở thư mục Startup

1. Nhấn `Win + R`
2. Gõ: `shell:startup`
3. Nhấn Enter

### Bước 2: Copy file vào Startup

**Cách A: Copy trực tiếp**
- Copy file `start-bot-silent.bat` vào thư mục Startup vừa mở

**Cách B: Tạo shortcut (Khuyên dùng)**
1. Chuột phải vào `start-bot-silent.bat` trong thư mục `backend`
2. Chọn "Create shortcut"
3. Copy shortcut vào thư mục Startup

### ✅ Xong!

Bot sẽ tự động chạy khi bạn đăng nhập vào Windows (không hiển thị cửa sổ).

---

## 🎯 Cách 2: Task Scheduler (Tốt hơn - CẦN ADMIN)

### Bước 1: Mở PowerShell với quyền Admin

1. Nhấn `Win + X`
2. Chọn "Windows PowerShell (Admin)" hoặc "Terminal (Admin)"

### Bước 2: Chạy script setup

```powershell
cd "C:\Users\ADMID\Desktop\Website The Besties\backend"
.\setup-auto-start.ps1
```

Làm theo hướng dẫn trên màn hình.

### ✅ Xong!

---

## 🧪 Kiểm tra

Sau khi setup, khởi động lại máy tính và kiểm tra:

```bash
pm2 status
```

Nếu thấy bot đang chạy → Thành công! ✅

---

## 📝 Các lệnh hữu ích

```bash
# Xem trạng thái
pm2 status

# Xem logs
pm2 logs thebesties-bot

# Restart bot
pm2 restart thebesties-bot

# Stop bot
pm2 stop thebesties-bot
```

---

## 🔧 Xóa Auto-Start

### Nếu dùng Startup Folder:
- Xóa file/shortcut trong thư mục Startup

### Nếu dùng Task Scheduler:
```powershell
cd "C:\Users\ADMID\Desktop\Website The Besties\backend"
.\remove-auto-start.ps1
```

---

## 🌐 Muốn bot chạy 24/7 mà không cần máy tính bật?

Deploy lên cloud:
- **Railway** (Dễ nhất): https://railway.app
- **Heroku**: https://heroku.com
- **Replit**: https://replit.com
- **VPS**: DigitalOcean, AWS, etc.

