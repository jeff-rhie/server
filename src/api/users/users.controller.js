// src/api/users/users.controller.js
const { prisma } = require('../../services/prisma.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = async (password) => bcrypt.hash(password, 10);

/**
 * @openapi
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
const signup = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    const user = await prisma.user.create({
      data: { username, password: hashedPassword }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
};

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Logs in a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: HttpOnly cookie with token
 *       401:
 *         description: Invalid credentials
 */
const login = async (req, res) => {
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
};

module.exports = {
  signup,
  login
};
