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
        return result.rows;
    } catch (err) {
        logger.error(`Error occurred in services/channels: ${err}`);
        throw err;
    }
}

module.exports = {
    listAllChannelsByUser
}
