import assert from 'node:assert/strict';
import {test} from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {queueRequest,reviewToken,handleReview,processQueue} from '../support-api/src/testflight.js';
import {readiness,usableBuild,addApprovedTester,GROUP_NAME} from '../support-api/src/testflight-apple.js';
import {validate,handleSupport} from '../support-api/src/worker.js';
function setup(){
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync('support-api/migrations/0001_testflight_requests.sql','utf8'));
 const db={prepare(sql){return {bind(...args){return {run:async()=>({meta:{changes:Number(sqlite.prepare(sql).run(...args).changes)}}),first:async()=>sqlite.prepare(sql).get(...args)||null,all:async()=>({results:sqlite.prepare(sql).all(...args)})};},run:async()=>({meta:{changes:Number(sqlite.prepare(sql).run().changes)}}),all:async()=>({results:sqlite.prepare(sql).all()})};}};
 const emails=[];const env={TESTFLIGHT_DB:db,TESTFLIGHT_REVIEW_SECRET:'unit-test-private-secret-long-enough',SUPPORT_FROM:'site@example.test',SUPPORT_TO:'owner@example.test',SUPPORT_EMAIL:{send:async m=>{emails.push(m);return {messageId:'fake'};}}};
 return {env,emails,sqlite,rows:()=>sqlite.prepare('SELECT * FROM testflight_requests').all()};
}
const data={app:'paw-care',email:'tester@example.test',firstName:'Example',lastName:'Tester',device:'iPhone 16, iOS 26',message:'I would like to test routines and walk recording.'};
const body=(row,token,action)=>new Request('https://support.letsbuildappshq.com/testflight/'+(action?'decision':'review'),{method:'POST',headers:{Origin:'https://support.letsbuildappshq.com','Content-Type':'application/json'},body:JSON.stringify({id:row.id,token,...(action?{action}:{})})});
function apple({ready=true,failWrite=false}={}){
 const writes=[];let member=false;
 const build={id:'build-one',attributes:{version:'1',processingState:'VALID',expired:false,uploadedDate:new Date().toISOString(),expirationDate:new Date(Date.now()+86400_000).toISOString()}};
 const group={id:'external-group',attributes:{name:GROUP_NAME,isInternalGroup:false,publicLinkEnabled:false}};
 const tester={id:'tester-one',attributes:{email:data.email,state:'INVITED'}};
 const api=async(path,options={})=>{
  if(options.method==='POST'){writes.push({path,body:options.body});if(failWrite){const e=new Error('uncertain');e.code='apple_write_uncertain';throw e;}member=true;return {data:tester};}
  if(path.includes('/apps/')&&path.includes('/betaGroups'))return {data:[group]};
  if(path==='/v1/betaGroups/external-group/builds')return {data:[build]};
  if(path.startsWith('/v1/betaGroups/external-group/builds?'))return {data:[build]};
  if(path==='/v1/builds/build-one/buildBetaDetail')return {data:{attributes:{externalBuildState:ready?'IN_BETA_TESTING':'READY_FOR_BETA_SUBMISSION'}}};
  if(path.startsWith('/v1/betaTesters?'))return {data:member?[tester]:[]};
  if(path==='/v1/betaTesters/tester-one/betaGroups?limit=200')return {data:member?[group]:[]};
  throw new Error('Unexpected API call '+path);
 };
 return {api,writes,build};
}
test('new and duplicate requests stay private and pending; no Apple access occurs',async()=>{
 const t=setup();const one=await queueRequest(data,t.env),two=await queueRequest(data,t.env);
 assert.equal(one.reference,two.reference);assert.equal(t.rows().length,1);assert.equal(t.rows()[0].state,'pending');assert.equal(t.emails.length,1);
 assert.equal(t.emails[0].to,'owner@example.test');assert.match(t.emails[0].text,/testflight\/review#TF-/);assert.doesNotMatch(JSON.stringify(one),/tester@example|private-secret/);
 const api=apple();await processQueue(t.env,api.api);assert.equal(api.writes.length,0);assert.equal(t.rows()[0].state,'pending');
});
test('opening or fetching a private review cannot approve; invalid tokens and cross-origin decisions fail',async()=>{
 const t=setup();await queueRequest(data,t.env);const row=t.rows()[0],token=await reviewToken(t.env,row);
 assert.equal((await handleReview(new Request('https://support.letsbuildappshq.com/testflight/review'),t.env)).status,200);
 assert.equal((await handleReview(body(row,token),t.env)).status,200);assert.equal(t.rows()[0].state,'pending');
 assert.equal((await handleReview(body(row,'0'.repeat(64),'approve'),t.env)).status,403);
 const wrong=body(row,token,'approve');wrong.headers.set('Origin','https://elsewhere.example');assert.equal((await handleReview(wrong,t.env)).status,403);
 const tooLarge=body(row,token,'approve');const oversized=new Request(tooLarge.url,{method:'POST',headers:tooLarge.headers,body:'x'.repeat(3000)});assert.equal((await handleReview(oversized,t.env)).status,403);
 assert.equal(t.rows()[0].state,'pending');
});
test('approval is explicit, bound to one request and single-use; decline grants nothing',async()=>{
 const t=setup();await queueRequest(data,t.env);await queueRequest({...data,app:'sentences'},t.env);
 const [one,two]=t.rows(),token=await reviewToken(t.env,one);
 assert.equal((await handleReview(body(two,token,'approve'),t.env)).status,403);
 assert.equal((await handleReview(body(one,token,'approve'),t.env)).status,200);
 assert.equal((await handleReview(body(one,token,'decline'),t.env)).status,409);
 assert.equal(t.rows()[0].state,'approved');assert.ok(t.rows()[0].approved_at);assert.equal(t.rows()[1].state,'pending');
 assert.equal((await handleReview(body(two,await reviewToken(t.env,two),'decline'),t.env)).status,200);assert.equal(t.rows()[1].approved_at,null);
});
test('approved requests wait for an externally testable build with zero Apple writes',async()=>{
 const t=setup();await queueRequest(data,t.env);const row=t.rows()[0];await handleReview(body(row,await reviewToken(t.env,row),'approve'),t.env);
 const a=apple({ready:false});await processQueue(t.env,a.api);assert.equal(a.writes.length,0);assert.equal(t.rows()[0].state,'waiting_build');
});
test('approved onboarding is scoped and idempotent under overlapping runs',async()=>{
 const t=setup();await queueRequest(data,t.env);const row=t.rows()[0];await handleReview(body(row,await reviewToken(t.env,row),'approve'),t.env);
 const a=apple();await Promise.all([processQueue(t.env,a.api),processQueue(t.env,a.api)]);await processQueue(t.env,a.api);
 assert.equal(a.writes.length,1);assert.equal(t.rows()[0].state,'invited');
 assert.deepEqual(a.writes[0].body.data.relationships,{betaGroups:{data:[{type:'betaGroups',id:'external-group'}]}});
 assert.equal(a.writes[0].body.data.attributes.email,data.email);assert.equal(t.rows()[0].group_id,'external-group');
 assert.equal(t.emails.filter(m=>m.subject.includes('access added')).length,1);
});
test('uncertain Apple writes stop for attention and are never automatically repeated',async()=>{
 const t=setup();await queueRequest(data,t.env);const row=t.rows()[0];await handleReview(body(row,await reviewToken(t.env,row),'approve'),t.env);
 const a=apple({failWrite:true});await processQueue(t.env,a.api);await processQueue(t.env,a.api);assert.equal(a.writes.length,1);assert.equal(t.rows()[0].state,'needs_attention');assert.equal(t.emails.filter(m=>m.subject.includes('needs attention')).length,1);
});
test('internal, public-link, ambiguous, expired and unapproved builds are never used',async()=>{
 const a=apple();assert.equal(usableBuild(a.build,{attributes:{externalBuildState:'READY_FOR_BETA_SUBMISSION'}}),false);
 assert.equal(usableBuild({...a.build,attributes:{...a.build.attributes,expired:true}},{attributes:{externalBuildState:'IN_BETA_TESTING'}}),false);
 for(const groups of [[{id:'g',attributes:{name:GROUP_NAME,isInternalGroup:true}}],[{id:'g',attributes:{name:GROUP_NAME,isInternalGroup:false,publicLinkEnabled:true}}]]){
  const r=await readiness(async()=>({data:groups}),'paw-care');assert.equal(r.ready,false);
 }
 await assert.rejects(addApprovedTester(a.api,{state:'pending'}, {ready:true,groupId:'g',buildId:'b'},async()=>{}),/approval_required/);assert.equal(a.writes.length,0);
});
test('expired decisions and retained records cannot grant access',async()=>{
 const t=setup();await queueRequest(data,t.env);const row=t.rows()[0];t.sqlite.prepare('UPDATE testflight_requests SET created_at=?').run(Date.now()-15*86400_000);
 assert.equal((await handleReview(body(row,await reviewToken(t.env,row),'approve'),t.env)).status,409);
 await processQueue(t.env,apple().api);assert.equal(t.rows()[0].state,'expired');
 t.sqlite.prepare('UPDATE testflight_requests SET expires_at=0').run();await processQueue(t.env,apple().api);assert.equal(t.rows().length,0);
});
test('TestFlight validation requires app, name, device, consent and a real security token',async()=>{
 const payload={...data,topic:'testflight',consent:'yes','cf-turnstile-response':'token'};assert.equal(validate(payload).firstName,'Example');
 for(const update of [{app:'general'},{consent:''},{firstName:''},{device:''}])assert.throws(()=>validate({...payload,...update}));
 const t=setup();const req=new Request('https://support.letsbuildappshq.com/submit',{method:'POST',headers:{Origin:'https://letsbuildappshq.com','Content-Type':'application/json',Accept:'application/json','CF-Connecting-IP':'192.0.2.5'},body:JSON.stringify(payload)});
 const env={...t.env,TURNSTILE_SECRET:'dummy',ATTEMPTS:{limit:async()=>({success:true})},DELIVERIES:{limit:async()=>({success:true})}};
 const response=await handleSupport(req,env,async()=>Response.json({success:false}));assert.equal(response.status,403);assert.equal(t.rows().length,0);assert.equal(t.emails.length,0);
});
