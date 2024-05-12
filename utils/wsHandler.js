const logger = require('./logger');
const util = require('./util');
const jwt = require('./jwt');
const chatService = require('../services/chat');

async function handleUpgrade(wss, request, socket, head) {
    logger.info('Handle websocket connection');
    const pathname = util.trimRedundantSlash(request.url);
    const pathRegex = /(\/api\/v1\/users\/[\d]+\/chat\/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})/g;
    const token = jwt.getAccessTokenFromHeader(request.rawHeaders);
    if(!token) {
        logger.error('Error caught in handle connection upgrade: without jwt token, unauthorization');
        return;
    }
    const isValid = await jwt.verifyAccessToken(token, jwt.getSecret());
    if(util.isMatchRegex(pathname, pathRegex) && isValid) {
        logger.debug(`${pathname} upgrade connection`);
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    }
}

async function handleEvents(ws, reqPayload) {
    // According the request payload from websocket client to do something
    try {
        switch(reqPayload.event) {
            case 'CHAT':
                logger.info('CHAT event');
                const tokens = reqPayload.endpoint.split('/');
                const channelId = tokens[tokens.length-1];
                logger.debug(`Retrieve channel ID: ${channelId}`);
                const resPayload = await chatService.getByChannel(channelId);
                ws.send(JSON.stringify({
                    endpoint: reqPayload.endpoint,
                    event: reqPayload.event,
                    payload: resPayload
                }));
                logger.debug('Succeeded handle chat event');
                break;
            default:
                // Invalid event of request
                logger.warn('INVALID event');
                break;
        }
    } catch (err) {
        logger.debug('Failed handle chat event');
        logger.error(`Error caught in handle chat events: ${err}`);
    }
}

module.exports = {
    handleUpgrade,
    handleEvents
}
