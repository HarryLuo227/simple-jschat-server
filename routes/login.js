const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        logger.debug('Get user login page');
        res.status(501).send('API is not implemented');
    } catch (err) {
        logger.error(`Unexpected error occurred: ${err}`);
        res.status(404).send('Not found');
    }
});

module.exports = router;
