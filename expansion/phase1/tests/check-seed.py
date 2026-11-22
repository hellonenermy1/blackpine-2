import json, sqlite3, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'service-catalogue.json').read_text())
assert len(data['services'])==30
sql=subprocess.run(['node',str(root/'tools/generate-seed.mjs')],check=True,capture_output=True,text=True).stdout
con=sqlite3.connect(':memory:'); con.executescript((root/'migrations/0001_foundation.sql').read_text()); con.executescript(sql)
assert con.execute('SELECT COUNT(*) FROM service_catalogue').fetchone()[0]==30
assert con.execute('SELECT COUNT(*) FROM service_catalogue WHERE publicly_available != 0 OR readiness != "PROPOSED"').fetchone()[0]==0
snapshot=sqlite3.connect(':memory:'); con.backup(snapshot)
assert snapshot.execute('SELECT COUNT(*) FROM service_catalogue').fetchone()[0]==30
con.executescript(sql)
assert con.execute('SELECT COUNT(*) FROM service_catalogue').fetchone()[0]==30
assert set(x[0] for x in con.execute('SELECT id FROM service_catalogue'))=={x['id'] for x in data['services']}
print('PASS: seed 30 proposed-only offers, idempotent inserts, in-memory SQLite backup and restore')
print('NOTE: this is NOT a Cloudflare D1 production backup or disaster-recovery qualification')
