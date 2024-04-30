const express = require('express');
const router = express.Router();
const logger = require('../../../utils/logger');
const chatService = require('../../../services/chat');

router.post('/', async (req, res) => {
    try {
        logger.debug('Add message');
        const result = await chatService.create(req, res);
        res.status(201).json(result);
    } catch (err) {
        logger.error(`Error caught in routes/chat: ${err}`);
        res.status(500).json({
            ErrorMsg: err
        });
    }
});

module.exports = router;
