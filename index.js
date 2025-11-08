const jwt = require('jsonwebtoken');
const express = require('express');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '2h';

const port = 3000;

const app = express();

app.post('/api/auth/login', (req, res) => {

});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

