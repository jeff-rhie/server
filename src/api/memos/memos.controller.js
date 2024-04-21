// src/api/memos/memos.controller.js
const { prisma } = require('../../services/prisma.service');

/**
 * @openapi
 * /memos/{username}:
 *   get:
 *     summary: Retrieve all memos for a specific user
 *     tags:
 *       - Memos
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username to fetch memos for
 *     responses:
 *       200:
 *         description: An array of memos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Memo'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const getMemos = async (req, res) => {
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
};

/**
 * @openapi
 * /memos/{username}:
 *   post:
 *     summary: Create a new memo for a specific user
 *     tags:
 *       - Memos
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username to create a memo for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemoInput'
 *     responses:
 *       201:
 *         description: Memo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Memo'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
const addMemo = async (req, res) => {
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
};

module.exports = {
  getMemos,
  addMemo
};
