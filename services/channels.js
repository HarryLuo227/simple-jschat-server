const logger = require('../utils/logger');
const db = require('../db/index');

async function listAllChannelsByUser(req, res) {
    try {
        logger.debug('Get all channels belong to user');
        const sql = 'SELECT c.* FROM user_channels AS uc INNER JOIN channels AS c ON uc.channel_id = c.id WHERE uc.user_id = $1';
        const values = [
            req.params.id
        ]
        const result = await db.exec(sql, values);
        if(result.rowCount === 0) {
            throw new Error('Not Found');
        }
        return result.rows;
    } catch (err) {
        logger.error(`Error occurred in services/channels: ${err}`);
        throw err;
    }
}

async function getByName(req, res) {
    try {
        const sql = 'SELECT * FROM channels WHERE name = \'General\'';
        const result = await db.exec(sql);
        return result.rows[0];
    } catch (err) {
        logger.error(`Fatal error should not occurred caught: ${err}`);
        throw err;
    }
}

async function create(req, res) {
    const client = await db.pool.connect();

    try {
        logger.debug('Create channel');
        logger.debug('Start transaction');
        await client.query('BEGIN');

        const createChannelSql = 'INSERT INTO channels(name, type) VALUES ($1, $2) RETURNING *';
        const createChannelValues = [
            req.body.name,
            req.body.type,
        ]
        const createChannelResult = await client.query(createChannelSql, createChannelValues);
        if(createChannelResult.rowCount !== 1) {
            logger.error('Throw custom error within services/channels: Insert channel error');
            throw new Error('Insert channel error');
        }

        const createUserChannelSql = 'INSERT INTO user_channels(user_id, channel_id) VALUES ($1, $2) RETURNING *';
        const createUserChannelValues = [
            req.body.userId,
            createChannelResult.rows[0].id
        ]
        const createUserChannelResult = await client.query(createUserChannelSql, createUserChannelValues);
        if(createUserChannelResult.rowCount !== 1) {
            logger.error('Throw custom error within services/channels: Insert user_channels error');
            throw new Error('Insert user_channels error');
        }

        logger.debug('Transaction succeeded');
        await client.query('COMMIT');

        return {
            channel: createChannelResult.rows[0]
        }
    } catch (err) {
        logger.debug('Transaction failed and rollback');
        await client.query('ROLLBACK');

        if(err.message === 'Insert channel error') {
            throw err;
        } else if(err.message === 'Insert user_channels error') {
            throw err;
        } else {
            logger.error(`Error occurred in services/channels: ${err}`);
            throw err;
        }
    } finally {
        client.release();
        logger.debug('Close transaction');
    }
}

module.exports = {
    listAllChannelsByUser,
    getByName,
    create
}
