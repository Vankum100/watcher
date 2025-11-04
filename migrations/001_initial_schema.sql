-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create watcher_links table if not exists
CREATE TABLE IF NOT EXISTS watcher_links (
                                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    payload_hash BYTEA NOT NULL UNIQUE,
    scope TEXT NOT NULL DEFAULT 'dashboard',
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

-- Create workers table if not exists
CREATE TABLE IF NOT EXISTS workers (
                                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    last_seen_at TIMESTAMPTZ NOT NULL,
    hashrate_mh NUMERIC(18,3) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('online','offline','inactive'))
    );

-- Create indexes if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workers_user_id') THEN
CREATE INDEX idx_workers_user_id ON workers (user_id);
END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_watcher_links_payload_hash') THEN
CREATE INDEX idx_watcher_links_payload_hash ON watcher_links (payload_hash);
END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_watcher_links_expires_revoked') THEN
CREATE INDEX idx_watcher_links_expires_revoked ON watcher_links (expires_at, revoked_at);
END IF;
END $$;
