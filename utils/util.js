const logger = require('./logger');

function isMatchRegex(src, re) {
    const match = src.match(re);
    if(match) {
        return true;
    }
    return false;
}

function retrieveParam(endpoint, prefix) {
    logger.debug('Retrieve param from url endpoint');
    if(hasBeginningSlash(endpoint)) {
        endpoint = trimRedundantSlash(endpoint);
        let beginIdx = returnLastIndexOfPrefix(endpoint, prefix);
        let endIdx = -1;
        for(let i = beginIdx+1; i < endpoint.length; i++) {
            if(endpoint[i] === '/') {
                endIdx = i;
                break;
            }
        }
        const param = endpoint.substring(beginIdx+1, endIdx);
        return param;
    } else {
        logger.error('retrieveParam error and return nothing');
        return;
    }
}

function hasBeginningSlash(endpoint) {
    logger.debug('Check endpoint has beginning slash');
    let isString = false;
    switch(typeof endpoint) {
        case 'string':
            if(endpoint.charAt(0) === '/') {    
                isString = true;
            }
            break;
        default:
            logger.error('The endpoint parameter passed to hasBeginning is not string');
            isString = false;
            break;
    }

    return isString;
}

function returnLastIndexOfPrefix(endpoint, prefix) {
    return endpoint.lastIndexOf(prefix) + prefix.length;
}

function returnLastIndexOfPrefixSlash(endpoint) {
    for(let i = 1; i < endpoint.length; i++) {
        if(endpoint[i] !== '/') {
            return i-1;
        }
    }
}

function trimRedundantSlash(endpoint) {
    logger.debug('Remove redundant prefix slash');
    return endpoint.substring(returnLastIndexOfPrefixSlash(endpoint));
}

module.exports = {
    isMatchRegex,
    retrieveParam,
    trimRedundantSlash
}
