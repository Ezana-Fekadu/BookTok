-- BookTok core schema (PostgreSQL)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name VARCHAR(40) NOT NULL,
  email        CITEXT UNIQUE NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url   TEXT,
  is_creator   BOOLEAN NOT NULL DEFAULT FALSE,
  roles        TEXT[] NOT NULL DEFAULT ARRAY['user'],
  preferences  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE books (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  isbn         VARCHAR(32),
  title        TEXT NOT NULL,
  author       TEXT NOT NULL,
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  retailer_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trailers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id      UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  creator_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  audio_url    TEXT NOT NULL,
  duration_ms  INTEGER NOT NULL,
  transcript   TEXT,
  tags         TEXT[] NOT NULL DEFAULT '{}',
  status       VARCHAR(16) NOT NULL DEFAULT 'published', -- draft|published|removed
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trailers_book ON trailers(book_id);
CREATE INDEX idx_trailers_creator ON trailers(creator_id);
CREATE INDEX idx_trailers_tags_gin ON trailers USING GIN (tags);

CREATE TABLE follows (
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id)
);

CREATE TABLE engagements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  trailer_id  UUID NOT NULL REFERENCES trailers(id) ON DELETE CASCADE,
  event_type  VARCHAR(32) NOT NULL, -- listen_start|listen_complete|save|like|click
  properties  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(16) NOT NULL,
  entity_id   UUID NOT NULL,
  reason      VARCHAR(32) NOT NULL,
  details     TEXT,
  status      VARCHAR(16) NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
