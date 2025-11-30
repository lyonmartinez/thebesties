# 🔑 Test Account Credentials

## Tài khoản test

| Username | Password | Role |
|----------|----------|------|
| leader | 123456 | 👑 Leader |
| member1 | 123456 | 👥 Member |
| member2 | 123456 | 👥 Member |
| member3 | 123456 | 👥 Member |
| member4 | 123456 | 👥 Member |

**Password hash (bcryptjs):** `$2a$10$N9qo8uLOickgx2ZMRZoMye0G5gIa1sUwjRvBjklKFfHEI1LG1B.kS`

## Đổi mật khẩu

1. Cài đặt Node.js nếu chưa có
2. Chạy script:
```bash
cd backend
node
```

3. Trong Node shell:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('your_new_password', 10).then(hash => console.log(hash));
```

4. Copy hash vào `backend/data/users.json`

---

**The Besties Gang**
