const logger = require('../utils/logger');
const db = require('../db/index');

async function login(req, res) {
    try {
        logger.debug('New user sign in');
        if(!req.body.account || !req.body.password) {
            throw new Error('Client error')
        }
        const sql = 'SELECT id FROM users WHERE account = $1 and password = $2';
        const values = [
            req.body.account,
            req.body.password
        ]
        const result = await db.exec(sql, values);
        if(result.rowCount === 1) {
            return result.rows[0];
        } else {
            throw new Error('Db error');
        }
    } catch (err) {
        logger.error(`Error occurred in services/login: ${err}`);
        throw err
    }
}

module.exports = {
    login
}
