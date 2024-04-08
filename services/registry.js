const logger = require('../utils/logger');
const db = require('../db/index');

async function register(req, res) {
    try {
        logger.debug('Register a new user');
        const current = new Date();
        const sql = 'INSERT INTO users(fullname, account, password, birth, created_at, modified_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [
            req.body.fullname,
            req.body.account,
            req.body.password,
            req.body.birth,
            current,
            current
        ]
        const result = await db.exec(sql, values);
        if(result) {
            return result.rows[0];
        } else {
            throw new Error('Db error');
        }
    } catch (err) {
        logger.error(`Error occurred in services/registry: Db error`);
        throw err;
    }
}

module.exports = {
    register
}
