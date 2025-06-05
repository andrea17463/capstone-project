// backend/routes/api/user-connections.js
const express = require('express');
const { Op } = require('sequelize');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { UserConnection, User } = require('../../db/models');
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
  try {
    const userId = req.user.id;
    // console.log('GET /api/connections userId', userId);
    if (process.env.NODE_ENV !== 'production') {
      console.log('GET /api/connections Authenticated user:', req.user);
    }

    const connections = await UserConnection.findAll({
      where: {
        [Op.or]: [
          { user_1_id: userId },
          { user_2_id: userId }
        ]
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username', 'interests'] },
        { model: User, as: 'user2', attributes: ['id', 'username', 'interests'] }
      ],
      order: [['updatedAt', 'DESC']],
    });

    const processedConnections = connections.map(connection => {
      const user1 = connection.user1;
      const user2 = connection.user2;

      user1.interests = user1?.interests?.split(',') || [];
      user2.interests = user2?.interests?.split(',') || [];

      return {
        ...connection.toJSON(),
        user1,
        user2,
      };
    });

    res.json(processedConnections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch connections' });
  }
});

// GET /api/connections/:userId
// Get specific connection between current user and another user
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const userId1 = req.user.id;
    const userId2 = req.params.userId;
    // console.log('GET /api/connections/:userId Authenticated user:', req.user);
    if (process.env.NODE_ENV !== 'production') {
      console.log('GET /api/connections/:userId Authenticated user:', req.user);
    }

    // const connection = await UserConnection.findOne({
    //   where: {
    //     [Op.or]: [
    //       { user_1_id: userId1, user_2_id: userId2 },
    //       { user_1_id: userId2, user_2_id: userId1 }
    //     ]
    //   }
    // });
    const connection = await UserConnection.findOne({
      where: {
        // [Op.and]: [
        // {
        [Op.or]: [
          // { user_1_id, user_2_id },
          // { user_1_id: user_2_id, user_2_id: user_1_id }
          { user_1_id: userId1, user_2_id: userId2 },
          { user_1_id: userId2, user_2_id: userId1 }
        ]
        //   },
        //   { connectionStatus: 'accepted' },
        //   { meetingStatus: 'active' }
        // ]
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
  const { user2Id, suggestedActivity, meetingTime } = req.body;
  // console.log('POST /api/connections Authenticated user:', req.user);
  if (process.env.NODE_ENV !== 'production') {
    console.log('POST /api/connections Authenticated user:', req.user);
  }

  const parsedMeetingTime = new Date(meetingTime);
  if (!user2Id || !suggestedActivity || isNaN(parsedMeetingTime.getTime())) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const existingConnection = await UserConnection.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { user_1_id: user1Id, user_2_id: user2Id },
              { user_1_id: user2Id, user_2_id: user1Id }
            ]
          },
          {
            connectionStatus: { [Op.notIn]: ['completed', 'declined'] }
          }
        ]
      }
    });

    if (existingConnection) {
      return res.status(409).json({ message: "A connection already exists between these users" });
    }

    const newConnection = await UserConnection.create({
      user_1_id: user1Id,
      user_2_id: user2Id,
      connectionStatus: 'pending',
      // chatEnabled: false,
      meetingStatus: 'pending',
      suggestedActivity,
      meetingTime: parsedMeetingTime
    });

    const fullConnection = await UserConnection.findByPk(newConnection.id, {
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username', 'interests'] },
        { model: User, as: 'user2', attributes: ['id', 'username', 'interests'] }
      ]
    });

    return res.status(201).json(fullConnection);
  } catch (err) {
    console.error('Error creating connection:', err);
    return res.status(500).json({ error: 'Failed to create connection' });
  }
});

// PUT /api/connections/:connectionId/status
// Update connection status (e.g., "pending" → "accepted")
router.put('/:connectionId/status', requireAuth, async (req, res) => {
  const { connectionId } = req.params;
  const { connectionStatus } = req.body;

  try {
    const connection = await UserConnection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ error: 'Connection not found' });

    const validStatuses = ['active', 'pending', 'accepted', 'declined'];
    if (!validStatuses.includes(connectionStatus)) {
      return res.status(400).json({ error: 'Invalid connection status' });
    }

    const updatedConnection = await connection.update({
      connectionStatus,
      ...(connectionStatus === 'accepted' && { meetingStatus: 'active' })
    });

    res.json(updatedConnection);
  } catch (err) {
    console.error('Error updating connection status:', err);
    res.status(500).json({ error: 'Failed to update connection status', details: err.message });
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

    const validStatuses = ['active', 'pending', 'accepted', 'confirmed', 'canceled', 'completed'];
    if (!validStatuses.includes(meetingStatus)) {
      return res.status(400).json({ error: 'Invalid meeting status' });
    }

    const updatedConnection = await connection.update({ meetingStatus });

    res.json(updatedConnection);
  } catch (err) {
    console.error('Error updating meeting status:', err);
    res.status(500).json({ error: 'Failed to update meeting status', details: err.message });
  }
});

// PUT /api/connections/:connectionId/feedback
// Indicate whether the user wants to meet again
router.put('/:connectionId/feedback', requireAuth, async (req, res) => {
  const { connectionId } = req.params;
  const userId = req.user.id;
  const { meetAgain } = req.body;
  // console.log('PUT /api/connections/:connectionId/feedback Authenticated user:', req.user);
  if (process.env.NODE_ENV !== 'production') {
    console.log('PUT /api/connections/:connectionId/feedback Authenticated user:', req.user);
  }

  try {
    const connection = await UserConnection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ error: 'Connection not found' });

    let updateData = {};

    if (userId === connection.user_1_id) {
      updateData.meetAgainChoiceUser1 = meetAgain;
    } else if (userId === connection.user_2_id) {
      updateData.meetAgainChoiceUser2 = meetAgain;
    } else {
      return res.status(403).json({ error: 'Not authorized to give feedback on this connection' });
    }

    const updatedConnection = await connection.update(updateData);
    res.json(updatedConnection);
  } catch (err) {
    console.error('Error updating feedback:', err);
    res.status(500).json({ error: 'Failed to submit feedback', details: err.message });
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