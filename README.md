# The Besties Gang Wiki

Website chính thức của The Besties Gang trên FiveM.

## 📱 Tính năng
- 🎨 Giao diện hiện đại, responsive
- 👥 Thông tin Leader & thành viên
- 🖼️ Gallery ảnh highlight
- 🔒 Bảo mật cơ bản (CSP)
- 💬 Kết nối Discord

## 📂 Cấu trúc
```
/
├── index.html           # Trang chính
├── members.html         # Trang danh sách thành viên
├── style.css            # CSS styling
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

1. **Tạo GitHub Account** (nếu chưa có)
   - Truy cập https://github.com/signup

2. **Tạo repo mới**
   - Tên: `thebesties`
   - Public
   - **Không** tạo README/gitignore (vì đã có)

3. **Push code lên (chạy trong PowerShell)**
```powershell
cd 'c:\Users\ADMID\Desktop\Website The Besties'
git init
git config user.name "Tên của bạn"
git config user.email "email@example.com"
git add .
git commit -m "Initial commit - The Besties Website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thebesties.git
git push -u origin main
```

4. **Enable GitHub Pages**
   - Vào GitHub → Your repo → Settings → Pages
   - Source: Branch `main` / folder `/ (root)`
   - Lưu

5. **Truy cập website**
   - URL: `https://YOUR_USERNAME.github.io/thebesties`

## 📝 Cập nhật nội dung

Mỗi khi chỉnh sửa file:
```powershell
cd 'c:\Users\ADMID\Desktop\Website The Besties'
git add .
git commit -m "Cập nhật nội dung"
git push
```

Website sẽ tự động cập nhật trong vài giây.

## 🔒 Bảo mật
- CSP meta tag bảo vệ trang
- External links có `noopener noreferrer`
- Thực hiện kiểm tra định kỳ cho link an toàn

## 📧 Liên hệ
- Discord: [Link chính thức]
- Email: [Địa chỉ liên hệ]

---
*Trang web được tạo & bảo trì bởi The Besties Gang*
