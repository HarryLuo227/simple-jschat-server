const request = require('supertest');
const server = require('../app');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

const succeed201payload = {
    content: 'This is a test message sent from user {tester} !!!',
    userId: 1,
    channelId: '9667fd9d-051d-415e-b968-7a91cd6fa755'
}

const postRequestPayload = {
    Succeed201: succeed201payload
}

describe('POST /api/v1/chat', () => {
    it('should 201 success and return json object', async () => {
        const endpoint = '/api/v1/chat';
        const res = await request(server)
            .post(endpoint)
            .send(postRequestPayload.Succeed201)
            .expect(201);

        expect(res.body.content).toEqual(postRequestPayload.Succeed201.content);
        expect(res.body.from_user).toEqual(postRequestPayload.Succeed201.userId);
        expect(res.body.belongs_to).toEqual(postRequestPayload.Succeed201.channelId);
    });
});
