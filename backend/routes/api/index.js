// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const chatMessagesRouter = require('./chat-messages.js');
const gameplaysRouter = require('./game-plays.js');
const userconnectionsRouter = require('./user-connections.js');
const filterResultsRouter = require('./filter-results');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/chat-messages', chatMessagesRouter);
router.use('/game-plays', gameplaysRouter);
router.use('/connections', userconnectionsRouter);
router.use('/filter-results', filterResultsRouter);

module.exports = router;