import apps from './testflight-apps.json' with {type:'json'};
export const GROUP_NAME='Website testers — approved requests';
export class AppleError extends Error {
  constructor(code,status=503){super(code);this.code=code;this.status=status;}
}
const base='https://api.appstoreconnect.apple.com';
const enc=value=>btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value)))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
export async function appleToken(env){
  const pem=env.ASC_PRIVATE_KEY?.replace(/-----[^-]+-----/g,'').replace(/\s/g,'');
  if(!pem || !env.ASC_KEY_ID || !env.ASC_ISSUER_ID)throw new AppleError('apple_not_configured');
  const key=await crypto.subtle.importKey('pkcs8',Uint8Array.from(atob(pem),c=>c.charCodeAt(0)),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
  const now=Math.floor(Date.now()/1000);
  const unsigned=enc({alg:'ES256',kid:env.ASC_KEY_ID,typ:'JWT'})+'.'+enc({iss:env.ASC_ISSUER_ID,iat:now,exp:now+600,aud:'appstoreconnect-v1'});
  const signature=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,new TextEncoder().encode(unsigned));
  return unsigned+'.'+btoa(String.fromCharCode(...new Uint8Array(signature))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
}
export function appleClient(token,fetcher=fetch){
  return async function api(path,{method='GET',body}={}){
    const url=new URL(path,base);
    if(url.origin!==base || !url.pathname.startsWith('/v1/'))throw new AppleError('invalid_apple_route');
    let response;
    try {response=await fetcher(url,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15_000)});}
    catch {throw new AppleError(method==='GET'?'apple_unavailable':'apple_write_uncertain');}
    let result={};try{if(response.status!==204)result=await response.json();}catch{throw new AppleError(method==='GET'?'apple_unavailable':'apple_write_uncertain');}
    if(!response.ok)throw new AppleError(response.status===429?'apple_rate_limit':response.status===401||response.status===403?'apple_access_required':`apple_http_${response.status}`,response.status);
    return result;
  };
}
export async function allPages(api,path,maxPages=10){
  const rows=[];let next=path;
  for(let count=0;next&&count<maxPages;count++){
    const page=await api(next);rows.push(...page.data);next=page.links?.next;
  }
  if(next)throw new AppleError('apple_results_incomplete');
  return rows;
}
export function usableBuild(build,detail,now=Date.now()){
  return build?.attributes?.processingState==='VALID' && build.attributes.expired===false && Date.parse(build.attributes.expirationDate)>now+3600_000 && detail?.attributes?.externalBuildState==='IN_BETA_TESTING';
}
/** Read-only readiness check. Never submits builds for Apple review or enables public links. */
export async function readiness(api,appKey){
  const app=apps[appKey];if(!app)throw new AppleError('unknown_app');
  if(app.retired)return {ready:false,code:'app_retired'};
  const groups=await allPages(api,`/v1/apps/${app.appleId}/betaGroups?limit=200`);
  const matches=groups.filter(g=>g.attributes.name===GROUP_NAME && g.attributes.isInternalGroup===false && !g.attributes.publicLinkEnabled);
  if(matches.length!==1)return {ready:false,code:matches.length?'ambiguous_external_group':'external_setup_required'};
  const group=matches[0];
  const builds=await allPages(api,`/v1/betaGroups/${group.id}/builds?limit=200`);
  const candidates=builds.filter(b=>b.attributes.processingState==='VALID' && !b.attributes.expired && Date.parse(b.attributes.expirationDate)>Date.now()+3600_000).sort((a,b)=>Date.parse(b.attributes.uploadedDate)-Date.parse(a.attributes.uploadedDate));
  for(const build of candidates.slice(0,5)){
    const detail=(await api(`/v1/builds/${build.id}/buildBetaDetail`)).data;
    if(usableBuild(build,detail))return {ready:true,code:'ready',groupId:group.id,buildId:build.id};
  }
  return {ready:false,code:'waiting_external_build',groupId:group.id};
}
/** Called only after a persisted owner approval and a fresh external-build check. */
export async function addApprovedTester(api,row,ready,recordProgress){
  if(apps[row.app_key]?.retired)throw new AppleError('app_retired');
  if(!row.approved_at || !['approved','waiting_build','processing'].includes(row.state))throw new AppleError('approval_required');
  if(!ready?.ready || !ready.groupId || !ready.buildId)throw new AppleError('external_build_required');
  const testers=await allPages(api,`/v1/betaTesters?filter[email]=${encodeURIComponent(row.email)}&limit=200`);
  const exact=testers.filter(t=>t.attributes.email?.toLowerCase()===row.email.toLowerCase());
  if(exact.length>1)throw new AppleError('ambiguous_tester');
  let tester=exact[0];
  if(tester){
    const groups=await allPages(api,`/v1/betaTesters/${tester.id}/betaGroups?limit=200`);
    if(!groups.some(g=>g.id===ready.groupId)){
      await recordProgress(tester.id);
      await api(`/v1/betaTesters/${tester.id}/relationships/betaGroups`,{method:'POST',body:{data:[{type:'betaGroups',id:ready.groupId}]}});
    }
  }else{
    const result=await api('/v1/betaTesters',{method:'POST',body:{data:{type:'betaTesters',attributes:{email:row.email,firstName:row.first_name,...(row.last_name?{lastName:row.last_name}:{})},relationships:{betaGroups:{data:[{type:'betaGroups',id:ready.groupId}]}}}}});
    tester=result.data;
  }
  await recordProgress(tester.id);
  // Group assignment triggers Apple's initial invitation. No automatic resend loop.
  const verifiedGroups=await allPages(api,`/v1/betaTesters/${tester.id}/betaGroups?limit=200`);
  if(!verifiedGroups.some(g=>g.id===ready.groupId))throw new AppleError('membership_unconfirmed');
  return {testerId:tester.id,groupId:ready.groupId,buildId:ready.buildId};
}
