const logger = require('../../../utils/logger');
const express = require('express');
const router = express.Router();
const path = require('path');
const userService = require('../../../services/users');
const channelService = require('../../../services/channels');

/**
 * @swagger
 * components:
 *   UserModel:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         default: 1
 *       fullname:
 *         type: string
 *         default: tester
 *       account:
 *         type: string
 *         default: test@example.com
 *       password:
 *         type: string
 *         default: 123456
 *       birth:
 *         type: string
 *         format: date
 *         default: 2000-01-01
 *       created_at:
 *         type: string
 *         format: date-time
 *       modified_at:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     description: List all users
 *     responses:
 *       200:
 *         description: Success and Return the user object array
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/UserModel'
 *       500:
 *         description: Failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
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
        logger.error(`Error caught in routes/users: ${err}`);
        res.status(500).json({
            ErrorMsg: err
        });
    }
});

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     description: Get user details by user id
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Success and Return the user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/UserModel'
 *       404:
 *         description: Failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 *       500:
 *         description: Failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.get('/:id', async (req, res) => {
    try {
        logger.debug('Get specific user info');
        const result = await userService.get(req, res);
        res.status(200).json(result);
    } catch (err) {
        switch(err.message) {
            case 'Not Found':
                logger.error(`Error caught in routes/users: ${err.message}`);
                res.status(404).json({
                    ErrorMsg: err.message
                });
                break;
            default:
                logger.error(`Error caught in routes/users: ${err}`);
                res.status(500).json({
                    ErrorMsg: err.message
                });
                break;
        }
    }
});

/**
 * @swagger
 * /api/v1/users/{userId}/channels:
 *   get:
 *     description: List user's all channels by user id
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Success and Return the channel object array
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/ChannelModel'
 *       404:
 *         description: Failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 *       500:
 *         description: Failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.get('/:id/channels', async (req, res) => {
    try {
        logger.debug('List all user\'s channels');
        const result = await channelService.listAllChannelsByUser(req, res);
        res.status(200).json(result);
    } catch (err) {
        switch(err.message) {
            case 'Not Found':
                logger.error(`Error caught in routes/users: ${err.message}`);
                res.status(404).json({
                    ErrorMsg: err.message
                });
                break;
            default:
                logger.error(`Error caught in routes/users: ${err}`);
                res.status(500).json({
                    ErrorMsg: err.message
                });
                break;
        }
    }
});

router.get('/:id/chat', async (req, res) => {
    logger.debug('Redirect to default chatroom');
    const userId = req.params.id;
    const officialChannel = await channelService.getByName(req, res);
    res.redirect(`/api/v1/users/${userId}/chat/${officialChannel.id}`);
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
