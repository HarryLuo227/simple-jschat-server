const config = {
    RunMode: process.env.RUN_MODE,
    ServerAddr: process.env.SERVER_ADDRESS,
    ServerPort: process.env.SERVER_PORT,
    
    DBServerType: process.env.DB_SERVERTYPE,
    DBAddr: process.env.DB_ADDRESS,
    DBPort: process.env.DB_PORT,
    DBUser: process.env.DB_USER,
    DBPassword: process.env.DB_PASSWORD,
    DBName: process.env.DB_NAME
}

module.exports = config;
