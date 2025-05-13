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
// const { handleValidationErrors } = require('../../utils/validation');
const { ChatMessage, User } = require('../../db/models');
// const { check } = require('express-validator');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/messages/:userId
// Get chat history between current user and another user
router.get('/:userId2', requireAuth, async (req, res) => {
  const userId1 = req.user.id;
  const userId2 = parseInt(req.params.userId2);

  console.log(`[GET] Request to fetch chat history between user ${userId1} and user ${userId2}`);

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

    console.log(`[GET] Retrieved ${messages.length} messages`);
    res.json(messages);
  } catch (err) {
    console.error(`[GET] Error fetching messages between users ${userId1} and ${userId2}:`, err);
    res.status(500).json({ error: 'Unable to fetch chat history' });
  }
});

// PUT /api/messages/:messageId
// Edit a message (only by sender)
router.put('/:messageId', requireAuth, async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  console.log(`[PUT] User ${req.user.id} attempting to edit message ${messageId}`);

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

    console.log(`[PUT] Message ${messageId} successfully edited`);
    res.json(message);
  } catch (err) {
    console.error(`[PUT] Error editing message ${messageId}:`, err);
    res.status(500).json({ error: 'Something went wrong while editing the message' });
  }
});

// POST /api/messages
// Send a message between two users
router.post('/', requireAuth, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  console.log(`[POST] User ${senderId} sending message to ${receiverId}: "${content}"`);

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

    console.log(`[POST] Message from user ${senderId} to ${receiverId} created with ID ${newMessage.id}`);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(`[POST] Error sending message from user ${senderId} to ${receiverId}:`, err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// DELETE /api/messages/:messageId
// Only the sender can delete their own message permanently
router.delete('/:messageId', requireAuth, async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  console.log(`[DELETE] User ${userId} attempting to delete message ${messageId}`);

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
    console.log(`[DELETE] Message ${messageId} successfully deleted by user ${userId}`);
    return res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(`[DELETE] Error deleting message ${messageId} by user ${userId}:`, err);
    return res.status(500).json({ error: 'Failed to delete the message' });
  }
});

module.exports = router;