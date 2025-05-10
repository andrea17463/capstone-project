// backend/routes/api/user-connections.js
const express = require('express');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { UserConnection } = require('../../db/models');
// const { User } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();
router.use(restoreUser);

// GET /api/connections
// Get all connections for the current user

// GET /api/connections/:userId
// Get specific connection between current user and another user

// POST /api/connections
// Create a new connection (e.g., a match or meeting request)

// PUT /api/connections/:connectionId/status
// Update connection status (e.g., "pending" → "accepted")

// PUT /api/connections/:connectionId/meeting
// Update meeting status (e.g., "pending" → "confirmed")

// PUT /api/connections/:connectionId/feedback
// Indicate whether the user wants to meet again

// DELETE /api/connections/:connectionId
// Remove/cancel a connection

// GET /api/connections
// Get all connections for the current user
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const connections = await UserConnection.findAll({
      where: {
        [Op.or]: [
          { user_1_id: userId },
          { user_2_id: userId }
        ]
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username', 'interests'] },
        { model: User, as: 'user2', attributes: ['id', 'username', 'interests'] },
      ],
      order: [['updated_at', 'DESC']],
    });

    res.json(connections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch connections' });
  }
});

// GET /api/connections/:userId
// Get specific connection between current user and another user
router.get('/:userId', requireAuth, async (req, res) => {
  const userId1 = req.user.id;
  console.log("Received userId1:", req.user.id);
  const userId2 = req.params.userId;
  console.log("Request received for connection ID:", req.params.userId);

  try {
    const connection = await UserConnection.findOne({
      where: {
        [Op.or]: [
          { user_1_id: userId1, user_2_id: userId2 },
          { user_1_id: userId2, user_2_id: userId1 }
        ]
      }
    });

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to retrieve connection' });
  }
});

// POST /api/connections
// Create a new connection (e.g., a match or meeting request)
router.post('/', requireAuth, async (req, res) => {
  const user1Id = req.user.id;
  const { user_2_id, suggestedActivity, meetingTime } = req.body;
  console.log('Incoming POST to /api/connections with body:', req.body);
  console.log("User ID 1:", user1Id);
  console.log("User ID 2:", user_2_id);

  const parsedMeetingTime = new Date(meetingTime);

  if (!user_2_id || !suggestedActivity || isNaN(parsedMeetingTime.getTime())) {
    console.log('Validation failed: Missing or invalid required fields');
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const existingConnection = await UserConnection.findOne({
      where: {
        [Op.or]: [
          { user_1_id: user1Id, user_2_id: user_2_id },
          { user_1_id: user_2_id, user_2_id: user1Id }
        ],
        connectionStatus: { [Op.ne]: 'declined' },
      }
    });

    if (existingConnection) {
      console.log('Connection already exists between these users');
      return res.status(409).json({ message: "Connection already exists" });
    }

    const newConnection = await UserConnection.create({
      user_1_id: user1Id,
      user_2_id,
      connectionStatus: 'pending',
      chatEnabled: false,
      meetingStatus: 'pending',
      suggestedActivity,
      meetingTime: parsedMeetingTime
    });

    console.log('Successfully created new connection:', newConnection);
    res.status(201).json(newConnection);
  } catch (err) {
    console.error('Error creating connection:', err);
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

// PUT /api/connections/:connectionId/status
// Update connection status (e.g., "pending" → "accepted")
router.put('/:connectionId/status', requireAuth, async (req, res) => {
  const { connectionId } = req.params;
  const { connectionStatus } = req.body;
  console.log('connection status req.body', req.body);

  try {
    const connection = await UserConnection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ error: 'Connection not found' });

    connection.connectionStatus = connectionStatus;
    await connection.save();

    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update connection status' });
  }
});

// PUT /api/connections/:connectionId/meeting
// Update meeting status (e.g., "pending" → "confirmed")
router.put('/:connectionId/meeting', requireAuth, async (req, res) => {
  const { connectionId } = req.params;
  const { meetingStatus } = req.body;

  try {
    const connection = await UserConnection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ error: 'Connection not found' });

    connection.meetingStatus = meetingStatus;
    await connection.save();

    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update meeting status' });
  }
});

// PUT /api/connections/:connectionId/feedback
// Indicate whether the user wants to meet again
router.put('/:connectionId/feedback', requireAuth, async (req, res) => {
  const { connectionId } = req.params;
  const userId = req.user.id;
  const { meetAgain } = req.body;

  try {

    const connection = await UserConnection.findByPk(connectionId);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    if (userId === connection.user_1_id) {
      connection.meetAgainChoiceUser1 = meetAgain;
    } else if (userId === connection.user_2_id) {
      connection.meetAgainChoiceUser2 = meetAgain;
    } else {
      return res.status(403).json({ error: 'Not authorized to give feedback on this connection' });
    }

    await connection.save();

    return res.status(200).json({ message: 'Feedback recorded successfully' });

  } catch (error) {

    console.error('Error updating feedback:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/connections/:connectionId
// Remove/cancel a connection
router.delete('/:connectionId', requireAuth, async (req, res) => {
  const { connectionId } = req.params;

  try {
    const connection = await UserConnection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ error: 'Connection not found' });

    await connection.destroy();
    res.json({ message: 'Connection removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove connection' });
  }
});

module.exports = router;