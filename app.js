const config = require('./configs/config');
const logger = require('./utils/logger');
const morgan = require('morgan');
const stream = {
    write: (logMsg) => logger.http(logMsg)
}
const skip = () => {
    return config.RunMode !== 'debug';
}
const express = require('express');
const app = express();
const path = require('path');
const indexRouter = require('./routes/index');

app.use(morgan('tiny', { stream, skip }));
app.use('/', indexRouter);

app.get('/', async (req, res) => {
    logger.debug('Get index page');
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(config.ServerPort, () => {
    logger.info(`Server is running on http://${config.ServerAddr}:${config.ServerPort} in ${config.RunMode} mode`);
});
