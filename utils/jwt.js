const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const logger = require('./logger');

function getExpiresIn() {
    return config.JwtExpiresIn;
}

function getIssuer() {
    return config.JwtIssuer;
}

function getSecret() {
    return config.JwtSecret;
}

async function genAccessToken(payload, secretKey, signOptions) {
    try {
        logger.debug('Generate JWT token');
        const token = await jwt.sign(payload, secretKey, signOptions);
        return token;
    } catch (err) {
        logger.error(`Error in generating JWT token: ${err}`);
        throw err;
    }
}

module.exports = {
    getExpiresIn,
    getIssuer,
    getSecret,
    genAccessToken
}
