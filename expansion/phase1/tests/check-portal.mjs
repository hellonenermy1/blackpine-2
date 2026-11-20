import assert from 'node:assert/strict';
import {generateKeyPairSync,createSign} from 'node:crypto';
import {verifyAccessJwt,verifyMembership,requireMutationOrigin,AuthError,ForbiddenError} from '../portal/auth.mjs';
import {createPortalWorker} from '../portal/worker.mjs';
import {renderPortalLanding} from '../portal/view.mjs';
const pair=generateKeyPairSync('rsa',{modulusLength:2048});
const publicJwk=pair.publicKey.export({format:'jwk'});publicJwk.kid='test-key';publicJwk.alg='RS256';publicJwk.use='sig';
const config={AUTH_ISSUER:'https://access.example.test',AUTH_AUDIENCE:'test-audience',AUTH_JWKS_URL:'https://access.example.test/cdn-cgi/access/certs',PORTAL_ORIGIN:'https://portal.example.test'};
const now=Math.floor(Date.now()/1000);
const encode=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
function token(overrides={}, key=pair.privateKey) {
 const data=encode({alg:'RS256',typ:'JWT',kid:'test-key'})+'.'+encode({iss:config.AUTH_ISSUER,aud:config.AUTH_AUDIENCE,sub:'user-sub',iat:now-10,exp:now+120,...overrides});
 const sign=createSign('RSA-SHA256');sign.update(data);sign.end();
 return data+'.'+sign.sign(key).toString('base64url');
}
const mockFetch=async()=>({ok:true,text:async()=>JSON.stringify({keys:[publicJwk]})});
const good=token();
assert.equal((await verifyAccessJwt(good,config,mockFetch,now)).subject,'user-sub');
for(const badToken of [token({aud:'wrong'}),token({iss:'https://wrong.test'}),token({exp:now-1}),token({nbf:now+200}),good.slice(0,-5)+'AAAA', 'not.a.jwt', '']) {
 await assert.rejects(()=>verifyAccessJwt(badToken,config,mockFetch,now),AuthError);
}
await assert.rejects(()=>verifyAccessJwt(good,{...config,AUTH_JWKS_URL:'http://bad.test'},mockFetch,now));
await assert.rejects(()=>verifyAccessJwt(good,config,async()=>({ok:false}),now),AuthError);
const req=(method,path,headers={},body)=>new Request(config.PORTAL_ORIGIN+path,{method,headers:{'Cf-Access-Jwt-Assertion':good,...headers},body});
assert.throws(()=>requireMutationOrigin(req('POST','/api/v1/me'),config.PORTAL_ORIGIN),ForbiddenError);
requireMutationOrigin(req('POST','/api/v1/me',{Origin:config.PORTAL_ORIGIN}),config.PORTAL_ORIGIN);
class MockDB{
 constructor(){this.records=[];this.catalogue=[{id:'BP-01'}];this.tenants={t1:'ACTIVE',t2:'ACTIVE'};this.membership={tenant_id:'t1',role:'OWNER',status:'ACTIVE'};}
 prepare(sql){return new Statement(this,sql);}
 async batch(statements){for(const s of statements)await s.run();return [];}
}
class Statement{
 constructor(db,sql){this.db=db;this.sql=sql;this.params=[];}
 bind(...params){this.params=params;return this;}
 async first(){
  const s=this.sql,p=this.params;
  if(s.includes('SELECT m.role FROM memberships'))return p[0]==='user-sub'&&p[1]==='t1'?{role:'OWNER'}:null;
  if(s.includes('SELECT id FROM service_catalogue'))return this.db.catalogue.find(x=>x.id===p[0])??null;
  if(s.includes('SELECT id FROM users'))return {id:'u1'};
  if(s.includes('SELECT name FROM tenants'))return p[0]==='t1'?{name:'Tenant T1'}:null;
  if(s.includes('SELECT id FROM engagements'))return this.db.records.find(x=>x.id===p[1]&&x.tenant_id===p[0])??null;
  return null;
 }
 async all(){
  const s=this.sql,p=this.params;
  if(s.includes('SELECT m.tenant_id,m.role'))return {results:[{tenant_id:'t1',role:'OWNER'}]};
  if(s.includes('SELECT id,service_id,title,status'))return {results:this.db.records.filter(x=>x.tenant_id===p[0])};
  return {results:[]};
 }
 async run(){
  if(this.sql.includes('INSERT INTO engagements')){const [id,tenant_id,service_id,title,status]=this.params;this.db.records.push({id,tenant_id,service_id,title,status});}
  return {success:true};
 }
}
const sampleLanding=renderPortalLanding([{tenant_id:'<img src=x>',role:'OWNER'}]);
assert.ok(sampleLanding.includes('&lt;img src=x&gt;'));
assert.ok(!sampleLanding.includes('<img src=x>'));
const worker=createPortalWorker({verifyToken:async supplied=>{if(supplied!==good)throw new AuthError();return {subject:'user-sub'};}});
const db=new MockDB();
assert.equal((await verifyMembership(db,'user-sub','t1',['OWNER'])).role,'OWNER');
await assert.rejects(()=>verifyMembership(db,'user-sub','t2',['OWNER']),ForbiddenError);
const env={...config,DB:db};
async function call(request){return worker.fetch(request,env);}
let res=await call(req('GET','/portal/'));assert.equal(res.status,200);
assert.ok((await res.text()).includes('Authorized organizations'));
res=await call(req('GET','/api/v1/me'));assert.equal(res.status,200);
assert.deepEqual((await res.json()).memberships,[{tenant_id:'t1',role:'OWNER'}]);
res=await call(req('GET','/api/v1/tenants/t2/engagements'));assert.equal(res.status,404);
res=await call(new Request(config.PORTAL_ORIGIN+'/api/v1/me'));assert.equal(res.status,401);
res=await call(req('POST','/api/v1/tenants/t1/engagements',{'Content-Type':'application/json'},JSON.stringify({title:'Test project',service_id:'BP-01'})));assert.equal(res.status,404);
res=await call(req('POST','/api/v1/tenants/t1/engagements',{Origin:config.PORTAL_ORIGIN,'Content-Type':'application/json'},JSON.stringify({title:'Test project',service_id:'BP-01',tenant_id:'t2'})));assert.equal(res.status,400);
res=await call(req('POST','/api/v1/tenants/t1/engagements',{Origin:config.PORTAL_ORIGIN,'Content-Type':'application/json'},JSON.stringify({title:'Test project',service_id:'BP-01'})));
assert.equal(res.status,201);const created=await res.json();assert.equal(created.status,'DRAFT');
res=await call(req('GET','/api/v1/tenants/t1/engagements'));assert.equal(res.status,200);
assert.equal((await res.json()).engagements.length,1);
res=await call(req('GET','/api/v1/tenants/t2/engagements/'+created.id+'/findings'));assert.equal(res.status,404);
res=await call(req('GET','/api/v1/tenants/t1/engagements/'+created.id+'/findings'));assert.equal(res.status,200);
assert.equal(res.headers.get('Cache-Control'),'no-store');
res=await call(req('GET','/api/v1/tenants/t1/engagements/'+created.id+'/report'));
assert.equal(res.status,200);assert.ok(res.headers.get('Content-Disposition').includes('attachment'));
assert.ok((await res.text()).includes('CONFIDENTIAL DRAFT'));
res=await call(req('GET','/api/v1/tenants/t2/engagements/'+created.id+'/report'));assert.equal(res.status,404);
console.log('PASS: JWT signature/issuer/audience/expiry, malicious tokens, membership, origin, tenant isolation, draft-only creation, input rejection, headers');
