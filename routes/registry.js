const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const path = require('path');
const registryService = require('../services/registry');

router.get('/', async (req, res) => {
    try {
        logger.debug('Get user registry page');
        res.status(200).sendFile(path.join(__dirname, '../views/registry.html'));
    } catch (err) {
        logger.error(`Unexpected error occurred: ${err}`);
        res.status(404).send('Not found');
    }
});

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
