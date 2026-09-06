(() => {
  const form=document.getElementById('support-form');
  if (!form) return;
  const status=document.getElementById('form-status');
  const submit=form.querySelector('[type="submit"]');
  const submitLabel=submit.textContent;
  const securityStatus=document.getElementById('security-status');
  const retry=document.getElementById('security-retry');
  let widget, configured=false, busy=false;
  function state(message,error=false) {
    status.textContent=message; status.hidden=!message;
    status.classList.toggle('is-error',error);
    if (error) status.focus();
  }
  const query=new URLSearchParams(location.search);
  for (const key of ['app','topic']) {
    const select=form.elements.namedItem(key), value=query.get(key);
    if (value && select?.options && [...select.options].some(o=>o.value===value)) select.value=value;
  }
  form.hidden=false;
  submit.disabled=true;
  const secure = () => {
    if (widget!==undefined && window.turnstile) { window.turnstile.reset(widget); return; }
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async=true;
    script.onload=render;
    script.onerror=()=>{securityStatus.textContent='The security check could not load. Please retry or reload the page.';retry.hidden=false;};
    document.head.append(script);
  };
  let config;
  async function start() {
    try {
      const response=await fetch(form.dataset.config,{signal:AbortSignal.timeout(10_000)});
      if (!response.ok) throw new Error();
      config=await response.json();
      if (config.endpoint!==form.action || !config.sitekey) throw new Error();
      configured=true; secure();
    } catch {
      securityStatus.textContent='The form could not load. Please reload the page and try again.';
      retry.hidden=false;
    }
  }
  function render() {
    widget=window.turnstile.render('#support-security',{
      sitekey:config.sitekey,action:'support',theme:'dark',size:document.getElementById('support-security').clientWidth<300?'compact':'flexible',
      callback:()=>{securityStatus.textContent='Security check complete.';submit.disabled=busy;retry.hidden=true;},
      'expired-callback':()=>{submit.disabled=true;securityStatus.textContent='Please complete the security check again.';},
      'error-callback':()=>{submit.disabled=true;securityStatus.textContent='The security check needs another try.';retry.hidden=false;},
      'timeout-callback':()=>{submit.disabled=true;securityStatus.textContent='The security check timed out. Please retry.';retry.hidden=false;},
    });
  }
  retry.addEventListener('click',()=>{retry.hidden=true;securityStatus.textContent='Loading security check…';configured?secure():start();});
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if (busy || !configured || !form.reportValidity()) return;
    const token=window.turnstile?.getResponse(widget);
    if (!token) { state('Please complete the security check before sending.',true);return; }
    busy=true;submit.disabled=true;submit.textContent='Sending…';form.setAttribute('aria-busy','true');state('Sending your request…');
    const data=Object.fromEntries(new FormData(form));data['cf-turnstile-response']=token;
    try {
      const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(30_000)});
      const result=await response.json();
      if (!response.ok || result.ok!==true) throw new Error(result.message||'We could not confirm delivery. Please try again shortly.');
      const success=document.getElementById('support-success');
      document.getElementById('request-reference').textContent=result.reference;
      form.reset(); form.hidden=true; success.hidden=false; success.focus();
    } catch (error) {
      state(error.name==='TimeoutError' || error.name==='TypeError'?'We could not confirm delivery. Your message is still here; please try again shortly.':error.message,true);
      if (widget!==undefined) window.turnstile.reset(widget);
    } finally {
      busy=false;submit.textContent=submitLabel;form.removeAttribute('aria-busy');
      submit.disabled=!window.turnstile?.getResponse(widget);
    }
  });
  document.getElementById('another-request').addEventListener('click',()=>{
    document.getElementById('support-success').hidden=true;form.hidden=false;state('');submit.disabled=true;
    if (widget!==undefined) window.turnstile.reset(widget);
    form.elements.namedItem('app').focus();
  });
  start();
})();
