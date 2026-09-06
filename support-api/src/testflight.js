import apps from './testflight-apps.json' with {type:'json'};
import {appleToken,appleClient,readiness,addApprovedTester} from './testflight-apple.js';
import {reviewPage} from './testflight-review.js';
const DAY=86400_000,REVIEW_DAYS=14,RETENTION_DAYS=90;
const now=()=>Date.now();
const json=(body,status=200)=>Response.json(body,{status,headers:{'cache-control':'no-store','referrer-policy':'no-referrer','x-content-type-options':'nosniff','x-robots-tag':'noindex, nofollow'}});
const hash=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(b=>b.toString(16).padStart(2,'0')).join('');
export async function reviewToken(env,row){
  if(!env.TESTFLIGHT_REVIEW_SECRET)throw new Error('Review service unavailable');
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.TESTFLIGHT_REVIEW_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signed=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`review:${row.id}:${row.review_expires_at}`));
  return [...new Uint8Array(signed)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function validToken(env,row,token){
  if(!row || row.review_expires_at<now() || !/^[a-f0-9]{64}$/.test(token||''))return false;
  const expected=await reviewToken(env,row);let difference=0;for(let i=0;i<64;i++)difference|=expected.charCodeAt(i)^token.charCodeAt(i);return difference===0;
}
const event=(db,id,type)=>db.prepare('INSERT INTO testflight_events(request_id,event,created_at) VALUES(?,?,?)').bind(id,type,now()).run();
export async function queueRequest(data,env){
  if(!env.TESTFLIGHT_DB || !env.TESTFLIGHT_REVIEW_SECRET)throw new Error('TestFlight requests are unavailable');
  const db=env.TESTFLIGHT_DB,time=now(),id='TF-'+crypto.randomUUID().replaceAll('-','').toUpperCase();
  const emailHash=await hash(data.email.toLowerCase());
  const insert=await db.prepare(`INSERT INTO testflight_requests(id,app_key,email,email_hash,first_name,last_name,device,message,consent_version,created_at,updated_at,review_expires_at,expires_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(app_key,email_hash) DO NOTHING`).bind(id,data.app,data.email,emailHash,data.firstName,data.lastName,data.device,data.message,'2026-09-06',time,time,time+RETENTION_DAYS*DAY,time+RETENTION_DAYS*DAY).run();
  const row=await db.prepare('SELECT * FROM testflight_requests WHERE app_key=? AND email_hash=?').bind(data.app,emailHash).first();
  if(insert.meta.changes){await event(db,id,'requested');try{await notifyOwner(env,row);}catch{console.error(JSON.stringify({event:'testflight_review_notification_pending',reference:id}));}}
  return {ok:true,reference:row.id,message:'Your request is saved for review. If approved, Apple will invite you when an external test build is available.'};
}
async function notifyOwner(env,row){
  const time=now(),db=env.TESTFLIGHT_DB;
  const claimed=await db.prepare('UPDATE testflight_requests SET notification_lease=? WHERE id=? AND notification_sent_at IS NULL AND (notification_lease IS NULL OR notification_lease<?)').bind(time+5*60_000,row.id,time).run();
  if(!claimed.meta.changes)return;
  try{
    const token=await reviewToken(env,row);
    const link=`https://support.letsbuildappshq.com/testflight/review#${row.id}.${token}`;
    await env.SUPPORT_EMAIL.send({from:{email:env.SUPPORT_FROM,name:'Let’s Build Apps HQ tester requests'},to:env.SUPPORT_TO,replyTo:row.email,subject:`[${row.id}] TestFlight request — ${apps[row.app_key].name}`,text:[`TestFlight access request for ${apps[row.app_key].name}`,`Name: ${row.first_name} ${row.last_name}`.trim(),`Email: ${row.email}`,`Device: ${row.device}`,'',row.message,'','Review this request and choose Approve or Decline:',link,'','Choose within 14 days. The private status link remains valid for up to 90 days. Opening it does not approve access. Do not forward it. Approval authorizes an invitation for this app only, once an Apple-approved external build is available.'].join('\n')});
    await db.prepare('UPDATE testflight_requests SET notification_sent_at=?,notification_lease=NULL WHERE id=?').bind(time,row.id).run();
  }catch(error){await db.prepare('UPDATE testflight_requests SET notification_lease=? WHERE id=?').bind(time+60*60_000,row.id).run();throw error;}
}
function statusText(row){
  return {pending:'Waiting for your decision',approved:'Approved — queued for onboarding',waiting_build:'Approved — waiting for an Apple-approved external build',processing:'Onboarding in progress',invited:'Added to the external TestFlight group',declined:'Declined — no invitation sent',needs_attention:'Approved — onboarding needs attention',expired:'Request expired'}[row.state]||'Request unavailable';
}
async function authenticate(request,env){
  if(request.headers.get('origin')!=='https://support.letsbuildappshq.com')return null;
  if(!request.headers.get('content-type')?.startsWith('application/json'))return null;
  if(Number(request.headers.get('content-length'))>2000)return null;
  const reader=request.body?.getReader();if(!reader)return null;
  const chunks=[];let size=0;
  try{while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>2000){await reader.cancel();return null;}chunks.push(part.value);}}finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  const body=new TextDecoder().decode(bytes);
  let data;try{data=JSON.parse(body);}catch{return null;}
  if(!/^TF-[A-F0-9]{32}$/.test(data.id||''))return null;
  const row=await env.TESTFLIGHT_DB.prepare('SELECT * FROM testflight_requests WHERE id=?').bind(data.id).first();
  return await validToken(env,row,data.token)?{row,data}:null;
}
export async function handleReview(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/testflight/review' && request.method==='GET')return reviewPage();
  if(!['/testflight/review','/testflight/decision'].includes(url.pathname))return new Response('Not found',{status:404});
  if(request.method!=='POST')return new Response('Method not allowed',{status:405});
  try{
    const auth=await authenticate(request,env);if(!auth)return json({ok:false,message:'This private review link is invalid or expired.'},403);
    const {row,data}=auth,db=env.TESTFLIGHT_DB;
    if(url.pathname==='/testflight/decision'){
      if(!['approve','decline'].includes(data.action))return json({ok:false,message:'Choose Approve or Decline.'},400);
      const time=now(),state=data.action==='approve'?'approved':'declined';
      const changed=await db.prepare("UPDATE testflight_requests SET state=?,approved_at=?,updated_at=?,next_attempt_at=0 WHERE id=? AND state='pending' AND created_at>=?").bind(state,data.action==='approve'?time:null,time,row.id,time-REVIEW_DAYS*DAY).run();
      if(!changed.meta.changes)return json({ok:false,message:'This request already has a decision. Reload its status.'},409);
      await event(db,row.id,data.action==='approve'?'owner_approved':'owner_declined');row.state=state;
    }
    const availability=await db.prepare('SELECT ready,last_code,checked_at FROM testflight_apps WHERE app_key=?').bind(row.app_key).first();
    return json({ok:true,request:{id:row.id,app:apps[row.app_key].name,firstName:row.first_name,lastName:row.last_name,email:row.email,device:row.device,message:row.message,state:row.state,status:statusText(row),createdAt:row.created_at},availability:{ready:Boolean(availability?.ready),message:availability?.ready?'An external test build is available.':'An Apple-approved external test build is not available yet. Approval will place this request in the waiting queue.'}});
  }catch{return json({ok:false,message:'The review service is temporarily unavailable. Please try again.'},503);}
}
export async function processQueue(env,providedApi){
  const db=env.TESTFLIGHT_DB;if(!db)return;
  const time=now();
  // Never retry an uncertain Apple mutation automatically: it might already have invited someone.
  await db.prepare("UPDATE testflight_requests SET state='needs_attention',last_code='interrupted_onboarding',lease_until=NULL WHERE state='processing' AND lease_until<?").bind(time).run();
  await db.prepare("UPDATE testflight_requests SET state='expired',updated_at=? WHERE state='pending' AND created_at<?").bind(time,time-REVIEW_DAYS*DAY).run();
  await db.prepare('DELETE FROM testflight_events WHERE request_id IN (SELECT id FROM testflight_requests WHERE expires_at<?)').bind(time).run();
  await db.prepare('DELETE FROM testflight_requests WHERE expires_at<?').bind(time).run();
  const notices=await db.prepare("SELECT * FROM testflight_requests WHERE state='pending' AND notification_sent_at IS NULL AND (notification_lease IS NULL OR notification_lease<?) LIMIT 5").bind(time).all();
  for(const row of notices.results){try{await notifyOwner(env,row);}catch{console.error(JSON.stringify({event:'testflight_review_notification_pending',reference:row.id}));}}
  await notifyOutcomes(env);
  const rows=(await db.prepare("SELECT * FROM testflight_requests WHERE state IN ('approved','waiting_build') AND approved_at IS NOT NULL AND next_attempt_at<=? ORDER BY created_at LIMIT 5").bind(time).all()).results;
  if(!rows.length)return;
  let api;try{api=providedApi||appleClient(await appleToken(env));}catch{console.error(JSON.stringify({event:'testflight_apple_configuration_required'}));return;}
  const readinessCache=new Map();
  for(const row of rows){
    const claim=await db.prepare("UPDATE testflight_requests SET state='processing',lease_until=?,attempts=attempts+1,updated_at=? WHERE id=? AND state IN ('approved','waiting_build') AND approved_at IS NOT NULL").bind(time+10*60_000,time,row.id).run();
    if(!claim.meta.changes)continue;
    try{
      let ready=readinessCache.get(row.app_key);if(!ready){ready=await readiness(api,row.app_key);readinessCache.set(row.app_key,ready);}
      await db.prepare('INSERT INTO testflight_apps(app_key,apple_id,group_id,build_id,ready,last_code,checked_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(app_key) DO UPDATE SET group_id=excluded.group_id,build_id=excluded.build_id,ready=excluded.ready,last_code=excluded.last_code,checked_at=excluded.checked_at').bind(row.app_key,apps[row.app_key].appleId,ready.groupId||null,ready.buildId||null,ready.ready?1:0,ready.code,time).run();
      if(!ready.ready){await db.prepare("UPDATE testflight_requests SET state='waiting_build',last_code=?,next_attempt_at=?,lease_until=NULL,updated_at=? WHERE id=?").bind(ready.code,time+60*60_000,time,row.id).run();continue;}
      const result=await addApprovedTester(api,{...row,state:'processing'},ready,async testerId=>{await db.prepare('UPDATE testflight_requests SET tester_id=?,group_id=?,build_id=? WHERE id=? AND approved_at IS NOT NULL').bind(testerId,ready.groupId,ready.buildId,row.id).run();});
      await db.prepare("UPDATE testflight_requests SET state='invited',tester_id=?,group_id=?,build_id=?,invited_at=?,updated_at=?,lease_until=NULL,last_code=NULL WHERE id=?").bind(result.testerId,result.groupId,result.buildId,time,time,row.id).run();
      await event(db,row.id,'external_group_assigned');
    }catch(error){
      const safeCode=/^[a-z_0-9]+$/.test(error.code||'')?error.code:'onboarding_failed';
      const retryable=['apple_unavailable','apple_rate_limit'].includes(safeCode);
      await db.prepare('UPDATE testflight_requests SET state=?,last_code=?,next_attempt_at=?,lease_until=NULL,updated_at=? WHERE id=?').bind(retryable?'waiting_build':'needs_attention',safeCode,time+60*60_000,time,row.id).run();
      await event(db,row.id,retryable?'retry_scheduled':'onboarding_needs_attention');
      console.error(JSON.stringify({event:'testflight_onboarding_waiting',reference:row.id,code:safeCode}));
    }
  }
  await notifyOutcomes(env);
}

async function notifyOutcomes(env){
  const time=now(),db=env.TESTFLIGHT_DB;
  const rows=(await db.prepare("SELECT * FROM testflight_requests WHERE state IN ('invited','needs_attention') AND (outcome_notified_state IS NULL OR outcome_notified_state!=state) AND (outcome_lease IS NULL OR outcome_lease<?) LIMIT 5").bind(time).all()).results;
  for(const row of rows){
    const claim=await db.prepare('UPDATE testflight_requests SET outcome_lease=? WHERE id=? AND (outcome_lease IS NULL OR outcome_lease<?)').bind(time+60*60_000,row.id,time).run();if(!claim.meta.changes)continue;
    try{
      const link=`https://support.letsbuildappshq.com/testflight/review#${row.id}.${await reviewToken(env,row)}`;
      await env.SUPPORT_EMAIL.send({from:{email:env.SUPPORT_FROM,name:'Let’s Build Apps HQ tester requests'},to:env.SUPPORT_TO,subject:`[${row.id}] ${row.state==='invited'?'TestFlight access added':'TestFlight onboarding needs attention'}`,text:[apps[row.app_key].name,`Request: ${row.id}`,`Tester: ${row.first_name} ${row.last_name}`,`Invitation email: ${row.email}`,statusText(row),row.state==='needs_attention'?`Reason: ${row.last_code}. No automatic resend will be attempted.`:'Apple now has this tester in the approved external group. This confirms access assignment, not email receipt or installation.','',`Private status: ${link}`].join('\n')});
      await db.prepare('UPDATE testflight_requests SET outcome_notified_state=?,outcome_lease=NULL WHERE id=?').bind(row.state,row.id).run();
    }catch{console.error(JSON.stringify({event:'testflight_outcome_notification_pending',reference:row.id}));}
  }
}
