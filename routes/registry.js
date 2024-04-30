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
 */
router.get('/', async (req, res) => {
    try {
        logger.debug('Get user registry page');
        res.status(200).sendFile(path.join(__dirname, '../views/registry.html'));
    } catch (err) {
        logger.error(`Unexpected error occurred: ${err}`);
        res.status(404).send('Not found');
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
 *                 default: tester
 *               account:
 *                 type: string
 *                 default: test@example.com
 *               password:
 *                 type: string
 *                 default: 123456
 *               birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
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
        logger.debug('User registry')
        const result = await registryService.register(req, res);
        if(result) {
            res.status(201).json(result);
        } else {
            throw new Error('Unexpected error occurred');
        }
    } catch (err) {
        switch(err.message) {
            case 'Db error':
                logger.error(`Error caught in routes/registry: ${err.message}`);
                res.status(400).json({
                    ErrorMsg: err.message
                });
                break;
            case 'Unexpected error occurred':
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
