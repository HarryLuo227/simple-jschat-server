const request = require('supertest');
const server = require('../app');
const db = require('../db/index');

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
            birth: "2000-01-01T00:00:00.000Z",
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
                expect(res.body.id).toEqual(expectedResponse.id);
                expect(res.body.fullname).toEqual(expectedResponse.fullname);
                expect(res.body.account).toEqual(expectedResponse.account);
                expect(res.body.password).toEqual(expectedResponse.password);
                expect(res.body.birth).toEqual(expectedResponse.birth);
                break;
            default:
                expect(res.body[0].id).toEqual(expectedResponse.id);
                expect(res.body[0].fullname).toEqual(expectedResponse.fullname);
                expect(res.body[0].account).toEqual(expectedResponse.account);
                expect(res.body[0].password).toEqual(expectedResponse.password);
                expect(res.body[0].birth).toEqual(expectedResponse.birth);
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
            birth: "2000-01-01T00:00:00.000Z",
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
        
        expect(res.body.id).toEqual(expectedResponse.id);
        expect(res.body.fullname).toEqual(expectedResponse.fullname);
        expect(res.body.account).toEqual(expectedResponse.account);
        expect(res.body.password).toEqual(expectedResponse.password);
        expect(res.body.birth).toEqual(expectedResponse.birth);
    });
});

describe('GET /api/v1/users/:userId/channels', () => {
    it('should return 200 and json object with all channels belong to the user', async () => {
        const channelResult = await db.exec('SELECT id FROM channels WHERE name = \'General\'');
        const expectedResponse = {
            id: channelResult.rows[0].id,
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
