const config = require('./configs/config');
const logger = require('./utils/logger');
const morgan = require('morgan');
const stream = {
    write: (logMsg) => logger.http(logMsg)
}
const skip = () => {
    return config.RunMode !== 'debug';
}
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Simple-Jschat-API',
            version: '1.0.0',
            description: 'API list of simple-jschat-server'
        }
    },
    apis: [
        './routes/*.js',
        // v1
        './routes/api/v1/*.js'
    ]
}
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const { WebSocketServer } = require('ws');
const wsHandler = require('./utils/wsHandler');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(morgan('tiny', { stream, skip }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', indexRouter);

app.get('/', async (req, res) => {
    logger.debug('Get index page');
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

const server = app.listen(config.ServerPort, () => {
    logger.info(`Server is running on http://${config.ServerAddr}:${config.ServerPort} in ${config.RunMode} mode`);
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
    wsHandler.handleUpgrade(wss, req, socket, head);
});

wss.on('connection', (ws, req) => {
    logger.info('New client connect chatroom');
    ws.send('You now can chat with your friend!');
    
    ws.on('error', (err) => {
        logger.error(`Error occurred in client side of WebSocket connection: ${err}`);
    });
    
    ws.on('message', async (data) => {
        logger.debug(`Received data from ${req.headers['sec-websocket-key']} client: ${data}`);
        const reqPayload = JSON.parse(data);
        await wsHandler.handleEvents(ws, reqPayload);
    });
});

module.exports = server;
