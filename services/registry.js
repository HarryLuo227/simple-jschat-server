const logger = require('../utils/logger');
const db = require('../db/index');
const util = require('../utils/util');

async function register(req, res) {
    try {
        logger.debug('Register a new user');
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
        const result = await db.exec(sql, values);
        if(!result) {
            throw new Error('Unexpected error occurred');
        }
        return result.rows[0];
    } catch (err) {
        logger.error(`Error occurred in services/registry: ${err}`);
        throw err;
    }
}

module.exports = {
    register
}
