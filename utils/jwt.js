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

function getAccessTokenFromHeader(header) {
    const cookieElement = header.findIndex((element) => element === 'Cookie')
    if(cookieElement === -1) {
        return;
    }

    const token = header[cookieElement+1].replaceAll('token=Bearer%20', '');
    return token;
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

async function verifyAccessToken(jwtToken, secretKey) {
    try {
        logger.debug('Verify JWT token');
        const decode = await jwt.verify(jwtToken, secretKey);
        return true;
    } catch (err) {
        logger.error(`Error in verifying JWT token: ${err}`);
        switch (err.name) {
            case 'TokenExpiredError':
                logger.error(`[TokenExpiredError]: Expire At ${err.expiredAt}`);
                break;
            case 'JsonWebTokenError':
                logger.error(`[JsonWebTokenError]: ${err}`);
                break;
            default:
                logger.error('Unexpected error occurred');
                break;
        }
        return false;
    }
}

module.exports = {
    getExpiresIn,
    getIssuer,
    getSecret,
    getAccessTokenFromHeader,
    genAccessToken,
    verifyAccessToken
}
