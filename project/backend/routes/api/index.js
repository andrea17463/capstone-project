// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
// const <name-of-model-plural>Router = require('/<name-of-model-plural>');

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
// router.use('/<name-of-model-plural>', <name-of-model-plural>Router);

module.exports = router;