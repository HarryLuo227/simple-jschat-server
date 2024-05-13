const express = require('express');
const router = express.Router();
const logger = require('../../../utils/logger');
const chatService = require('../../../services/chat');

/**
 * @swagger
 * components:
 *   MessageModel:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         default: 1
 *       content:
 *         type: string
 *         default: This is a unit test message sent from user {tester} !!!
 *       from_user:
 *         type: integer
 *         default: 1
 *       created_at:
 *         type: string
 *         format: date-time
 *       belongs_to:
 *         type: string
 *         format: uuid
 *         default: 9667fd9d-051d-415e-b968-7a91cd6fa755
 */

/**
 * @swagger
 * /api/v1/chat:
 *   post:
 *     description: Add new message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *               - channelId
 *             properties:
 *               content:
 *                 type: string
 *                 default: This is a unit test message sent from user {tester} !!!
 *               userId:
 *                 type: integer
 *                 default: 1
 *               channelId:
 *                 type: string
 *                 format: uuid
 *                 default: 9667fd9d-051d-415e-b968-7a91cd6fa755
 *     responses:
 *       201:
 *         description: Add new message success and Return json object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/MessageModel'
 *       500:
 *         description: Add message fail, internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
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
