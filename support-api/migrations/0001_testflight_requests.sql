CREATE TABLE IF NOT EXISTS testflight_requests (
 id TEXT PRIMARY KEY,
 app_key TEXT NOT NULL,
 email TEXT NOT NULL,
 email_hash TEXT NOT NULL,
 first_name TEXT NOT NULL,
 last_name TEXT NOT NULL DEFAULT '',
 device TEXT NOT NULL,
 message TEXT NOT NULL,
 consent_version TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','approved','waiting_build','processing','invited','declined','needs_attention','expired')),
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL,
 review_expires_at INTEGER NOT NULL,
 approved_at INTEGER,
 notification_sent_at INTEGER,
 notification_lease INTEGER,
 outcome_notified_state TEXT,
 outcome_lease INTEGER,
 next_attempt_at INTEGER NOT NULL DEFAULT 0,
 lease_until INTEGER,
 attempts INTEGER NOT NULL DEFAULT 0,
 tester_id TEXT,
 group_id TEXT,
 build_id TEXT,
 last_code TEXT,
 invited_at INTEGER,
 expires_at INTEGER NOT NULL,
 UNIQUE(app_key,email_hash)
);
CREATE INDEX IF NOT EXISTS testflight_work ON testflight_requests(state,next_attempt_at);
CREATE TABLE IF NOT EXISTS testflight_apps (
 app_key TEXT PRIMARY KEY,
 apple_id TEXT NOT NULL,
 group_id TEXT,
 build_id TEXT,
 ready INTEGER NOT NULL DEFAULT 0,
 last_code TEXT NOT NULL DEFAULT 'external_setup_required',
 checked_at INTEGER
);
CREATE TABLE IF NOT EXISTS testflight_events (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 request_id TEXT NOT NULL,
 event TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
