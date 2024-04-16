const cors = require('cors');
const express = require('express');
const app = express();

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to match your client URL
  credentials: true
}));
app.use(express.json());

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Environment variables should ideally be used for secrets.

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { username, password: hashedPassword }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username }
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '180s' }); // Expires in 3 minutes
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict' }); // Secure: true in production
  res.json({ message: 'Logged in successfully' });
});

app.get('/memos/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { memos: true }
    });
    if (user) {
      res.json(user.memos);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/memos/:username', async (req, res) => {
  const { username } = req.params;
  const { content } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (user) {
      const memo = await prisma.memo.create({
        data: {
          content,
          userId: user.id
        }
      });
      res.status(201).json(memo);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
