const request = require('supertest');
const server = require('../app');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

describe('GET /api/v1/users/:userId/channels', () => {
    it('should return 200 and json object with all channels belong to the user', async () => {
        const expectedResponse = {
            id: '9667fd9d-051d-415e-b968-7a91cd6fa755',
            name: 'General',
            type: 'public'
        }

        const userId = 1;
        const endpoint = `/api/v1/users/${userId}/channels`
        const res = await request(server)
            .get(endpoint)
            .expect(200);
        
        expect(res.body[0]).toEqual(expectedResponse);
    });
});
