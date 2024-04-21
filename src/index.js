// src/index.js
const app = require('./app');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



// const cors = require('cors');
// const express = require('express');
// const app = express();
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');

// require('dotenv').config();
// const JWT_SECRET = process.env.JWT_SECRET;

// const prisma = new PrismaClient();

// app.use(cors({
//   origin: 'http://localhost:3000', // Adjust this to match your client URL
//   credentials: true
// }));
// app.use(express.json());

// const swaggerOptions = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Memo API',
//             version: '1.0.0',
//             description: 'API for managing user memos',
//         },
//         servers: [
//             { url: 'http://localhost:3001' },
//         ],
//     },
//     apis: ['./index.js'], // path to the API docs
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// // Environment variables should ideally be used for secrets.
// /**
//  * @openapi
//  * /signup:
//  *   post:
//  *     summary: Register a new user
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  *       400:
//  *         description: User already exists
//  */
// app.post('/signup', async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   try {
//     const user = await prisma.user.create({
//       data: { username, password: hashedPassword }
//     });
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: "User already exists" });
//   }
// });

// /**
//  * @openapi
//  * /login:
//  *   post:
//  *     summary: Logs in a user
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Successfully logged in
//  *       401:
//  *         description: Invalid credentials
//  */
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await prisma.user.findUnique({
//     where: { username }
//   });
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }
//   const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '180s' }); // Expires in 3 minutes
//   res.cookie('token', token, { httpOnly: true, sameSite: 'strict' }); // Secure: true in production
//   res.json({ message: 'Logged in successfully' });
// });

// /**
//  * @openapi
//  * /memos/{username}:
//  *   get:
//  *     summary: Retrieve all memos for a specific user
//  *     tags: [Memos]
//  *     parameters:
//  *       - in: path
//  *         name: username
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The username to retrieve memos for
//  *     responses:
//  *       200:
//  *         description: A list of memos
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                   content:
//  *                     type: string
//  *                   userId:
//  *                     type: integer
//  *                   createdAt:
//  *                     type: string
//  *                     format: date-time
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Internal server error
//  */
// app.get('/memos/:username', async (req, res) => {
//   const { username } = req.params;
//   try {
//     const user = await prisma.user.findUnique({
//       where: { username },
//       include: { memos: true }
//     });
//     if (user) {
//       res.json(user.memos);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// /**
//  * @openapi
//  * /memos/{username}:
//  *   post:
//  *     summary: Create a new memo for a specific user
//  *     tags: [Memos]
//  *     parameters:
//  *       - in: path
//  *         name: username
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The username to create a memo for
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               content:
//  *                 type: string
//  *                 description: Content of the memo
//  *     responses:
//  *       201:
//  *         description: Memo created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                     type: integer
//  *                 content:
//  *                     type: string
//  *                 userId:
//  *                     type: integer
//  *                 createdAt:
//  *                     type: string
//  *                     format: date-time
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Internal server error
//  */
// app.post('/memos/:username', async (req, res) => {
//   const { username } = req.params;
//   const { content } = req.body;
//   try {
//     const user = await prisma.user.findUnique({
//       where: { username }
//     });
//     if (user) {
//       const memo = await prisma.memo.create({
//         data: {
//           content,
//           userId: user.id
//         }
//       });
//       res.status(201).json(memo);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(3001, () => {
//   console.log('Server is running on http://localhost:3001');
// });
