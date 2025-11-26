# The Besties Gang Wiki

Website chính thức của The Besties Gang trên FiveM.

## ⚠️ Copyright & Bảo vệ

**Bản quyền © 2025 The Besties Gang. All Rights Reserved.**

Trang web này được bảo vệ bằng mật khẩu. Chỉ có những người được phép mới có thể truy cập.

- ❌ **Không được** sao chép, phân phối hoặc sử dụng nội dung mà không có sự cho phép
- ❌ **Không được** clone repo để sử dụng vào mục đích khác
- ✅ **Chỉ được** sử dụng theo quyền cho phép của Gang

## 🔒 Password Protection

Website được bảo vệ bằng mật khẩu. Mật khẩu: **thebesties2025** (thay đổi trong `login.html`)

## 📱 Tính năng
- 🎨 Giao diện hiện đại, responsive
- 👥 Thông tin Leader & thành viên
- 🖼️ Gallery ảnh highlight
- 🔒 Bảo vệ mật khẩu
- 💬 Kết nối Discord

## 📂 Cấu trúc
```
/
├── login.html           # Trang đăng nhập (password protection)
├── index.html           # Trang chính
├── members.html         # Trang danh sách thành viên
├── style.css            # CSS styling
├── images/              # Ảnh Gang
├── members/
│   ├── member1/index.html
│   ├── member2/index.html
│   ├── member3/index.html
│   ├── member4/index.html
│   └── leader/
│       ├── index.html   # Trang chi tiết Leader
│       └── images/      # Ảnh Leader & highlight
```

## 🚀 Triển khai trên GitHub Pages

Website được host miễn phí trên GitHub Pages.

URL: `https://lyonmartinez.github.io/thebesties`

## 📝 Cập nhật nội dung

Mỗi khi chỉnh sửa file:
```powershell
cd 'c:\Users\ADMID\Desktop\Website The Besties'
git add .
git commit -m "Cập nhật nội dung"
git push
```

Website sẽ tự động cập nhật trong vài giây.

## 🔐 Thay đổi mật khẩu

Mở file `login.html` và thay đổi dòng:
```javascript
const PASSWORD = "thebesties2025";
```

## 🔒 Bảo mật
- CSP meta tag bảo vệ trang
- Password protection để chỉ người được phép xem
- External links có `noopener noreferrer`
- Thực hiện kiểm tra định kỳ cho link an toàn

---
*Trang web được tạo & bảo trì bởi The Besties Gang*

**⚠️ Mọi vi phạm bản quyền sẽ bị xử lý theo quy định.**
