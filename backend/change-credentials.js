#!/usr/bin/env node

/**
 * The Besties - Change User Credentials
 * Cách dùng: node change-credentials.js <username> <new_password>
 * 
 * Ví dụ: node change-credentials.js member1 NewPassword@123
 */

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const username = process.argv[2];
const newPassword = process.argv[3];
const newUsername = process.argv[4];

if (!username || !newPassword) {
  console.log('\n🔐 The Besties - Change User Credentials\n');
  console.log('Cách dùng:');
  console.log('  node change-credentials.js <current_username> <new_password> [new_username]\n');
  console.log('Ví dụ:');
  console.log('  Thay đổi password:');
  console.log('    node change-credentials.js member1 NewPassword@123\n');
  console.log('  Thay đổi cả username và password:');
  console.log('    node change-credentials.js member1 NewPassword@123 new_username\n');
  process.exit(1);
}

const usersPath = path.join(__dirname, 'data/users.json');

try {
  const data = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const userIndex = data.users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    console.error(`❌ User '${username}' không tìm thấy\n`);
    console.log('Danh sách user hiện có:');
    data.users.forEach(u => console.log(`  - ${u.username} (${u.role})`));
    process.exit(1);
  }

  bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
      console.error('❌ Lỗi:', err);
      process.exit(1);
    }

    data.users[userIndex].password = hash;
    
    if (newUsername) {
      data.users[userIndex].username = newUsername;
    }

    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));

    console.log('\n✅ Cập nhật thông tin đăng nhập thành công!\n');
    console.log('📋 Chi tiết:');
    console.log(`   Username: ${newUsername || username}`);
    console.log(`   Password: ${newPassword}`);
    console.log(`   Role: ${data.users[userIndex].role}\n`);
    console.log('⚠️  Vui lòng khởi động lại backend để áp dụng thay đổi\n');
  });
} catch (error) {
  console.error('❌ Lỗi:', error.message);
  process.exit(1);
}
