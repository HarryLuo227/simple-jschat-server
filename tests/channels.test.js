const request = require('supertest');
const server = require('../app');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

const succeed201payload = {
    name: 'Family',
    type: 'public',
    userId: 1,
}

const postRequestPayload = {
    Succeed201: succeed201payload
}

describe('POST /api/v1/channels', () => {
    it('should return 201 success and the json object', async () => {        
        const res = await request(server)
            .post('/api/v1/channels')
            .send(postRequestPayload.Succeed201)
            .expect(201);

        expect(res.body.channel.name).toEqual(postRequestPayload.Succeed201.name);
        expect(res.body.channel.type).toEqual(postRequestPayload.Succeed201.type);
        expect(res.body.userChannels.user_id).toEqual(postRequestPayload.Succeed201.userId);
        expect(res.body.userChannels.channel_id).toEqual(res.body.channel.id);
    });
});
