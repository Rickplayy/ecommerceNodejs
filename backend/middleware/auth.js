
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Auth middleware hit!');
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('Token:', token);
    const decodedToken = jwt.verify(token, 'your_jwt_secret');
    console.log('Decoded Token:', decodedToken);
    req.userData = { userId: decodedToken.userId };
    console.log('Auth successful for userId:', req.userData.userId);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Auth failed!' });
  }
};
