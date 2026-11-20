// Private Worker-only authentication boundary. No trust in caller-provided identity headers.
// Uses Cloudflare Access JWT signature + claims validation against configured issuer/JWKS.
const utf8 = new TextEncoder();
const decoder = new TextDecoder();
const bad = (message) => { throw new AuthError(message); };
export class AuthError extends Error {
  constructor(message='Unauthorized') { super(message); this.status=401; this.name='AuthError'; }
}
export class ForbiddenError extends Error {
  constructor(message='Forbidden') { super(message); this.status=403; this.name='ForbiddenError'; }
}
export class ConfigurationError extends Error {
  constructor() { super('Authentication is not configured'); this.status=503; this.name='ConfigurationError'; }
}
function parseB64Url(value) {
  if (typeof value!=='string' || !/^[A-Za-z0-9_-]+$/.test(value)) bad('Invalid token');
  const padded=value.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-value.length%4)%4);
  return Uint8Array.from(atob(padded), c=>c.charCodeAt(0));
}
function decodeJson(value) {
  try {return JSON.parse(decoder.decode(parseB64Url(value)));}
  catch {bad('Invalid token');}
}
const hasAud=(aud, expected)=>Array.isArray(aud)?aud.includes(expected):aud===expected;
const matchesId=x=>typeof x==='string' && x.length>0 && x.length<=256;
export async function verifyAccessJwt(token, config, fetcher=fetch, now=Math.floor(Date.now()/1000)) {
  if (!matchesId(config?.AUTH_ISSUER) || !matchesId(config?.AUTH_AUDIENCE) ||
      typeof config?.AUTH_JWKS_URL!=='string' || !config.AUTH_JWKS_URL.startsWith('https://')) throw new ConfigurationError();
  if (typeof token!=='string' || token.length>12000) bad('Missing or invalid token');
  const parts=token.split('.');
  if(parts.length!==3) bad('Invalid token');
  const header=decodeJson(parts[0]), payload=decodeJson(parts[1]);
  if(!header || header.alg!=='RS256' || !matchesId(header.kid) || header.typ && header.typ!=='JWT') bad('Unsupported token');
  if(!payload || payload.iss!==config.AUTH_ISSUER || !hasAud(payload.aud,config.AUTH_AUDIENCE) ||
     !matchesId(payload.sub) || !Number.isSafeInteger(payload.exp) || payload.exp<=now ||
     (payload.nbf!==undefined && (!Number.isSafeInteger(payload.nbf) || payload.nbf>now+30)) ||
     (payload.iat!==undefined && (!Number.isSafeInteger(payload.iat) || payload.iat>now+30))) bad('Token claims rejected');
  let jwks;
  try {
    const response=await fetcher(config.AUTH_JWKS_URL,{headers:{accept:'application/json'},signal:AbortSignal.timeout(5000)});
    if(!response.ok) bad('Key service unavailable');
    const raw=await response.text();
    if(raw.length>64000) bad('Invalid key set');
    jwks=JSON.parse(raw);
  } catch {bad('Key verification unavailable');}
  const jwk=jwks?.keys?.find(k=>k.kid===header.kid && k.kty==='RSA' &&
     (k.use===undefined || k.use==='sig') && (k.alg===undefined || k.alg==='RS256'));
  if(!jwk) bad('Unknown signing key');
  let valid=false;
  try {
    const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
    valid=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,parseB64Url(parts[2]),utf8.encode(parts[0]+'.'+parts[1]));
  } catch {bad('Invalid signature');}
  if(!valid) bad('Invalid signature');
  return {subject:payload.sub};
}
export async function verifyMembership(db, subject, tenantId, minimumRoles) {
  if (!matchesId(subject) || !matchesId(tenantId)) throw new ForbiddenError();
  const member=await db.prepare(
    "SELECT m.role FROM memberships m JOIN users u ON u.id=m.user_id JOIN tenants t ON t.id=m.tenant_id WHERE u.external_subject=? AND m.tenant_id=? AND m.status='ACTIVE' AND t.status='ACTIVE'"
  ).bind(subject,tenantId).first();
  if(!member || !minimumRoles.includes(member.role)) throw new ForbiddenError();
  return member;
}
export function requireMutationOrigin(request, expectedOrigin) {
  if(typeof expectedOrigin!=='string' || !/^https:\/\/[^/]+$/.test(expectedOrigin)) throw new ConfigurationError();
  if(request.headers.get('Origin')!==expectedOrigin) throw new ForbiddenError('Invalid request origin');
}
export function securityHeaders() {
  return {'Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'",
    'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
    'Cache-Control':'no-store','X-Frame-Options':'DENY',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
}
