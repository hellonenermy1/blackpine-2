// Read-only authenticated landing view; the static corporate site is unchanged.
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderPortalLanding(memberships=[]) {
 if(!Array.isArray(memberships)||memberships.length>100) throw TypeError('Invalid membership list');
 const rows=memberships.map(m=>{
   if(typeof m.tenant_id!=='string'||typeof m.role!=='string') throw TypeError('Invalid membership');
   return '<tr><td>'+esc(m.tenant_id)+'</td><td>'+esc(m.role)+'</td><td>Active</td></tr>';
 }).join('');
 return '<!doctype html><html lang="en"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta name="robots" content="noindex,nofollow"><title>Blackpine — Private Client Portal</title>'+
 '<style>body{font:16px/1.6 system-ui;background:#101719;color:#eaf3f0;margin:0}main{max-width:880px;margin:4rem auto;padding:0 1.5rem}p{color:#c6d6d0}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #50615c;padding:.8rem;text-align:left}th{color:#a7c5bb}.note{border:1px solid #50615c;padding:1rem;border-radius:8px;margin:2rem 0}</style></head>'+
 '<body><main><p>BLACKPINE / CLIENT SYSTEMS</p><h1>Private portal</h1>'+
 '<p>This is a restricted Phase 1 foundation preview. Operational security assessments and evidence uploads are not enabled.</p>'+
 '<h2>Authorized organizations</h2><table><thead><tr><th>Organization ID</th><th>Role</th><th>Membership</th></tr></thead><tbody>'+
 rows+'</tbody></table><div class="note"><strong>Security boundary</strong><p>No customer files, passwords or incident evidence should be submitted here. Every future action requires an authorized, scoped engagement.</p></div>'+
 '</main></body></html>';
}
