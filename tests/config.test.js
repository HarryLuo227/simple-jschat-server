const config = require('../configs/config');

const localConfig = {
    RunMode: 'debug',
    ServerAddr: 'localhost',
    ServerPort: '8080',

    DBServerType: 'postgres',
    DBAddr: 'localhost',
    DBPort: '5432',
    DBUser: 'postgres',
    DBPassword: '123456',
    DBName: 'jschat',

    JwtExpiresIn: '300000',
    JwtIssuer: 'jschat-server',
    JwtSecret: 'jschat-app-secret-key'
}

const containertestConfig = {
    RunMode: 'release',
    ServerAddr: '0.0.0.0',
    ServerPort: '8000',

    DBServerType: 'postgres',
    DBAddr: 'jschat-app-postgredb',
    DBPort: '5432',
    DBUser: 'postgres',
    DBPassword: '123456',
    DBName: 'jschat',

    JwtExpiresIn: '300000',
    JwtIssuer: 'jschat-server',
    JwtSecret: 'jschat-app-secret-key'  
}

describe('Application default setting', () => {
    describe('Environment Variables', () => {
        it('should read in correct environment variables', async () => {
            const expectedConfig = containertestConfig;

            expect(config).toEqual(expectedConfig);
        });
    });
});
