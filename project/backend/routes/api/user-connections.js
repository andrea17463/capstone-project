// backend/routes/api/user-connections.js
const express = require('express');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');
// const { UserConnection, User } = require('../../db/models');
const { UserConnection } = require('../../db/models');
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
router.get('/connections', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const connections = await UserConnection.findAll({
      where: {
        [Op.or]: [
          { user_1_id: userId },
          { user_2_id: userId }
        ]
      },
      order: [['updated_at', 'DESC']]
    });

    res.json(connections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch connections' });
  }
});

// GET /api/connections/:userId
// Get specific connection between current user and another user
router.get('/connections/:userId', requireAuth, async (req, res) => {
  const userId1 = req.user.id;
  const userId2 = req.params.userId;

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
router.post('/connections', requireAuth, async (req, res) => {
  const user1Id = req.user.id;
  const { user_2_id, suggestedActivity, meetingTime } = req.body;

  try {
    const newConnection = await UserConnection.create({
      user_1_id: user1Id,
      user_2_id,
      connection_status: 'pending',
      chatEnabled: false,
      meetingStatus: 'pending',
      suggestedActivity,
      meetingTime
    });

    res.status(201).json(newConnection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

// PUT /api/connections/:connectionId/status
// Update connection status (e.g., "pending" → "accepted")
router.put('/connections/:connectionId/status', requireAuth, async (req, res) => {
  const { connectionId } = req.params;
  const { connectionStatus } = req.body;

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
router.put('/connections/:connectionId/meeting', requireAuth, async (req, res) => {
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
router.put('/connections/:connectionId/feedback', requireAuth, async (req, res) => {
  const { connectionId } = req.params;
  const userId = req.user.id;
  const { meetAgain } = req.body;

  try {
    const connection = await UserConnection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ error: 'Connection not found' });

    if (userId === connection.user_1_id) {
      connection.meetAgainChoiceUser1 = meetAgain;
    } else if (userId === connection.user_2_id) {
      connection.meetAgainChoiceUser2 = meetAgain;
    } else {
      return res.status(403).json({ error: 'Not authorized to give feedback on this connection' });
    }

    await connection.save();
    res.json(connection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// DELETE /api/connections/:connectionId
// Remove/cancel a connection
router.delete('/connections/:connectionId', requireAuth, async (req, res) => {
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