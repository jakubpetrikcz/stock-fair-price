const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig.js');
const protect = require('../middleware/auth.js');

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    if (userExists.rows.length > 0) {
      return res.status(500).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword],
    );

    const token = generateToken(newUser.rows[0].id);

    res.cookie('token', token, cookieOptions);

    return res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(503).json({ error: 'Cant get users' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  const user = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  console.log('user', user);

  if (user.rows.length === 0) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const userData = user.rows[0];

  const isMatch = await bcrypt.compare(password, userData.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(userData.id);

  res.cookie('token', token, cookieOptions);

  res.json({
    user: { id: userData.id, name: userData.name, email: userData.email },
  });
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 1 });
  res.json({ message: 'logged out successfully' });
});

module.exports = router;
