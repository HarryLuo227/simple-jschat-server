const config = require('../configs/config');
const logger = require('../utils/logger');
const { Pool } = require('pg');
const dbConfig = {
    user: config.DBUser,
    password: config.DBPassword,
    host: config.DBAddr,
    port: config.DBPort,
    database: config.DBName
}
const pool = new Pool(dbConfig);

async function exec(sqlQuery, ...params) {
    try {
        const start = Date.now();
        const res = await pool.query(sqlQuery, ...params);
        const end = Date.now();
        const duration = end-start;
        logger.debug(`Execute SQL query: ${sqlQuery}, Value: ${params}, Duration: ${duration}ms`);
        return res;
    } catch (err) {
        logger.error(`Execute SQL query error: ${err}`);
    }
}

module.exports = {
    pool,
    exec
}
