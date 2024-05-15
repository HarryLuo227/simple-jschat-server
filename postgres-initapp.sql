-- Create chat database
CREATE DATABASE jschat
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

\connect jschat;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL NOT NULL,
    fullname TEXT NOT NULL,
    account TEXT NOT NULL,
    password TEXT NOT NULL,
    birth DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (account),
    PRIMARY KEY (id)
);

-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
    id UUID DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    UNIQUE(id, name),
    PRIMARY KEY(id)
);
COMMENT ON COLUMN channels.id IS 'Channel ID';
COMMENT ON COLUMN channels.name IS 'Channel name';
COMMENT ON COLUMN channels.type IS 'Channel type, public for group and private for only one user';

-- Create official channel
INSERT INTO channels(name, type) VALUES ('General', 'public');

-- Create user_channels table
CREATE TABLE IF NOT EXISTS user_channels (
    id SERIAL NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    channel_id UUID NOT NULL REFERENCES channels(id),
    UNIQUE(user_id, channel_id),
    PRIMARY KEY(id)
);
COMMENT ON COLUMN user_channels.id IS 'The ID of record of user''s channels';
COMMENT ON COLUMN user_channels.user_id IS 'User ID';
COMMENT ON COLUMN user_channels.channel_id IS 'Channel ID';

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL NOT NULL,
    content TEXT NOT NULL,
    from_user INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    belongs_to UUID REFERENCES channels(id),
    UNIQUE(id),
    PRIMARY KEY(id)
);
COMMENT ON COLUMN messages.id IS 'Message ID';
COMMENT ON COLUMN messages.content IS 'Message content';
COMMENT ON COLUMN messages.from_user IS 'The user ID of the sent message';
COMMENT ON COLUMN messages.created_at IS 'The timestamp of message created';
COMMENT ON COLUMN messages.belongs_to IS 'The channel ID of this message';

-- Create users and their corresponding relationship to official channel
INSERT INTO users(fullname, account, password, birth) VALUES ('tester', 'tester@example.com', '123456', '2000-01-01');
INSERT INTO users(fullname, account, password, birth) VALUES ('alice', 'alice@example.com', 'alice123', '2019-01-01');
INSERT INTO users(fullname, account, password, birth) VALUES ('ben', 'ben@example.com', 'ben123', '2020-01-01');
INSERT INTO users(fullname, account, password, birth) VALUES ('cindy', 'cindy@example.com', 'cindy123', '2021-01-01');
INSERT INTO users(fullname, account, password, birth) VALUES ('daniel', 'daniel@example.com', 'daniel123', '2000-01-01');
INSERT INTO user_channels(user_id, channel_id) VALUES ((SELECT id FROM users WHERE fullname = 'tester'), (SELECT id FROM channels WHERE name = 'General'));
INSERT INTO user_channels(user_id, channel_id) VALUES ((SELECT id FROM users WHERE fullname = 'alice'), (SELECT id FROM channels WHERE name = 'General'));
INSERT INTO user_channels(user_id, channel_id) VALUES ((SELECT id FROM users WHERE fullname = 'ben'), (SELECT id FROM channels WHERE name = 'General'));
INSERT INTO user_channels(user_id, channel_id) VALUES ((SELECT id FROM users WHERE fullname = 'cindy'), (SELECT id FROM channels WHERE name = 'General'));
INSERT INTO user_channels(user_id, channel_id) VALUES ((SELECT id FROM users WHERE fullname = 'daniel'), (SELECT id FROM channels WHERE name = 'General'));
-- Add default message in official channel
INSERT INTO messages(content, from_user, belongs_to) VALUES ('!!! This is official channel for all user !!!', 1, (SELECT id FROM channels WHERE name = 'General'));
INSERT INTO messages(content, from_user, belongs_to) VALUES ('!!! Every user can get the latest official information !!!', 1, (SELECT id FROM channels WHERE name = 'General'));

-- Add new channel for tester user
INSERT INTO channels(name, type) VALUES ('Family', 'public');
INSERT INTO user_channels(user_id, channel_id) VALUES ((SELECT id FROM users WHERE fullname = 'tester'), (SELECT id FROM channels WHERE name = 'Family'));
