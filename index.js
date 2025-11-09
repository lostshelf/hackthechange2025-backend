require('dotenv').config();

const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const auth = require('./auth')

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '2h';
const PORT = process.env.PORT;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required."});
  }

  try {
    const result = await pool.query('SELECT user_id, username, password_hash FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); 
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({
      userId: user.user_id,
      username: user.username
    }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return res.json({ token, userId: user.user_id, username: user.username});
  } catch (error) { 
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
});

app.post('/api/auth/create_account', async (req, res) => {

});

app.post('/api/issue/post', auth.authenticate, () => {

});

app.post('/api/issue/delete', auth.authenticate, () => {

});

app.post('/api/message/post', auth.authenticate, () => {

});

app.post('/api/message/delete', auth.authenticate, () => {
  
});

app.listen(PORT, () => {
  console.log(`Listening on port ${port}.`);
});
