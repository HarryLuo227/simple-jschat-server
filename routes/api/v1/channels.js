const express = require('express');
const router = express.Router();
const logger = require('../../../utils/logger');
const channelService = require('../../../services/channels');

router.post('/', async (req, res) => {
    try {
        logger.debug('Add new channel');
        const result = await channelService.create(req, res);
        res.status(201).json(result);
    } catch (err) {
        logger.error(`Error caught in routes/channels: ${err}`);
        res.status(500).json({
            ErrorMsg: err
        });
    }
});

module.exports = router;
