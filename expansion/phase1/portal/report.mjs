// Confidential HTML preview for assessed findings; no raw evidence embedded.
// This pure renderer is not an authorization or approved export endpoint.
const e = value => String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const allowedSeverities=new Set(['CRITICAL','HIGH','MEDIUM','LOW','INFO']);
export function renderEngagementReport({tenantName,engagement,findings=[],limitations=[]}={}) {
 if(typeof tenantName!=='string'||!engagement || typeof engagement.id!=='string' ||
   typeof engagement.title!=='string' || !Array.isArray(findings) || findings.length>1000 ||
   !Array.isArray(limitations)||limitations.length>100) throw TypeError('Invalid report');
 for(const finding of findings){
   if(typeof finding.title!=='string'||!allowedSeverities.has(finding.severity)||
     typeof finding.verification!=='string'||typeof finding.status!=='string') throw TypeError('Invalid finding');
 }
 const items=findings.map(f=>'<tr><td>'+e(f.id)+'</td><td>'+e(f.title)+'</td><td>'+
 e(f.severity)+'</td><td>'+e(f.verification)+'</td><td>'+e(f.status)+'</td></tr>').join('');
 const limits=limitations.map(x=>'<li>'+e(x)+'</li>').join('');
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>Engagement report — '+e(engagement.id)+'</title><meta name="robots" content="noindex,nofollow">'+
 '<style>body{font:16px/1.6 system-ui;max-width:900px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:.5rem;text-align:left}caption{text-align:left}small{color:#555}@media print{body{margin:0}}</style></head><body>'+
 '<header><p><strong>BLACKPINE / CONFIDENTIAL DRAFT</strong></p><h1>'+e(engagement.title)+'</h1>'+
 '<p>Client: '+e(tenantName)+'</p><p>Engagement reference: '+e(engagement.id)+'</p></header>'+
 '<main><h2>Evidence review</h2><p>Findings below are status records. This draft does not constitute certification or proof of independently validated controls.</p>'+
 '<table><thead><tr><th>ID</th><th>Finding</th><th>Severity</th><th>Verification</th><th>Status</th></tr></thead><tbody>'+
 items+'</tbody></table><h2>Scope limitations</h2><ul>'+limits+'</ul>'+
 '<p><small>Do not distribute without a client-specific permission and QA review. Evidence payloads are intentionally excluded.</small></p></main></body></html>';
}
