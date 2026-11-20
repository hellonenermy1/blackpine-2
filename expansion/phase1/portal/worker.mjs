// Isolated private API prototype. Not connected to the public static site.
// Portal deployment requires Cloudflare Access JWT configuration and D1 binding.
// Do not treat schema constraints as a substitute for endpoint authorization.
import {AuthError,ForbiddenError,ConfigurationError,verifyAccessJwt,verifyMembership,requireMutationOrigin,securityHeaders} from './auth.mjs';
import {renderPortalLanding} from './view.mjs';
import {renderEngagementReport} from './report.mjs';
const noCache=securityHeaders();
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...noCache,'Content-Type':'application/json; charset=utf-8'}});
const failure=(code,status)=>json({error:code},status);
const safeId=x=>typeof x==='string' && /^[a-zA-Z0-9_-]{1,80}$/.test(x);
async function parsedBody(request) {
  const type=request.headers.get('content-type')||'';
  if(!/^application\/json(?:\s*;|\s*$)/i.test(type)) return {error:'content_type'};
  const length=Number(request.headers.get('content-length'));
  if(Number.isFinite(length)&&length>8192) return {error:'body_too_large'};
  const text=await request.text();
  if(new TextEncoder().encode(text).length>8192) return {error:'body_too_large'};
  try {const v=JSON.parse(text); return v && typeof v==='object' && !Array.isArray(v)?{value:v}:{error:'bad_json'};}
  catch {return {error:'bad_json'};}
}
function validEngagement(body) {
  if(Object.keys(body).sort().join(',')!=='service_id,title') return false;
  return /^BP-\d{2}$/.test(body.service_id)&&typeof body.title==='string' &&
    body.title.trim().length>=3 && body.title.length<=160;
}
async function handleAuthorized(request, env, subject, url) {
  const match=url.pathname.match(/^\/api\/v1\/tenants\/([A-Za-z0-9_-]{1,80})\/(engagements)(?:\/([A-Za-z0-9_-]{1,80})\/(findings|report))?$/);
  if(url.pathname==='/api/v1/me' && request.method==='GET') {
    const memberships=await env.DB.prepare(
      "SELECT m.tenant_id,m.role FROM memberships m JOIN users u ON u.id=m.user_id JOIN tenants t ON t.id=m.tenant_id WHERE u.external_subject=? AND m.status='ACTIVE' AND t.status='ACTIVE' ORDER BY m.tenant_id LIMIT 100"
    ).bind(subject).all();
    return json({memberships:memberships.results??[]});
  }
  if(!match || url.search) return failure('not_found',404);
  const [,tenantId,,engagementId,subresource]=match;
  const isWrite=request.method==='POST'&&!engagementId;
  const roles=isWrite?['OWNER','ENGAGEMENT_LEAD']:['OWNER','ENGAGEMENT_LEAD','ASSESSOR','REVIEWER','CLIENT_VIEWER'];
  await verifyMembership(env.DB,subject,tenantId,roles);
  if(engagementId && request.method==='GET') {
    const engagement=await env.DB.prepare('SELECT id,title,status,authorization_reference FROM engagements WHERE tenant_id=? AND id=?').bind(tenantId,engagementId).first();
    if(!engagement) return failure('not_found',404);
    const rows=await env.DB.prepare(
      'SELECT id,asset_id,title,severity,verification,status,created_at FROM findings WHERE tenant_id=? AND engagement_id=? ORDER BY created_at DESC LIMIT 100'
    ).bind(tenantId,engagementId).all();
    if(subresource==='report') {
      const tenant=await env.DB.prepare('SELECT name FROM tenants WHERE id=? AND status=\'ACTIVE\'').bind(tenantId).first();
      if(!tenant) return failure('not_found',404);
      const report=renderEngagementReport({tenantName:tenant.name,engagement,findings:rows.results??[],limitations:['Report is a draft. Client-specific authorization and reviewer approval are required before distribution.']});
      return new Response(report,{headers:{...noCache,'Content-Type':'text/html; charset=utf-8','Content-Disposition':'attachment; filename="blackpine-draft-report.html"', 'Content-Security-Policy':"sandbox; default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"}});
    }
    return json({findings:rows.results??[]});
  }
  if(!engagementId && request.method==='GET') {
    const rows=await env.DB.prepare(
      'SELECT id,service_id,title,status,created_at FROM engagements WHERE tenant_id=? ORDER BY created_at DESC LIMIT 100'
    ).bind(tenantId).all();
    return json({engagements:rows.results??[]});
  }
  if(isWrite) {
    requireMutationOrigin(request,env.PORTAL_ORIGIN);
    const payload=await parsedBody(request);
    if(payload.error) return failure(payload.error,400);
    if(!validEngagement(payload.value)) return failure('invalid_fields',400);
    const service=await env.DB.prepare('SELECT id FROM service_catalogue WHERE id=?').bind(payload.value.service_id).first();
    if(!service) return failure('unknown_service',400);
    const user=await env.DB.prepare('SELECT id FROM users WHERE external_subject=?').bind(subject).first();
    if(!user) return failure('forbidden',403);
    const id=crypto.randomUUID(), auditId=crypto.randomUUID();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO engagements(id,tenant_id,service_id,title,status) VALUES (?,?,?,?,?)').bind(id,tenantId,payload.value.service_id,payload.value.title.trim(),'DRAFT'),
      env.DB.prepare('INSERT INTO audit_events(id,tenant_id,actor_user_id,action,entity_type,entity_id) VALUES (?,?,?,?,?,?)').bind(auditId,tenantId,user.id,'engagement.created','engagement',id)
    ]);
    return json({id,status:'DRAFT'},201);
  }
  return failure('method_not_allowed',405);
}
export function createPortalWorker({verifyToken=verifyAccessJwt}={}) {
return {
  async fetch(request,env) {
    try {
      if(!env?.DB) throw new ConfigurationError();
      const url=new URL(request.url);
      if(typeof env.PORTAL_ORIGIN!=='string' || !/^https:\/\/[^/]+$/.test(env.PORTAL_ORIGIN)) throw new ConfigurationError();
      if(url.protocol!=='https:' || url.origin!==env.PORTAL_ORIGIN) return failure('not_found',404);
      if(url.pathname!=='/portal/' && !url.pathname.startsWith('/api/v1/')) return failure('not_found',404);
      if(!['GET','POST'].includes(request.method)) return failure('method_not_allowed',405);
      const token=request.headers.get('Cf-Access-Jwt-Assertion');
      const {subject}=await verifyToken(token,env);
      if(url.pathname==='/portal/' && request.method==='GET') {
        const memberships=await env.DB.prepare("SELECT m.tenant_id,m.role FROM memberships m JOIN users u ON u.id=m.user_id JOIN tenants t ON t.id=m.tenant_id WHERE u.external_subject=? AND m.status='ACTIVE' AND t.status='ACTIVE' ORDER BY m.tenant_id LIMIT 100").bind(subject).all();
        return new Response(renderPortalLanding(memberships.results??[]),{headers:{...noCache,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"}});
      }
      return await handleAuthorized(request,env,subject,url);
    } catch (error) {
      if(error instanceof AuthError) return failure('unauthorized',401);
      if(error instanceof ForbiddenError) return failure('not_found',404);
      if(error instanceof ConfigurationError) return failure('unavailable',503);
      // Deliberately never expose SQL messages, stack traces or customer content.
      return failure('server_error',500);
    }
  }
};
}
export default createPortalWorker();
