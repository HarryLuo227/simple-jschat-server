const logger = require('./logger');
const util = require('./util');

function handleUpgrade(wss, request, socket, head) {
    logger.info('Handle websocket connection');
    const pathname = util.trimRedundantSlash(request.url);
    const pathRegex = /(\/api\/v1\/users\/[\d]+\/chat)/g;
    if(util.isMatchRegex(pathname, pathRegex)) {
        logger.debug(`${pathname} upgrade connection`);
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    }
}

module.exports = {
    handleUpgrade
}
