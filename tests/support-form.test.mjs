import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {handleSupport, validate} from '../support-api/src/worker.js';

const payload={app:'sentences',topic:'bug',email:'customer@example.com',name:'Example',device:'iPhone',message:'The sentence screen closes when I tap a word.',website:'','cf-turnstile-response':'valid-token'};
function request(data=payload,extras={}) { return new Request('https://support.letsbuildappshq.com/submit',{method:'POST',headers:{Origin:'https://letsbuildappshq.com','Content-Type':'application/json',Accept:'application/json','CF-Connecting-IP':'192.0.2.10',...extras.headers},body:JSON.stringify(data)}); }
function setup() {
 const sent=[];const calls=[];
 const env={TURNSTILE_SECRET:'server-only-test-secret',SUPPORT_TO:'private-inbox@example.net',SUPPORT_FROM:'website@example.net',ATTEMPTS:{limit:async()=>({success:true})},DELIVERIES:{limit:async()=>({success:true})},SUPPORT_EMAIL:{send:async message=>{sent.push(message);return {messageId:'test-message'};}}};
 const fetcher=async(url,options)=>{calls.push({url,options});return Response.json({success:true,hostname:'letsbuildappshq.com',action:'support'});};
 return {env,sent,calls,fetcher};
}
test('verified requests use only the server destination and the customer Reply-To',async()=>{
 const t=setup();const r=await handleSupport(request({...payload,to:'attacker@example.net',subject:'arbitrary header'}),t.env,t.fetcher);const result=await r.json();
 assert.equal(r.status,200);assert.equal(result.ok,true);assert.match(result.reference,/^HQ-[A-F0-9]{16}$/);
 assert.equal(t.sent.length,1);assert.equal(t.sent[0].to,'private-inbox@example.net');assert.equal(t.sent[0].replyTo,payload.email);assert.match(t.sent[0].subject,/Let’s Build Sentences/);
 assert.equal(t.calls.length,1);assert.equal(t.calls[0].options.body.get('secret'),'server-only-test-secret');
 assert.doesNotMatch(JSON.stringify(result),/private-inbox|server-only|customer@example/);
 assert.equal(r.headers.get('access-control-allow-origin'),'https://letsbuildappshq.com');
});
test('missing, forged, wrong-site and wrong-action challenge tokens cannot send email',async()=>{
 for(const result of [{success:false},{success:true,hostname:'attacker.example',action:'support'},{success:true,hostname:'letsbuildappshq.com',action:'login'}]) {
  const t=setup();const r=await handleSupport(request(),t.env,async()=>Response.json(result));assert.equal(r.status,403);assert.equal(t.sent.length,0);
 }
 const t=setup();const r=await handleSupport(request({...payload,'cf-turnstile-response':''}),t.env,t.fetcher);assert.equal(r.status,400);assert.equal(t.sent.length,0);
});
test('honeypot, field validation and email header injection are rejected before delivery',async()=>{
 for(const update of [{website:'https://spam.example'},{email:'a@example.com\r\nBcc: another@example.com'},{message:'short'},{message:'x'.repeat(6001)},{app:'__proto__'},{topic:'unknown'},{email:[]},{name:'a\u0000b'}]) {
  const t=setup();const r=await handleSupport(request({...payload,...update}),t.env,t.fetcher);assert.equal(r.status,400);assert.equal(t.sent.length,0);assert.equal(t.calls.length,0);
 }
 assert.equal(validate({...payload,name:'Zoë 李',message:'Useful details about the issue.\nLine two.'}).name,'Zoë 李');
});
test('unapproved origins and rate-limited clients cannot deliver',async()=>{
 const t=setup();let r=await handleSupport(request(payload,{headers:{Origin:'https://evil.example'}}),t.env,t.fetcher);assert.equal(r.status,403);assert.equal(r.headers.get('access-control-allow-origin'),null);
 t.env.ATTEMPTS.limit=async()=>({success:false});r=await handleSupport(request(),t.env,t.fetcher);assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'60');assert.equal(t.calls.length,0);assert.equal(t.sent.length,0);
 t.env.ATTEMPTS.limit=async()=>({success:true});t.env.DELIVERIES.limit=async()=>({success:false});r=await handleSupport(request(),t.env,t.fetcher);assert.equal(r.status,429);assert.equal(t.sent.length,0);
});
test('a send or verification failure never produces a success receipt or exposes provider details',async()=>{
 const t=setup();t.env.SUPPORT_EMAIL.send=async()=>{throw new Error('private-inbox@example.net provider diagnostic');};
 const r=await handleSupport(request(),t.env,t.fetcher);assert.equal(r.status,503);const result=await r.json();assert.equal(result.ok,false);assert.equal(result.reference,undefined);assert.doesNotMatch(JSON.stringify(result),/private-inbox|diagnostic/);
 const r2=await handleSupport(request(),setup().env,async()=>{throw new Error('Network unavailable');});assert.equal(r2.status,503);
});
test('body limits and content types are enforced independently of browser validation',async()=>{
 const t=setup();let r=await handleSupport(request({...payload,message:'x'.repeat(25000)}),t.env,t.fetcher);assert.equal(r.status,413);assert.equal(t.sent.length,0);
 const req=new Request('https://support.letsbuildappshq.com/submit',{method:'POST',headers:{Origin:'https://letsbuildappshq.com',Accept:'application/json','CF-Connecting-IP':'192.0.2.10','Content-Type':'text/plain'},body:'test'});
 r=await handleSupport(req,t.env,t.fetcher);assert.equal(r.status,415);
});
test('native form submissions get a readable response and preflight allows only the form method',async()=>{
 const t=setup();const req=new Request('https://support.letsbuildappshq.com/submit',{method:'POST',headers:{Origin:'https://letsbuildappshq.com','CF-Connecting-IP':'192.0.2.10','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(payload)});
 const r=await handleSupport(req,t.env,t.fetcher);assert.equal(r.status,200);assert.match(await r.text(),/Your request is on its way/);
 const preflight=await handleSupport(new Request(req.url,{method:'OPTIONS',headers:{Origin:'https://letsbuildappshq.com'}}),t.env,t.fetcher);assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-methods'),'POST, OPTIONS');
});
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);}
test('the published website and generated homepage do not expose personal contact details',()=>{
 for(const file of walk('public').filter(f=>/\.(html|js|json|css|txt|xml)$/.test(f))){
  assert.doesNotMatch(readFileSync(file,'utf8'),/brian[\s\u00a0]+leary|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|mailto:/i,`${file}: no scrapable destination`);
 }
 const support=readFileSync('public/support/index.html','utf8');
 assert.match(support,/<form[^>]*action="https:\/\/support\.letsbuildappshq\.com\/submit"[^>]*method="post"/);
 assert.match(support,/id="support-success"[^>]*hidden/);
 assert.match(readFileSync('public/privacy/index.html','utf8'),/id="support-requests"/);
 const homeSource=readFileSync('scripts/build-nightfall-home.mjs','utf8');assert.doesNotMatch(homeSource,/supportEmail|mailto:/);
});
