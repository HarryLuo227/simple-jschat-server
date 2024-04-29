const config = require('../configs/config');
const request = require('supertest');

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
}

describe('Application default setting', () => {
    describe('Environment Variables', () => {
        it('should read in correct environment variables', async () => {
            const expectedConfig = localConfig;

            expect(config).toEqual(expectedConfig);
        });
    });
});
