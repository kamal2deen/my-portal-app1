// routes/auth.js
const express = require('express');
const path = require('path');
const router = express.Router();

const users = [];

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/portal.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.send('User already exists. <a href="/signup">Try again</a>');
  }
  users.push({ username, password });
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send('Invalid credentials. <a href="/login">Try again</a>');
  req.session.user = user;
  res.redirect('/welcome');
});

router.get('/welcome', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.send(`
    <h1>Welcome, ${req.session.user.username}!</h1>
    <form method="POST" action="/logout"><button>Logout</button></form>
    <style>
      body { font-family: Arial; background: #d1ffd6; text-align: center; padding-top: 50px; }
      button { padding: 10px 20px; background: red; color: white; border: none; border-radius: 5px; }
    </style>
  `);
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
