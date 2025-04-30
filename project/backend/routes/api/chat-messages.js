// backend/routes/api/chat-messages.js

// GET /api/messages/:userId
// Get chat history between current user and user2

// PUT /api/messages/:messageId
// Edit a message (only by sender)

// POST /api/messages
// Send a message between two users

// DELETE /api/messages/:messageId
// Only the sender can delete their own message permanently

const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { ChatMessage, User } = require('../../db/models');
const { check } = require('express-validator');
const { Op } = require('sequelize');

// const { validateResource } = require('../../utils/post-validators');

const router = express.Router();

// GET /api/messages/:userId — Get chat history between current user and another user
// router.get('/:user1Id/:use2Id', async (req, res) => {
router.get('/messages/:userId2', requireAuth, async (req, res) => {
  const userId1 = req.user.id;
  const userId2 = parseInt(req.params.userId2);

  try {
    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      order: [['createdAt', 'ASC']],
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'receiver', attributes: ['id', 'username'] },
      ],
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch chat history' });
  }
});

// PUT /api/messages/:messageId
// Edit a message (only by sender)
router.put('/messages/:messageId', requireAuth, async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const message = await ChatMessage.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this message' });
    }

    message.content = content;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while editing the message' });
  }
});

// POST /api/messages
// Send a message between two users
router.post('/messages', requireAuth, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ error: 'Receiver and content are required' });
  }

  try {
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found.' });
    }

    const newMessage = await ChatMessage.create({
      senderId,
      receiverId,
      content
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// DELETE /api/messages/:messageId
// Only the sender can delete their own message permanently
router.delete('/messages/:messageId', requireAuth, async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await ChatMessage.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({ error: 'Only the sender can delete this message' });
    }

    await message.destroy();
    return res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete the message' });
  }
});

module.exports = router;