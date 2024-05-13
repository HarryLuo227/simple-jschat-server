const express = require('express');
const router = express.Router();
const logger = require('../../../utils/logger');
const channelService = require('../../../services/channels');

/**
 * @swagger
 * components:
 *   ChannelModel:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *         default: 9667fd9d-051d-415e-b968-7a91cd6fa755
 *       name:
 *         type: string
 *         default: General
 *       type:
 *         type: string
 *         default: public
 */

/**
 * @swagger
 * /api/v1/channels:
 *   post:
 *     description: Add new channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 default: Family
 *               type:
 *                 type: string
 *                 default: public
 *               userId:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Add new channel success and Return json object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ChannelModel'
 *       500:
 *         description: Add channel fail, internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
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
