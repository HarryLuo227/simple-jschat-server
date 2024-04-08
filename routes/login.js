const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const path = require('path');
const loginService = require('../services/login');

router.get('/', async (req, res) => {
    try {
        logger.debug('Get user login page');
        res.status(200).sendFile(path.join(__dirname, '../views/login.html'));
    } catch (err) {
        logger.error(`Unexpected error occurred: ${err}`);
        res.status(404).send('Not found');
    }
});

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
