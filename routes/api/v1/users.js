const logger = require('../../../utils/logger');
const express = require('express');
const router = express.Router();
const path = require('path');
const userService = require('../../../services/users');
const channelService = require('../../../services/channels');

router.get('/', async (req, res) => {
    try {
        logger.debug('List all users info');
        const result = await userService.list(req, res);
        switch(result.length) {
            case 0:
                const emptyResult = {};
                res.status(200).json(emptyResult);
                break;
            case 1:
                res.status(200).json(result[0]);
                break;
            default:
                res.status(200).json(result);
                break;
        }
    } catch (err) {
        switch(err.message) {
            case 'Db error':
                logger.error(`Error caught in routes/users: ${err.message}`);
                res.status(500).json({
                    ErrorMsg: err.message
                });
                break;
            default:
                logger.error(`Error caught in routes/users: ${err}`);
                res.status(500).json({
                    ErrorMsg: err
                });
                break;
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        logger.debug('Get specific user info');
        const result = await userService.get(req, res);
        res.status(200).json(result);
    } catch (err) {
        switch(err.message) {
            case 'Db error':
                logger.error(`Error caught in routes/users: ${err.message}`);
                res.status(404).json({
                    ErrorMsg: err.message
                });
                break;
            default:
                logger.error(`Error caught in routes/users: ${err}`);
                res.status(500).json({
                    ErrorMsg: err
                });
                break;
        }
    }
});

router.get('/:id/channels', async (req, res) => {
    try {
        logger.debug('List all user\'s channels');
        const result = await channelService.listAllChannelsByUser(req, res);
        res.status(200).json(result);
    } catch (err) {
        logger.error(`Error caught in routes/users: ${err}`);
        res.status(500).json({
            ErrorMsg: err
        });
    }
});

router.get('/:id/chat', (req, res) => {
    logger.debug('Redirect to default chatroom');
    const userId = req.params.id;
    const defaultChatUUID = '9667fd9d-051d-415e-b968-7a91cd6fa755'
    res.redirect(`/api/v1/users/${userId}/chat/${defaultChatUUID}`);
});

router.get('/:id/chat/:uuid', async (req, res) => {
    try {
        logger.debug('Enter default chatroom');
        res.status(200).sendFile(path.join(__dirname, '../../../views/chatroom.html'));
    } catch (err) {
        logger.error(`Error caught in routes/users: ${err}`);
        res.status(404).end();
    }
});

module.exports = router;
