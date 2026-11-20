"""Safe offline SQLite smoke tests; no network or customer data."""
import sqlite3
from pathlib import Path
schema = Path(__file__).resolve().parents[1] / 'migrations' / '0001_foundation.sql'
db = sqlite3.connect(':memory:')
db.execute('PRAGMA foreign_keys=ON')
db.executescript(schema.read_text())
def expect_integrity_error(sql, params):
    try:
        db.execute(sql, params)
    except sqlite3.IntegrityError:
        return
    raise AssertionError('Unexpectedly accepted invalid SQL: '+sql)
for tenant in ['t1','t2']:
    db.execute('INSERT INTO tenants(id,name) VALUES (?,?)',(tenant,tenant))
db.execute("INSERT INTO users(id,external_subject) VALUES ('u1','sub1')")
db.execute("INSERT INTO memberships(tenant_id,user_id,role) VALUES ('t1','u1','OWNER')")
db.execute("INSERT INTO service_catalogue(id,title,implementation_phase,tier) VALUES ('BP-01','Baseline',2,'A')")
expect_integrity_error("UPDATE service_catalogue SET publicly_available=1 WHERE id='BP-01'",())
db.execute("INSERT INTO engagements(id,tenant_id,service_id,title) VALUES ('e1','t1','BP-01','Demo')")
expect_integrity_error("UPDATE engagements SET status='ACTIVE' WHERE id='e1'",())
db.execute("UPDATE engagements SET authorization_reference='signed-demo',authorized_at='2026-11-20',status='AUTHORIZED' WHERE id='e1'")
expect_integrity_error("INSERT INTO assets(id,tenant_id,engagement_id,asset_kind,label,scope_status) VALUES ('a1','t2','e1','DOMAIN','example.test','IN_SCOPE')",())
db.execute("INSERT INTO assets(id,tenant_id,engagement_id,asset_kind,label,scope_status) VALUES ('a1','t1','e1','DOMAIN','example.test','IN_SCOPE')")
expect_integrity_error("INSERT INTO findings(id,tenant_id,engagement_id,asset_id,title,severity) VALUES ('f1','t2','e1','a1','Cross-tenant','HIGH')",())
db.execute("INSERT INTO findings(id,tenant_id,engagement_id,asset_id,title,severity) VALUES ('f1','t1','e1','a1','Sample','HIGH')")
expect_integrity_error("UPDATE findings SET status='CLOSED' WHERE id='f1'",())
db.execute("UPDATE findings SET verification='RETESTED',status='CLOSED' WHERE id='f1'")
expect_integrity_error("INSERT INTO actions(id,tenant_id,finding_id,title) VALUES ('x1','t2','f1','Cross-tenant')",())
assert db.execute("PRAGMA foreign_keys").fetchone()[0] == 1
assert db.execute("SELECT COUNT(*) FROM findings WHERE tenant_id='t1'").fetchone()[0] == 1
print("PASS: schema loads; tenant relationship constraints, authorization, retest closure, publication gate")
print("NOTE: application-level authentication, authorization and audit append-only still require implementation and separate integration tests")
