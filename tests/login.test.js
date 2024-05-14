const request = require('supertest');
const server = require('../app');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

const succeed200Payload = {
    account: 'tester@example.com',
    password: '123456'
}
const fail400Payload = {
    account: 'tester@example.com',
    password: ''
}
const fail500Payload = {
    account: 'tester@example.com',
    password: '654321'
}
const postRequestPayload = {
    Succeed200: succeed200Payload,
    Fail400: fail400Payload,
    Fail500: fail500Payload
}

describe('GET /login', () => {
    it('should return 200 success and render user login page', async () => {
        await request(server)
            .get('/login')
            .expect(200);
    });
});

describe('POST /login', () => {
    // Success 200
    it('should return 200 success and the json object with access token', async () => {
        const res = await request(server)
            .post('/login')
            .type('application/x-www-form-urlencoded')
            .send(postRequestPayload.Succeed200)
            .expect(200);

        const jwtTokenInRegex = /^(Bearer\s[a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;
        
        expect(res.body.token).toMatch(jwtTokenInRegex);
    });

    // Failure 400
    it('should return 400 success and the json object', async () => {
        const expectedResponse = {
            ErrorMsg: 'Client error'
        }
        const res = await request(server)
            .post('/login')
            .type('application/x-www-form-urlencoded')
            .send(postRequestPayload.Fail400)
            .expect(400);

        expect(res.body).toEqual(expectedResponse);
    });

    // Failure 500
    it('should return 500 success and the json object', async () => {
        const expectedResponse = {
            ErrorMsg: 'Unexpected error occurred'
        }
        const res = await request(server)
            .post('/login')
            .type('application/x-www-form-urlencoded')
            .send(postRequestPayload.Fail500)
            .expect(500);

        expect(res.body).toEqual(expectedResponse);
    });
});
