const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorizeLeader = (req, res, next) => {
  if (req.user.role !== 'leader') {
    return res.status(403).json({ error: 'Only leader can access this' });
  }
  next();
};

module.exports = { authenticate, authorizeLeader };
