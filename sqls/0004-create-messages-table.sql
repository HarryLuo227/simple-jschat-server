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
