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
