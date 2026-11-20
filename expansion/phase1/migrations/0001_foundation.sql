-- Blackpine internal portal foundation. Cloudflare D1 / SQLite.
-- DO NOT deploy against production without backup, secrets, RBAC and integration tests.
-- Application routes must authenticate and authorize every tenant-scoped operation.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS tenants (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','SUSPENDED','CLOSED')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, external_subject TEXT NOT NULL UNIQUE, email TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS memberships (
 tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 role TEXT NOT NULL CHECK(role IN ('OWNER','ENGAGEMENT_LEAD','ASSESSOR','REVIEWER','CLIENT_VIEWER')),
 status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','REVOKED')),
 PRIMARY KEY (tenant_id,user_id)
);
CREATE TABLE IF NOT EXISTS service_catalogue (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, implementation_phase INTEGER NOT NULL CHECK(implementation_phase BETWEEN 1 AND 10),
 tier TEXT NOT NULL CHECK(tier IN ('A','B','C')), readiness TEXT NOT NULL DEFAULT 'PROPOSED'
 CHECK(readiness IN ('PROPOSED','DEFINED','IMPLEMENTED','PILOT_VERIFIED','APPROVED')),
 publicly_available INTEGER NOT NULL DEFAULT 0 CHECK(publicly_available IN (0,1)),
 CHECK(publicly_available=0 OR readiness='APPROVED')
);
CREATE TABLE IF NOT EXISTS engagements (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
 service_id TEXT NOT NULL REFERENCES service_catalogue(id) ON DELETE RESTRICT,
 title TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'DRAFT'
 CHECK(status IN ('DRAFT','AUTHORIZATION_PENDING','AUTHORIZED','ACTIVE','QA_REVIEW','CLOSED','CANCELLED')),
 authorization_reference TEXT, authorized_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(id,tenant_id),
 CHECK(status NOT IN ('AUTHORIZED','ACTIVE','QA_REVIEW','CLOSED') OR (authorization_reference IS NOT NULL AND authorized_at IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS assets (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
 engagement_id TEXT NOT NULL, asset_kind TEXT NOT NULL, label TEXT NOT NULL,
 scope_status TEXT NOT NULL CHECK(scope_status IN ('IN_SCOPE','OUT_OF_SCOPE','PENDING')),
 FOREIGN KEY(engagement_id,tenant_id) REFERENCES engagements(id,tenant_id), UNIQUE(id,tenant_id)
);
CREATE TABLE IF NOT EXISTS findings (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
 engagement_id TEXT NOT NULL, asset_id TEXT, title TEXT NOT NULL,
 severity TEXT NOT NULL CHECK(severity IN ('CRITICAL','HIGH','MEDIUM','LOW','INFO')),
 verification TEXT NOT NULL DEFAULT 'UNVERIFIED'
 CHECK(verification IN ('UNVERIFIED','VALIDATED','FALSE_POSITIVE','RETESTED')),
 status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN','IN_PROGRESS','RISK_ACCEPTED','CLOSED')),
 reviewer_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(engagement_id,tenant_id) REFERENCES engagements(id,tenant_id),
 FOREIGN KEY(asset_id,tenant_id) REFERENCES assets(id,tenant_id),
 CHECK(status!='CLOSED' OR verification='RETESTED'),
 UNIQUE(id,tenant_id)
);
CREATE TABLE IF NOT EXISTS actions (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, finding_id TEXT NOT NULL,
 title TEXT NOT NULL, owner_user_id TEXT, due_at TEXT,
 status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN','IN_PROGRESS','BLOCKED','DONE')),
 FOREIGN KEY(finding_id,tenant_id) REFERENCES findings(id,tenant_id)
);
CREATE TABLE IF NOT EXISTS approvals (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, engagement_id TEXT NOT NULL,
 decision TEXT NOT NULL CHECK(decision IN ('APPROVED','REJECTED')),
 purpose TEXT NOT NULL, actor_user_id TEXT NOT NULL REFERENCES users(id),
 recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(engagement_id,tenant_id) REFERENCES engagements(id,tenant_id)
);
CREATE TABLE IF NOT EXISTS evidence_metadata (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, finding_id TEXT NOT NULL,
 classification TEXT NOT NULL CHECK(classification IN ('INTERNAL','CONFIDENTIAL','RESTRICTED')),
 description TEXT NOT NULL, restricted_storage_reference TEXT,
 retention_until TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(finding_id,tenant_id) REFERENCES findings(id,tenant_id)
);
CREATE TABLE IF NOT EXISTS partners (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, qualification_status TEXT NOT NULL DEFAULT 'UNVERIFIED'
 CHECK(qualification_status IN ('UNVERIFIED','REVIEW_PENDING','VERIFIED','EXPIRED')),
 licensing_reference TEXT, insurance_reviewed_at TEXT
);
CREATE TABLE IF NOT EXISTS partner_work_orders (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, engagement_id TEXT NOT NULL,
 partner_id TEXT NOT NULL REFERENCES partners(id), statement_of_work_reference TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','APPROVED','IN_PROGRESS','ACCEPTED','REJECTED')),
 FOREIGN KEY(engagement_id,tenant_id) REFERENCES engagements(id,tenant_id)
);
CREATE TABLE IF NOT EXISTS audit_events (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id),
 actor_user_id TEXT, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
 occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, details_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_engagement_tenant ON engagements(tenant_id,status);
CREATE INDEX IF NOT EXISTS idx_assets_tenant_engagement ON assets(tenant_id,engagement_id);
CREATE INDEX IF NOT EXISTS idx_findings_tenant_engagement ON findings(tenant_id,engagement_id,status);
CREATE INDEX IF NOT EXISTS idx_action_tenant_finding ON actions(tenant_id,finding_id);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_time ON audit_events(tenant_id,occurred_at);
-- Application must never expose unrestricted SELECT/UPDATE on these tables to clients.
-- Audit append-only must be enforced by restricted application SQL pathways and runtime permissions,
-- not by this schema alone. This migration is NOT a completed secure portal.
