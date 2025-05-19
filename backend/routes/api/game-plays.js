// backend/routes/api/game-plays.js
const express = require('express');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
// const { handleValidationErrors } = require('../../utils/validation');
// const { validateGamePlays } = require('../../utils/post-validators');
const { GamePlay, UserConnection, User } = require('../../db/models');

const router = express.Router();

// GET /api/game-plays/:gamePlayId
// Get specific game round (if meeting is active)

// GET /api/game-plays
// Get all game rounds involving the user (active meetings only)

// POST /api/game-plays
// Start a new game round (requires active meeting)

// PUT /api/game-plays/:gamePlayId/guess
// Update a guess result (e.g., correct/incorrect)

// PUT /api/game-plays/:gamePlayId/correctness
// Update whether a guess was correct or not

// PUT /api/game-plays/:gamePlayId/interaction-type
// Update the interaction type (guessing, roasts, talk-about)

// PUT /api/game-plays/:gamePlayId/prompt
// Update the "talk-about" or "roast" prompt post-guess

// DELETE /api/game-plays
// Automatically deletes all game rounds after the meeting ends (batch delete)

// GET /api/game-plays/:gamePlayId
// Get specific game round (if meeting is active)
router.get('/:gamePlayId', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;

  try {
    const game = await GamePlay.findByPk(gamePlayId, {
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username'] },
        { model: User, as: 'user2', attributes: ['id', 'username'] }
      ]
    });

    if (!game || game.status !== 'active') {
      return res.status(404).json({ error: 'Active game round not found' });
    }

    res.json(game);
  } catch (err) {
    console.error('GET /api/game-plays/:gamePlayId error', err);
    res.status(500).json({ error: 'Failed to retrieve game round' });
  }
});

// GET /api/game-plays
// Get all game rounds involving the user (active meetings only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // try {
    const games = await GamePlay.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { user_1_id: userId }
          ,
          { user_2_id: userId },
          { guesser_id: userId }
        ]
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'username'] },
        { model: User, as: 'user2', attributes: ['id', 'username'] },
        { model: User, as: 'guesser' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(games);
  } catch (err) {
    console.error('GET /api/game-plays error', err);
    res.status(500).json({ error: 'Failed to fetch game rounds' });
  }
});

// POST /api/game-plays
// Start a new game round (requires active meeting)
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { user_1_id, user_2_id, traitCategory, traitName, interactionType } = req.body;
    // const { user_1_id, traitCategory, traitName, interactionType } = req.body;
    // console.log('user_1_id:', user_1_id, 'user_2_id:', user_2_id);
    // console.log("Creating GamePlay with:", {
    //   user_1_id, traitCategory, traitName, interactionType
    // });

    // try {
    if (![user_1_id, user_2_id].includes(userId)) {
      // if (![user_1_id].includes(userId)) {
      return res.status(403).json({ error: 'You are not part of this meeting' });
    }

    // const connection = await UserConnection.findOne({
    //   where: {
    //     [Op.or]: [
    //       { user_1_id, user_2_id },
    //       { user_1_id: user_2_id, user_2_id: user_1_id }
    //     ],
    //     connectionStatus: 'active',
    //     meetingStatus: 'active'
    //   }
    // });
    const connection = await UserConnection.findOne({
      where: {
        [Op.or]: [
          { user_1_id: user_1_id, user_2_id: user_2_id },
          { user_1_id: user_2_id, user_2_id: user_1_id }
        ],
        //   connectionStatus: 'active',
        //   meetingStatus: 'active'
      }
    });

    // if (!connection) {
    //   return res.status(400).json({ error: 'No active connection found between the users' });
    // }

    // const newGame = await GamePlay.create({
    //   user_1_id,
    //   user_2_id,
    //   traitCategory,
    //   traitName,
    //   interactionType,
    //   status: 'active'
    // });
    const newGame = await GamePlay.create({
      user_1_id,
      user_2_id,
      guesser_id: userId,
      traitCategory,
      traitName,
      interactionType: interactionType || "guessing",
      status: 'active'
    });

    res.status(201).json(newGame);
  } catch (err) {
    console.error('Game creation error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to start game round' });
  }
});

// PUT /api/game-plays/:gamePlayId/trait
// Update the trait information for a game
router.put('/:gamePlayId/trait', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;
  const { traitCategory, traitName } = req.body;

  try {
    const game = await GamePlay.findByPk(gamePlayId);

    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (game.user_1_id !== req.user.id && game.user_2_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this game' });
    }
    //     if (game.user_1_id !== req.user.id) {
    //   return res.status(403).json({ error: 'You are not authorized to update this game' });
    // }

    game.traitCategory = traitCategory;
    game.traitName = traitName;
    await game.save();

    res.json(game);
  } catch (err) {
    console.error('PUT /api/game-plays/:gamePlayId/trait error', err);
    res.status(500).json({ error: 'Failed to update game trait' });
  }
});

// PUT /api/game-plays/:gamePlayId/guess
// Update a guess result (e.g., correct/incorrect)
router.put('/:gamePlayId/guess', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;
  const { guessedValue, isCorrect, guesser_id } = req.body;

  if (guessedValue === undefined || guessedValue === null) {
    return res.status(400).json({ error: 'guessedValue is required' });
  }

  try {
    const game = await GamePlay.findByPk(gamePlayId);

    if (!game) return res.status(404).json({ error: 'Game not found' });

    const currentUserId = req.user.id;

    if (![game.user_1_id, game.user_2_id].includes(currentUserId)) {
      // if (![game.user_1_id].includes(currentUserId)) {
      return res.status(403).json({ error: 'You are not a participant in this game' });
    }

    game.guessedValue = guessedValue;
    game.isCorrect = isCorrect;
    game.guesser_id = guesser_id;
    if (game.traitName) {
      game.isCorrect = guessedValue === game.traitName;
    }
    await game.save();

    res.json(game);
  } catch (err) {
    console.error('PUT /api/game-plays/:gamePlayId/guess error', err);
    res.status(500).json({ error: 'Failed to update guess result' });
  }
});

// PUT /api/game-plays/:gamePlayId/correctness
// Update whether a guess was correct or not
router.put('/:gamePlayId/correctness', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;
  const { isCorrect } = req.body;

  try {
    const game = await GamePlay.findByPk(gamePlayId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.user_1_id !== req.user.id && game.user_2_id !== req.user.id) {
      // if (game.user_1_id !== req.user.id) {
      return res.status(403).json({
        error: 'You are not authorized to update this game'
      });
    }

    game.isCorrect = isCorrect;
    await game.save();

    res.json(game);
  } catch (err) {
    console.error('PUT /api/game-plays/:gamePlayId/correctness error:', err);
    res.status(500).json({ error: 'Failed to update game correctness' });
  }
});

// PUT /api/game-plays/:gamePlayId/interaction-type
// Update the interaction type (guessing, roasts, talk-about)
router.put('/:gamePlayId/interaction-type', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;
  const { interactionType } = req.body;

  const validInteractionTypes = ['guessing', 'roasts', 'talk-about'];
  if (!validInteractionTypes.includes(interactionType)) {
    return res.status(400).json({
      error: 'Invalid interaction type. Must be one of: guessing, roasts, talk-about'
    });
  }

  try {
    const game = await GamePlay.findByPk(gamePlayId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.user_1_id !== req.user.id && game.user_2_id !== req.user.id) {
      // if (game.user_1_id !== req.user.id) {
      return res.status(403).json({
        error: 'You are not authorized to update this game'
      });
    }

    game.interactionType = interactionType;
    await game.save();

    res.json(game);
  } catch (err) {
    console.error('PUT /api/game-plays/:gamePlayId/interaction-type error:', err);
    res.status(500).json({ error: 'Failed to update interaction type' });
  }
});

// PUT /api/game-plays/:gamePlayId/prompt
// Update the "talk-about" or "roast" prompt post-guess
router.put('/:gamePlayId/prompt', requireAuth, async (req, res) => {
  const { gamePlayId } = req.params;
  const { promptText, guesser_id } = req.body;

  try {
    const game = await GamePlay.findByPk(gamePlayId);

    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.promptText = promptText;
    game.guesser_id = guesser_id;
    game.status = 'completed';
    await game.save();

    res.json(game);
  } catch (err) {
    console.error('PUT /api/game-plays/:gamePlayId/prompt error', err);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// DELETE /api/game-plays
// Automatically deletes all game rounds after the meeting ends (batch delete)
router.delete('/', requireAuth, async (req, res) => {
  const { user_1_id, user_2_id } = req.body;
  // const { user_1_id} = req.body;

  const currentUserId = req.user.id;
  if (![user_1_id, user_2_id].includes(currentUserId)) {
    // if (![user_1_id].includes(currentUserId)) {
    return res.status(403).json({ error: 'Unauthorized to delete these game rounds' });
  }

  try {
    await GamePlay.destroy({
      where: {
        [Op.or]: [
          // { user_1_id, user_2_id },
          // { user_1_id: user_2_id, user_2_id: user_1_id }
          { user_1_id },
          { user_1_id: user_2_id, user_2_id: user_1_id }
        ]
      }
    });

    res.json({ message: 'Game rounds deleted after meeting end' });
  } catch (err) {
    console.error('DELETE /api/game-plays error', err);
    res.status(500).json({ error: 'Failed to delete game rounds' });
  }
});

module.exports = router;