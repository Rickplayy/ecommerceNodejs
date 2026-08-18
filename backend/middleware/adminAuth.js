
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {

    const user = await User.findByPk(req.userData.userId);

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = adminAuth;
