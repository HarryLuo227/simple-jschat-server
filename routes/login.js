const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const path = require('path');
const loginService = require('../services/login');

/**
 * @swagger
 * /login:
 *   get:
 *     description: Return login page
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
        logger.debug('Get user login page');
        res.status(200).sendFile(path.join(__dirname, '../views/login.html'));
    } catch (err) {
        logger.error(`Unexpected error occurred: ${err}`);
        res.status(500).end();
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     description: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - password
 *             properties:
 *               account:
 *                 type: string
 *                 default: tester@example.com
 *               password:
 *                 type: string
 *                 default: 123456
 *     responses:
 *       200:
 *         description: Login success and Return json web token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   default: xxxxxxxxxx.yyyyyyyyyy.zzzzzzzzzz
 *       400:
 *         description: Login fail, client error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 *       500:
 *         description: Login fail, internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.post('/', async (req, res) => {
    try {
        logger.debug('User login');
        const result = await loginService.login(req, res);
        if(result) {
            res.cookie('token', result.token, { expires: new Date(Date.now()+300000) });
            res.status(200).json(result);
        }
    } catch (err) {
        switch(err.message) {
            case 'Client error':
                logger.error(`Error caught in routes/login: ${err.message}`);
                res.status(400).json({
                    ErrorMsg: err.message
                });
                break;
            case 'Unexpected error occurred':
                logger.error(`Error caught in routes/login: ${err.message}`);
                res.status(500).json({
                    ErrorMsg: err.message
                });
                break;
            default:
                logger.error(`Error caught in routes/login: ${err}`);
                res.status(500).json({
                    ErrorMsg: err
                });
                break;
        }
    }
});

module.exports = router;
