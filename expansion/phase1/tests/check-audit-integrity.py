import sqlite3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
con=sqlite3.connect(':memory:')
con.execute('PRAGMA foreign_keys=ON')
for name in ['0001_foundation.sql','0002_audit_integrity.sql']:
    con.executescript((root/'migrations'/name).read_text())
con.execute("INSERT INTO tenants(id,name) VALUES ('t1','Test')")
con.execute("INSERT INTO audit_events(id,tenant_id,action,entity_type,entity_id) VALUES ('a1','t1','created','engagement','e1')")
def rejected(query):
    try:con.execute(query)
    except sqlite3.IntegrityError:return
    raise AssertionError('Audit mutation unexpectedly permitted: '+query)
rejected("UPDATE audit_events SET action='altered' WHERE id='a1'")
rejected("DELETE FROM audit_events WHERE id='a1'")
assert con.execute('SELECT action FROM audit_events WHERE id="a1"').fetchone()[0]=='created'
print('PASS: audit events append-only triggers reject ordinary UPDATE and DELETE')
print('LIMITATION: DB administrators could still alter triggers, backups or underlying storage; independent evidence is still needed')
