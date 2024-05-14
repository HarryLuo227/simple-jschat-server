const request = require('supertest');
const server = require('../app');
const { login } = require('../services/login');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

const loginPayload = {
    account: 'tester@example.com',
    password: '123456'
}

describe('GET /api/v1/users', () => {
    it('should return 200 success and json object array, including empty array', async () => {
        const expectedNoDataRespsonse = {}
        const expectedResponse = {
            id: 1,
            fullname: "tester",
            account: "tester@example.com",
            password: "123456",
            birth: "1999-12-31T16:00:00.000Z",
            created_at: "2024-04-08T08:28:59.275Z",
            modified_at: "2024-04-08T08:28:59.275Z"
        }
        
        const loginRes = await request(server)
            .post('/login')
            .type('application/x-www-form-urlencoded')
            .send(loginPayload)
            .expect(200);
        const res = await request(server)
            .get('/api/v1/users')
            .set('Cookie', [`token=${loginRes.body.token}`])
            .expect(200);

        switch(res.body.length) {
            case 0:
                expect(res.body).toEqual(expectedNoDataRespsonse);
                break;
            case 1:
                expect(res.body).toEqual(expectedResponse);
                break;
            default:
                break;
        }
    });
});

describe('GET /api/v1/users/:userId', () => {
    it('should return 200 and json object', async () => {
        const expectedResponse = {
            id: 1,
            fullname: "tester",
            account: "tester@example.com",
            password: "123456",
            birth: "1999-12-31T16:00:00.000Z",
            created_at: "2024-04-08T08:28:59.275Z",
            modified_at: "2024-04-08T08:28:59.275Z"
        }

        const userId = 1;
        const endpoint = `/api/v1/users/${userId}`
        const loginRes = await request(server)
            .post('/login')
            .type('application/x-www-form-urlencoded')
            .send(loginPayload)
            .expect(200);
        const res = await request(server)
            .get(endpoint)
            .set('Cookie', [`token=${loginRes.body.token}`])
            .expect(200);
        
        expect(res.body).toEqual(expectedResponse);
    });
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
        const loginRes = await request(server)
            .post('/login')
            .type('application/x-www-form-urlencoded')
            .send(loginPayload)
            .expect(200);
        const res = await request(server)
            .get(endpoint)
            .set('Cookie', [`token=${loginRes.body.token}`])
            .expect(200);
        
        expect(res.body[0]).toEqual(expectedResponse);
    });
});
