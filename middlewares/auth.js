const logger = require('../utils/logger');
const jwt = require('../utils/jwt');

function authenticator() {
    return async function (req, res, next) {
        logger.info('Authenticating...');
        logger.debug('Use auth middleware');

        if(!req.cookies.token) {
            logger.error('Error occurred in middlewares/auth: Without access token');
            res.status(401).json({
                ErrorMsg: 'Unauthorized'
            });
            return;
        }

        const isValid = await jwt.verifyAccessToken(req.cookies.token.replaceAll('Bearer ', ''), jwt.getSecret());
        if(!isValid) {
            logger.error('Access token is not valid');
            res.status(403).json({
                ErrorMsg: 'Forbidden'
            });
            return;
        }

        next();
    }
}

module.exports = {
    authenticator
}
