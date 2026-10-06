-- =======================================================
-- Studyo Database Schema — Cloudflare D1 (100% Free SQL)
-- Free Tier: 5,000,000 reads/day, 100,000 writes/day, 5 GB
-- =======================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Cloud Sync Payload Table (Stores synced study progress)
CREATE TABLE IF NOT EXISTS user_sync (
  user_id TEXT PRIMARY KEY,
  streak INTEGER DEFAULT 1,
  total_minutes INTEGER DEFAULT 0,
  sessions_data TEXT,      -- JSON array of study sessions
  quest_data TEXT,         -- JSON object of daily quest
  settings_data TEXT,      -- JSON object of user preferences & theme
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for lightning fast lookups at the edge
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sync_updated ON user_sync(updated_at);
