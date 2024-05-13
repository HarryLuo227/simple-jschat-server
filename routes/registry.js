const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const path = require('path');
const registryService = require('../services/registry');

/**
 * @swagger
 * /registry:
 *   get:
 *     description: Return registry page
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (req, res) => {
    try {
        logger.debug('Get user registry page');
        res.status(200).sendFile(path.join(__dirname, '../views/registry.html'));
    } catch (err) {
        logger.error(`Unexpected error occurred: ${err}`);
        res.status(500).end();
    }
});

/**
 * @swagger
 * /registry:
 *   post:
 *     description: Register new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - account
 *               - password
 *               - birth
 *             properties:
 *               fullname:
 *                 type: string
 *                 default: unit-tester
 *               account:
 *                 type: string
 *                 format: email
 *                 default: unit-tester@example.com
 *               password:
 *                 type: string
 *                 default: 123456
 *               birth:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *     responses:
 *       201:
 *         description: Register success and Return json object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/UserModel'
 *       400:
 *         description: Register fail, client error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 *       500:
 *         description: Register fail, internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.post('/', async (req, res) => {
    try {
        logger.debug('User registry')
        const result = await registryService.register(req, res);
        res.status(201).json(result);
    } catch (err) {
        switch(err.message) {
            case 'Account is not a valid email':
                logger.error(`Error caught in routes/registry: ${err.message}`);
                res.status(400).json({
                    ErrorMsg: err.message
                });
                break;
            case 'Unexpected error occurred in register new user':
                logger.error(`Error caught in routes/registry: ${err.message}`);
                res.status(500).json({
                    ErrorMsg: err.message
                });
                break;
            case 'Add default channel for new user error':
                logger.error(`Error caught in routes/registry: ${err.message}`);
                res.status(500).json({
                    ErrorMsg: err.message
                });
                break;
            default:
                logger.error(`Error caught in routes/registry: ${err}`);
                res.status(500).json({
                    ErrorMsg: err
                })
                break;
        }
    }
});

module.exports = router;
