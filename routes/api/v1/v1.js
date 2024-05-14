const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const channelsRouter = require('./channels');
const chatRouter = require('./chat');
const middlewares = require('../../../middlewares/auth');

router.use(middlewares.authenticator());

router.use('/users', usersRouter);
router.use('/channels', channelsRouter);
router.use('/chat', chatRouter);

module.exports = router;
