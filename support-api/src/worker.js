const ORIGINS = new Set([
  'https://letsbuildappshq.com',
  'https://www.letsbuildappshq.com',
  'https://lets-build-sentences.safcbee.chatgpt.site',
]);
const HOSTNAMES = new Set([...ORIGINS].map(origin => new URL(origin).hostname));
export const APPS = {
  general: 'Website / general question',
  sentences: 'Let’s Build Sentences',
  'my-world': 'Let’s Build My World',
  countdowns: 'Let’s Build Countdowns',
  'better-pictures': 'Let’s Build Better Pictures',
  'family-memories': 'Let’s Build Family Memories',
  'better-coffee': 'Let’s Build Better Coffee',
  'family-trips': 'Let’s Build Family Trips',
  'travel-plans': 'Let’s Build Travel Plans',
  'paw-care': 'Paw Care',
  weddings: 'Let’s Build Weddings',
};
export const TOPICS = {
  help: 'App help', bug: 'Something is not working', purchase: 'Purchase or restore',
  feedback: 'Feedback / feature idea', privacy: 'Privacy / data request', press: 'Press enquiry',
};
const MAX_BYTES = 24_000;
const EMAIL = /^[A-Za-z0-9.!#$%&'*+\/=\?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}$/;
class FormError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
function escape(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new FormError('Please shorten your message and try again.',413);
  const reader = request.body?.getReader();
  if (!reader) throw new FormError('Please complete the form.');
  const chunks = []; let length = 0;
  try {
    while (true) {
      const {done,value} = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) { await reader.cancel(); throw new FormError('Please shorten your message and try again.',413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset=0;
  for (const chunk of chunks) { bytes.set(chunk,offset); offset+=chunk.byteLength; }
  const text = new TextDecoder().decode(bytes);
  const type = request.headers.get('content-type')?.split(';')[0];
  try {
    if (type === 'application/json') {
      const data = JSON.parse(text);
      if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error();
      return data;
    }
    if (type === 'application/x-www-form-urlencoded') {
      const data = new URLSearchParams(text);
      if ([...data.keys()].some(key=>data.getAll(key).length!==1)) throw new Error();
      return Object.fromEntries(data);
    }
  } catch { throw new FormError('We could not read this request. Please try again.'); }
  throw new FormError('Please use the support form to send your request.',415);
}
export function validate(data) {
  const text = (key,max,required=false) => {
    const value = data[key] ?? '';
    if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw new FormError('Please check the form fields and try again.');
    if (required && !value.trim()) throw new FormError('Please complete all required fields.');
    return value.trim();
  };
  if (text('website',250)) throw new FormError('We could not accept this request.');
  const app=text('app',40,true), topic=text('topic',30,true), email=text('email',254,true);
  if (!Object.hasOwn(APPS,app) || !Object.hasOwn(TOPICS,topic)) throw new FormError('Please choose an app and a topic.');
  if (!EMAIL.test(email) || email.includes('..') || /[\r\n]/.test(email)) throw new FormError('Please enter a valid reply email address.');
  const message=text('message',6000,true);
  if (message.length<20) throw new FormError('Please add a little more detail (at least 20 characters).');
  return {app,topic,email,message,name:text('name',80),device:text('device',180),token:text('cf-turnstile-response',2048,true)};
}
async function verifyToken(token, ip, secret, fetcher) {
  const body = new URLSearchParams({secret,response:token,remoteip:ip});
  const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method:'POST',body,signal:AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new FormError('The security check is unavailable. Please try again shortly.',503);
  const result = await response.json();
  if (result.success!==true || result.action!=='support' || !HOSTNAMES.has(result.hostname)) {
    throw new FormError('Please complete the security check again, then resend.',403);
  }
}
function respond(request, status, body) {
  const origin=request.headers.get('origin');
  const headers={
    'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer',
    'content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
    'vary':'Origin',
  };
  if (ORIGINS.has(origin)) headers['access-control-allow-origin']=origin;
  if (status===429) headers['retry-after']='60';
  if (request.headers.get('accept')?.includes('application/json')) {
    return Response.json(body,{status,headers});
  }
  headers['content-type']='text/html; charset=utf-8';
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Support — Let’s Build Apps HQ</title><style>body{font:18px/1.7 system-ui;background:#080c10;color:#f4f7f3;margin:0;padding:12vh 6vw}main{max-width:620px;margin:auto}h1{font-size:clamp(32px,6vw,52px);line-height:1.15}a{color:#d6ff79}p{color:#a6b1b8}</style><main><p>LET’S BUILD APPS HQ</p><h1>${body.ok?'Your request is on its way.':'Your request needs another try.'}</h1><p>${escape(body.message)}</p>${body.reference?`<p>Reference: <strong>${escape(body.reference)}</strong></p>`:''}<a href="https://letsbuildappshq.com/support/">Back to support</a></main></html>`,{status,headers});
}
/** Dependencies can be supplied by unit tests; no request or environment can bypass verification. */
export async function handleSupport(request, env, fetcher=fetch) {
  const url=new URL(request.url);
  if (url.pathname==='/health' && request.method==='GET') {
    const ready=Boolean(env.TURNSTILE_SECRET && env.SUPPORT_TO && env.SUPPORT_FROM && env.SUPPORT_EMAIL && env.ATTEMPTS && env.DELIVERIES);
    return Response.json({ready},{status:ready?200:503,headers:{'cache-control':'no-store'}});
  }
  if (request.method==='GET' && url.pathname==='/') return Response.redirect('https://letsbuildappshq.com/support/',302);
  if (url.pathname!=='/submit') return new Response('Not found',{status:404});
  const origin=request.headers.get('origin');
  if (!ORIGINS.has(origin)) return respond(request,403,{ok:false,message:'Please send your request from the support page.'});
  if (request.method==='OPTIONS') return new Response(null,{status:204,headers:{'access-control-allow-origin':origin,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'Content-Type, Accept','access-control-max-age':'600','vary':'Origin'}});
  if (request.method!=='POST') return respond(request,405,{ok:false,message:'Please use the support form.'});
  try {
    if (!env.TURNSTILE_SECRET || !env.SUPPORT_TO || !env.SUPPORT_FROM) throw new FormError('Support is temporarily unavailable. Please try again shortly.',503);
    const ip=request.headers.get('CF-Connecting-IP');
    if (!ip) throw new FormError('Please use the support page to send your request.',403);
    // Only an ephemeral hash enters rate-limit counters, never the message or reply address.
    const hashed=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('lbhq-support:'+ip));
    const key=[...new Uint8Array(hashed)].map(n=>n.toString(16).padStart(2,'0')).join('');
    if (!(await env.ATTEMPTS.limit({key})).success) throw new FormError('Too many attempts. Please wait a minute before trying again.',429);
    const data=validate(await readBody(request));
    await verifyToken(data.token,ip,env.TURNSTILE_SECRET,fetcher);
    if (!(await env.DELIVERIES.limit({key})).success) throw new FormError('You have sent several requests. Please wait a minute before sending another.',429);
    const reference='HQ-'+crypto.randomUUID().replaceAll('-','').slice(0,16).toUpperCase();
    await env.SUPPORT_EMAIL.send({
      from:{email:env.SUPPORT_FROM,name:'Let’s Build Apps HQ support form'},
      to:env.SUPPORT_TO,replyTo:data.email,
      subject:`[${reference}] ${APPS[data.app]} — ${TOPICS[data.topic]}`,
      text:[`Support request ${reference}`,`App: ${APPS[data.app]}`,`Topic: ${TOPICS[data.topic]}`,`Name: ${data.name||'Not supplied'}`,`Reply email: ${data.email}`,`Device / version: ${data.device||'Not supplied'}`,'',data.message,'','Submitted through the Let’s Build Apps HQ support form. Reply directly to this email to respond.'].join('\n'),
    });
    console.log(JSON.stringify({event:'support_sent',reference}));
    return respond(request,200,{ok:true,reference,message:'Thanks for getting in touch. We’ll reply to the email address you entered.'});
  } catch (error) {
    if (error instanceof FormError) return respond(request,error.status,{ok:false,message:error.message});
    // Do not log message content, addresses, tokens, or provider error strings.
    console.error(JSON.stringify({event:'support_delivery_failed'}));
    return respond(request,503,{ok:false,message:'We could not confirm delivery. Your message is still in the form; please try again shortly.'});
  }
}
export default {fetch(request,env) { return handleSupport(request,env); }};
