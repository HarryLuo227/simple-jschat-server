const logger = require('../utils/logger');
const db = require('../db/index');

async function listAllChannelsByUser(ws) {
    try {
        logger.debug('Get all channels belong to user');
        const sql = 'SELECT c.* FROM user_channels AS uc INNER JOIN channels AS c ON uc.channel_id = c.id WHERE uc.user_id = $1';
        const values = [
            // Message send from users
        ]
        const result = await db.exec(sql, values);
        return result;
    } catch (error) {
        logger.error('Error occurred');
    }
}

module.exports = {
    listAllChannelsByUser
}
