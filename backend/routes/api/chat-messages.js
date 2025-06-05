// backend/routes/api/chat-messages.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
// const { handleValidationErrors } = require('../../utils/validation');
const { ChatMessage, User } = require('../../db/models');
// const { check } = require('express-validator');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/chat-messages/conversations
// Get chat history between current user and all other users

// GET /api/messages/:userId
// Get chat history between current user and user2

// PUT /api/messages/:messageId
// Edit a message (only by sender)

// POST /api/messages
// Send a message between two users

// DELETE /api/messages/:messageId
// Only the sender can delete their own message permanently

// GET /api/chat-messages/conversations
// Get chat history between current user and all other users
router.get('/conversations', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const messages = await ChatMessage.findAll({
    where: {
      [Op.or]: [
        { senderId: userId },
        { receiverId: userId },
      ]
    },
    include: [
      { model: User, as: 'sender', attributes: ['id', 'username'] },
      { model: User, as: 'receiver', attributes: ['id', 'username'] },
    ],
    order: [['createdAt', 'DESC']]
  });

  const conversationsMap = new Map();
  for (const msg of messages) {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    if (!conversationsMap.has(otherUser.id)) {
      conversationsMap.set(otherUser.id, {
        user: otherUser,
        lastMessage: msg,
      });
    }
  }

  return res.json(Array.from(conversationsMap.values()));
});

// GET /api/chat-messages/:userId
// Get chat history between current user and another user
router.get('/:userId2', requireAuth, async (req, res) => {
  const userId1 = req.user.id;
  const userId2 = parseInt(req.params.userId2);

  if (isNaN(userId2)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

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
    console.error(`[GET] Error fetching messages between users ${userId1} and ${userId2}:`, err);
    res.status(500).json({ error: 'Unable to fetch chat history' });
  }
});

// PUT /api/chat-messages/:messageId
// Edit a message (only by sender)
router.put('/:messageId', requireAuth, async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const message = await ChatMessage.findByPk(messageId);

    if (!message) {
      console.warn(`[PUT] Message ${messageId} not found`);
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== req.user.id) {
      console.warn(`[PUT] User ${req.user.id} is not the sender of message ${messageId}`);
      return res.status(403).json({ error: 'Unauthorized to edit this message' });
    }

    message.content = content;
    message.editedAt = new Date();
    await message.save();

    const messageWithUsers = await ChatMessage.findByPk(messageId, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'receiver', attributes: ['id', 'username'] }
      ]
    });

    res.json(messageWithUsers);
  } catch (err) {
    console.error(`[PUT] Error editing message ${messageId}:`, err);
    res.status(500).json({ error: 'Something went wrong while editing the message' });
  }
});

// POST /api/chat-messages
// Send a message between two users
router.post('/', requireAuth, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    console.warn(`[POST] Missing receiver or content in message from user ${senderId}`);
    return res.status(400).json({ error: 'Receiver and content are required' });
  }

  if (senderId === receiverId) {
    console.warn(`[POST] User ${senderId} attempted to message themselves`);
    return res.status(400).json({ error: "Sender and receiver cannot be the same" });
  }

  try {
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      console.warn(`[POST] Receiver with ID ${receiverId} not found`);
      return res.status(404).json({ error: 'Receiver not found.' });
    }

    const newMessage = await ChatMessage.create({
      senderId,
      receiverId,
      content
    });

    const messageWithUsers = await ChatMessage.findByPk(newMessage.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username'] },
        { model: User, as: 'receiver', attributes: ['id', 'username'] }
      ]
    });

    res.status(201).json(messageWithUsers);
  } catch (err) {
    console.error(`[POST] Error sending message from user ${senderId} to ${receiverId}:`, err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// DELETE /api/chat-messages/:messageId
// Only the sender can delete their own message permanently
router.delete('/:messageId', requireAuth, async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await ChatMessage.findByPk(messageId);

    if (!message) {
      console.warn(`[DELETE] Message ${messageId} not found`);
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId !== userId) {
      console.warn(`[DELETE] Unauthorized delete attempt: User ${userId} is not sender of message ${messageId}`);
      return res.status(403).json({ error: 'Only the sender can delete this message' });
    }

    await message.destroy();
    return res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(`[DELETE] Error deleting message ${messageId} by user ${userId}:`, err);
    return res.status(500).json({ error: 'Failed to delete the message' });
  }
});

module.exports = router;