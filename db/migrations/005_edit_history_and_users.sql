-- Migration 005: Edit History, Trust Tiers & Audit Logs

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  display_name VARCHAR(100),
  trust_tier VARCHAR(30) DEFAULT 'new', -- 'new', 'trusted', 'verified_org', 'official', 'moderator'
  accepted_edit_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS edit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_table VARCHAR(50) NOT NULL,
  target_id UUID,
  editor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  diff JSONB NOT NULL,
  source VARCHAR(100),
  trust_tier VARCHAR(30),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  confidence_score NUMERIC(3,2) DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_edit_history_status ON edit_history(status);
CREATE INDEX IF NOT EXISTS idx_edit_history_editor ON edit_history(editor_id);

CREATE TABLE IF NOT EXISTS pipeline_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(100) NOT NULL,
  records_processed INT DEFAULT 0,
  records_inserted INT DEFAULT 0,
  records_updated INT DEFAULT 0,
  records_failed INT DEFAULT 0,
  status VARCHAR(30) NOT NULL, -- 'running', 'completed', 'failed'
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
