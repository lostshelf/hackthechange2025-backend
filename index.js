require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('*** FATAL UNCAUGHT EXCEPTION ***');
  console.error(err.stack || err);
  process.exit(1); 
});

// Catches promise rejections that weren't caught by .catch()
process.on('unhandledRejection', (reason, promise) => {
  console.error('*** FATAL UNHANDLED REJECTION ***');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

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

    const isMatch = await bcrypt.compare(password, user.password);

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
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(401).json({ message: 'Invalid user information.'});
  }

  try {
    const result = await pool.query("SELECT email FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      return res.status(401).json({ message: 'User already exists'});
    }

    const id = crypto.randomUUID();
    const password_hash = bcrypt.hash(password);

    const res = await pool.query(
      `
      INSERT INTO users (id, username, email, password)
      VALUES ($1, $2, $3, $4);
      `,
      [id, username, email, password_hash]
    );
  } catch(err) {
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
});

app.post('/api/issue/post', auth.authenticate, async () => {
  const { ticketId, state, title, description, latitude, longitude, user_post } = req.body;
});

app.post('/api/issue/delete', auth.authenticate, async () => {
  
});

app.post('/api/message/post', auth.authenticate, async () => {
  
});

app.post('/api/message/delete', auth.authenticate, async () => {
  
});

app.get('/api/issue/get', (req, res) => {
  const { issueId } = req.body

  if (!issueId) {
    return res.status(401).json({message: 'Invalid issue id'});
  }


});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
