const bcrypt = require('bcryptjs');

const password = '123456';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('New hash for password "123456":');
    console.log(hash);
    
    // Test if it matches
    bcrypt.compare(password, hash, (err, isMatch) => {
      console.log('Test compare result:', isMatch);
      process.exit(0);
    });
  }
});
