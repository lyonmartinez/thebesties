const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = '123456';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash for password "123456":');
  console.log(hash);
  console.log('\nUse this hash in users.json for all test accounts');
}

hashPassword().catch(console.error);
