const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig.js');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log('token', token);

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [decoded.id],
    );

    console.log('user', user);

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'Not authorized, user not found' });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protect;
