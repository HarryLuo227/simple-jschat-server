const express = require('express');
const router = express.Router();
const registryRouter = require('./registry');
const loginRouter = require('./login');
const apiRouter = require('./api/api');

router.use('/registry', registryRouter);
router.use('/login', loginRouter);
router.use('/api', apiRouter);

module.exports = router;
