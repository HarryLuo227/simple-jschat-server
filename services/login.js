const logger = require('../utils/logger');
const db = require('../db/index');
const jwt = require('../utils/jwt');

async function login(req, res) {
    try {
        logger.debug('New user login');
        if(!req.body.account || !req.body.password) {
            throw new Error('Client error')
        }
        const sql = 'SELECT id FROM users WHERE account = $1 AND password = $2';
        const values = [
            req.body.account,
            req.body.password
        ]
        const result = await db.exec(sql, values);
        if(result.rowCount === 1) {
            const jwtPayload = {
                userId: result.rows[0].id,
                userAccount: result.rows[0].account
            }
            const jwtSignOptions = {
                algorithm: 'HS256',
                issuer: jwt.getIssuer(),
                expiresIn: jwt.getExpiresIn()
            }
            const token = await jwt.genAccessToken(jwtPayload, jwt.getSecret(), jwtSignOptions);
            return {
                token: 'Bearer '+token
            };
        } else {
            throw new Error('Unexpected error occurred');
        }
    } catch (err) {
        logger.error(`Error occurred in services/login: ${err}`);
        throw err;
    }
}

module.exports = {
    login
}
