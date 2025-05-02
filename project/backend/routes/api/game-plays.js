// backend/routes/api/game-plays.js
const express = require('express');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
// const { handleValidationErrors } = require('../../utils/validation');
// const { validateGamePlays } = require('../../utils/post-validators');
const { GamePlay, UserConnection } = require('../../db/models');

const router = express.Router();

// GET /api/game-plays/:gamePlayId
// Get specific game round (if meeting is active)

// GET /api/game-plays
// Get all game rounds involving the user (active meetings only)

// POST /api/game-plays
// Start a new game round (requires active meeting)

// PUT /api/game-plays/:gamePlayId/guess
// Update a guess result (e.g., correct/incorrect)

// PUT /api/game-plays/:gamePlayId/prompt
// Update the "talk-about" or "roast" prompt post-guess

// DELETE /api/game-plays
// Automatically deletes all game rounds after the meeting ends (batch delete)

// GET /api/game-plays/:gamePlayId
// Get specific game round (if meeting is active)
router.get('/game-plays/:gamePlayId', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;

  try {
    const game = await GamePlay.findByPk(gamePlayId);

    if (!game || game.status !== 'active') {
      return res.status(404).json({ error: 'Active game round not found' });
    }

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve game round' });
  }
});

// GET /api/game-plays
// Get all game rounds involving the user (active meetings only)
router.get('/game-plays', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const games = await GamePlay.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { user_1_id: userId },
          { user_2_id: userId }
        ]
      },
      order: [['created_at', 'DESC']]
    });

    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch game rounds' });
  }
});

// POST /api/game-plays
// Start a new game round (requires active meeting)
router.post('/game-plays', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { user_1_id, user_2_id, traitName, traitDescription, interactionType } = req.body;

  try {
    if (![user_1_id, user_2_id].includes(userId)) {
      return res.status(403).json({ error: 'You are not part of this meeting' });
    }

    const connection = await UserConnection.findOne({
      where: {
        [Op.or]: [
          { user_1_id, user_2_id },
          { user_1_id: user_2_id, user_2_id: user_1_id }
        ],
        connectionStatus: 'active',
        meetingStatus: 'active'
      }
    });

    if (!connection) {
      return res.status(400).json({ error: 'No active meeting found between the users' });
    }

    const newGame = await GamePlay.create({
      user_1_id,
      user_2_id,
      traitName,
      traitDescription,
      interactionType,
      status: 'active'
    });

    res.status(201).json(newGame);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start game round' });
  }
});

// PUT /api/game-plays/:gamePlayId/guess
// Update a guess result (e.g., correct/incorrect)
router.put('/game-plays/:gamePlayId/guess', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;
  const { guessedValue, isCorrect, user_id } = req.body;

  try {
    const game = await GamePlay.findByPk(gamePlayId);

    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.guessedValue = guessedValue;
    game.isCorrect = isCorrect;
    game.user_id = user_id;
    await game.save();

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update guess result' });
  }
});

// PUT /api/game-plays/:gamePlayId/prompt
// Update the "talk-about" or "roast" prompt post-guess
router.put('/game-plays/:gamePlayId/prompt', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;
  const { promptText, user_id } = req.body;

  try {
    const game = await GamePlay.findByPk(gamePlayId);

    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.promptText = promptText;
    game.user_id = user_id;
    game.status = 'completed';
    await game.save();

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// DELETE /api/game-plays
// Automatically deletes all game rounds after the meeting ends (batch delete)
router.delete('/game-plays', requireAuth, async (req, res) => {
  const { user_1_id, user_2_id } = req.body;

  try {
    await GamePlay.destroy({
      where: {
        [Op.or]: [
          { user_1_id, user_2_id },
          { user_1_id: user_2_id, user_2_id: user_1_id }
        ]
      }
    });

    res.json({ message: 'Game rounds deleted after meeting end' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete game rounds' });
  }
});

module.exports = router;