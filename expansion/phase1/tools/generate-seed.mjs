// Deterministic staging D1 seed generator. Never turns proposed services public.
import fs from 'node:fs';
const catalogue=JSON.parse(fs.readFileSync(new URL('../service-catalogue.json',import.meta.url),'utf8'));
if(catalogue.services.length!==30 || new Set(catalogue.services.map(x=>x.id)).size!==30) throw Error('Invalid catalogue');
const quote=x=>"'"+String(x).replaceAll("'","''")+"'";
const lines=['-- Generated from internal proposed-only service catalogue. NOT a deployment.', 'BEGIN TRANSACTION;'];
for(const item of catalogue.services){
 if(!/^BP-\d{2}$/.test(item.id) || !['A','B','C'].includes(item.research_gate) ||
 item.readiness!=='PROPOSED' || item.publicly_available!==false) throw Error('Unsafe catalogue item');
 lines.push('INSERT OR IGNORE INTO service_catalogue (id,title,implementation_phase,tier,readiness,publicly_available) VALUES ('+
 [quote(item.id),quote(item.name),item.implementation_phase,quote(item.research_gate),"'PROPOSED'",0].join(',')+');');
}
lines.push('COMMIT;');
process.stdout.write(lines.join('\n')+'\n');
