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
