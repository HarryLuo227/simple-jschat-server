const logger = require('../utils/logger');
const db = require('../db/index');

async function list(req, res) {
    try {
        logger.debug('Get all users info');
        const sql = 'SELECT * FROM users';
        const result = await db.exec(sql);
        return result.rows;
    } catch (err) {
        logger.error(`Error occurred in services/users: ${err}`);
        throw err;
    }
}

async function get(req, res) {
    try {
        logger.debug('Get user info');
        const sql = 'SELECT * FROM users WHERE id = $1';
        const values = [req.params.id];
        const result = await db.exec(sql, values);
        if(result) {
            switch(result.rowCount) {
                case 1:
                    return result.rows[0];
                default:
                    throw new Error('Not Found');
            }
        } else {
            throw new Error('Database error');
        }
    } catch (err) {
        logger.error(`Error occurred in services/users: ${err}`);
        throw err;
    }
}

module.exports = {
    list,
    get
}
