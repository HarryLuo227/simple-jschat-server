const request = require('supertest');
const server = require('../app');
const db = require('../db/index');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

const succeed201payload = {
    name: 'test',
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

        await removeTestChannel(res.body.channel.id);
    });
});

async function removeTestChannel(channelId) {
    try {
        const removeUserChannelsSql = 'DELETE FROM user_channels WHERE user_id = $1 AND channel_id = $2';
        const removeUserChannelsValues = [
            postRequestPayload.Succeed201.userId,
            channelId
        ]
        await db.exec(removeUserChannelsSql, removeUserChannelsValues);
        const sql = 'DELETE FROM channels WHERE id = $1';
        const values = [
            channelId
        ]
        await db.exec(sql, values);
    } catch (err) {
        console.error(err);
    }
}
