PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT,
  company TEXT
);

CREATE TABLE IF NOT EXISTS feedback_items (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_label TEXT NOT NULL,
  title TEXT NOT NULL,
  snippet TEXT NOT NULL,
  body TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_handle TEXT,
  company TEXT,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  sentiment TEXT NOT NULL,
  product_area TEXT,
  source_metadata TEXT NOT NULL,
  author_id TEXT,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT
);

CREATE TABLE IF NOT EXISTS feedback_tags (
  feedback_id TEXT NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (feedback_id, tag_id),
  FOREIGN KEY (feedback_id) REFERENCES feedback_items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

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

CREATE INDEX IF NOT EXISTS idx_feedback_source_type ON feedback_items(source_type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback_items(status);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON feedback_items(priority);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback_items(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback_items(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_author_id ON feedback_items(author_id);
CREATE INDEX IF NOT EXISTS idx_attachments_feedback_id ON attachments(feedback_id);
