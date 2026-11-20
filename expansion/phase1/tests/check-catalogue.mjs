import fs from 'node:fs';
import assert from 'node:assert/strict';
const data = JSON.parse(fs.readFileSync(new URL('../service-catalogue.json', import.meta.url),'utf8'));
assert.equal(data.schema_version,1);
assert.equal(data.services.length,30);
assert.deepEqual(data.services.map(x=>x.id),Array.from({length:30},(_,i)=>'BP-'+String(i+1).padStart(2,'0')));
assert.equal(new Set(data.services.map(x=>x.name)).size,30);
const permitted={A:0,B:0,C:0};
for(const service of data.services){
 assert.match(service.name,/\S/);
 assert.ok(service.implementation_phase>=2&&service.implementation_phase<=10);
 assert.ok(Object.hasOwn(permitted,service.research_gate));
 permitted[service.research_gate]++;
 assert.equal(service.readiness,'PROPOSED');
 assert.equal(service.publicly_available,false);
 assert.equal(service.approved_by,null);
}
assert.equal(Object.values(permitted).reduce((a,b)=>a+b,0),30);
assert.deepEqual(permitted,{A:17,B:11,C:2});
console.log('PASS: 30 unique, non-public catalogue entries; report per-card gate counts '+JSON.stringify(permitted));
