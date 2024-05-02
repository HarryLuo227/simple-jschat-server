const logger = require('../utils/logger');
const db = require('../db/index');

async function getByChannel(channelId) {
    try {
        logger.debug('Get all chat messages in channel');
        const sql = 'SELECT * FROM messages WHERE belongs_to = $1 ORDER BY created_at';
        const values = [
            channelId
        ]
        const result = await db.exec(sql, values);
        return result.rows;
    } catch (err) {
        logger.error('Error occurred in services/chat');
        throw err;
    }
}

// Insert a message into table
async function create(req, res) {
    try {
        logger.debug('Create message');
        const sql = 'INSERT INTO messages(content, from_user, created_at, belongs_to) VALUES ($1, $2, $3, $4) RETURNING *';
        const current = new Date();
        const values = [
            req.body.content,
            req.body.userId,
            current,
            req.body.channelId
        ]
        const result = await db.exec(sql, values);
        return result.rows[0];
    } catch (err) {
        logger.error(`Error occurred in services/chat: ${err}`);
        throw err;
    }
}

module.exports = {
    getByChannel,
    create
}
