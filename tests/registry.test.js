const request = require('supertest');
const server = require('../app');
const db = require('../db/index');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

const succeed201Payload = {
    fullname: 'unit-tester',
    account: 'unit-tester@example.com',
    password: 'unittest123',
    birth: '2000-01-01'
}
const fail400Payload = {
    fullname: 'unit-tester',
    account: 'unit tester@example.com',
    password: 'unittest123',
    birth: '2000-01-01'
}
const fail500Payload = {
    fullname: 'tester',
    account: 'tester@example.com',
    password: 'unittest123',
    birth: '2000-01-01'
}
const postRequestPayload = {
    Succeed201: succeed201Payload,
    Fail400: fail400Payload,
    Fail500: fail500Payload
}

describe('GET /registry', () => {
    it('should return 200 success and render user registry page', async () => {
        await request(server)
            .get('/registry')
            .expect(200);
    });
});

describe('POST /registry', () => {
    // Success 201
    it('should return 201 success and return user object', async () => {
        const res = await request(server)
            .post('/registry')
            .type('application/x-www-form-urlencoded')
            .send(postRequestPayload.Succeed201)
            .expect(201);

        expect(res.body.fullname).toEqual(postRequestPayload.Succeed201.fullname);
        expect(res.body.account).toEqual(postRequestPayload.Succeed201.account);
        expect(res.body.password).toEqual(postRequestPayload.Succeed201.password);
        expect(res.body.birth).toEqual('1999-12-31T16:00:00.000Z');

        await removeRegistryTestData();
    });

    // Failure 400
    it('should return 400 success and return json object', async () => {
        const expectedResponse = {
            ErrorMsg: 'Account is not a valid email'
        }
        const res = await request(server)
            .post('/registry')
            .type('application/x-www-form-urlencoded')
            .send(postRequestPayload.Fail400)
            .expect(400);

        expect(res.body).toEqual(expectedResponse);
    });

    // Failure 500
    it('should return 500 success and return json object', async () => {
        const res = await request(server)
            .post('/registry')
            .type('application/x-www-form-urlencoded')
            .send(postRequestPayload.Fail500)
            .expect(500);
    });
});

async function removeRegistryTestData() {
    try {
        const sql = 'DELETE FROM users WHERE account = $1';
        const values = [
            postRequestPayload.Succeed201.account
        ]
        await db.exec(sql, values);
    } catch (err) {
        console.error(err);
    }
}
