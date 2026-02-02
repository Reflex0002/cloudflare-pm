-- Migration: Add attachments table
-- Description: Creates table to store metadata for images uploaded to R2

CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  feedback_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  FOREIGN KEY (feedback_id) REFERENCES feedback_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attachments_feedback_id ON attachments(feedback_id);
