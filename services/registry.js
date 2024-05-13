const logger = require('../utils/logger');
const db = require('../db/index');
const util = require('../utils/util');

async function register(req, res) {
    const client = await db.pool.connect();

    try {
        logger.debug('Register a new user');
        logger.debug('Start transaction');
        await client.query('BEGIN');
        
        // Register 
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;
        if(!util.isMatchRegex(req.body.account, emailRegex)) {
            throw new Error('Account is not a valid email');
        }
        const sql = 'INSERT INTO users(fullname, account, password, birth) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [
            req.body.fullname,
            req.body.account,
            req.body.password,
            req.body.birth,
        ]
        const result = await client.query(sql, values);
        if(!result) {
            throw new Error('Unexpected error occurred in register new user');
        }

        // Add default channel
        logger.debug('Add default channel for new user');
        const createUserChannelSql = 'INSERT INTO user_channels(user_id, channel_id) VALUES ($1, $2) RETURNING *';
        const createUserChannelValues = [
            result.rows[0].id,
            '9667fd9d-051d-415e-b968-7a91cd6fa755'
        ]
        const createUserChannelResult = await client.query(createUserChannelSql, createUserChannelValues);
        if(createUserChannelResult.rowCount !== 1) {
            logger.error('Throw custom error within services/registry: Add default channel to new user error');
            throw new Error('Add default channel for new user error');
        }

        logger.debug('Transaction succeeded');
        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        logger.debug('Transaction failed and rollback');
        await client.query('ROLLBACK');
        logger.error(`Error occurred in services/registry: ${err}`);
        throw err;
    } finally {
        client.release();
        logger.debug('Close transaction');
    }
}

module.exports = {
    register
}
