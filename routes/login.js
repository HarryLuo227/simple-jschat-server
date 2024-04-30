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
 */
router.get('/', async (req, res) => {
    try {
        logger.debug('Get user login page');
        res.status(200).sendFile(path.join(__dirname, '../views/login.html'));
    } catch (err) {
        logger.error(`Unexpected error occurred: ${err}`);
        res.status(404).send('Not found');
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
 *                 default: test@example.com
 *               password:
 *                 type: string
 *                 default: 123456
 *     responses:
 *       200:
 *         description: Register success and Return json web token
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
        logger.debug('User login');
        const result = await loginService.login(req, res);
        if(result) {
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
            case 'Db error':
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
})

module.exports = router;
