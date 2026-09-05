(() => {
  'use strict';
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let manualPause = false;
  const motion = document.querySelector('.hq-motion');
  function updateMotion() {
    const paused = reduced.matches || manualPause;
    body.dataset.motion = paused ? 'off' : 'on';
    if (motion) {
      motion.hidden = false;
      motion.disabled = reduced.matches;
      motion.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion';
      motion.setAttribute('aria-pressed', String(paused));
    }
  }
  motion?.addEventListener('click', () => { manualPause = !manualPause; updateMotion(); });
  reduced.addEventListener('change', updateMotion);
  updateMotion();

  // Native details keeps the navigation available without JavaScript.
  const menu = document.querySelector('.hq-mobile-nav');
  menu?.addEventListener('click', e => { if (e.target.closest('a')) menu.open = false; });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  document.addEventListener('click', e => { if (menu?.open && !menu.contains(e.target)) menu.open = false; });
  document.querySelectorAll('[data-reveal], .hq-appcard, .hq-about>div, .hq-cominglist article, .downloadList>a, .feature, .screenCard, .feature-card, .memoryScreenCard, .pressApp').forEach(el => {
    if (!reduced.matches && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('hq-enter'); observer.unobserve(entry.target); } });
      }, { threshold: .12 });
      observer.observe(el);
    }
  });
  const stage = document.querySelector('.nf-stage');
  if (stage && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      stage.dataset.paused = String(!entry.isIntersecting || document.hidden);
    }));
    observer.observe(stage);
    document.addEventListener('visibilitychange', () => {
      const r = stage.getBoundingClientRect();
      stage.dataset.paused = String(document.hidden || r.bottom < 0 || r.top > innerHeight);
    });
  }

  const catalogueNode = document.getElementById('site-catalogue');
  if (!catalogueNode) return;
  const apps = JSON.parse(catalogueNode.textContent);
  const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const filters = document.querySelector('.hq-filters');
  filters.hidden = false;
  filters.addEventListener('click', e => {
    const button = e.target.closest('[data-filter]');
    if (!button) return;
    const filter = button.dataset.filter;
    filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('.hq-appcard').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) count++;
    });
    document.getElementById('filter-status').textContent = `${count} apps shown`;
  });

  let selection = 0;
  document.querySelectorAll('[data-feature]').forEach(button => button.addEventListener('click', async () => {
    const app = apps.find(a => a.key === button.dataset.feature);
    if (!app) return;
    const request = ++selection;
    const img = new Image();
    img.alt = `${app.name} app promotional screenshot`;
    img.width = 900; img.height = 1955;
    img.src = app.image;
    try { await img.decode(); } catch { return; }
    if (request !== selection) return;
    const frame = document.getElementById('featured-screen');
    img.className = 'hq-screen-enter';
    frame.replaceChildren(img);
    document.querySelectorAll('[data-feature]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const caption = document.querySelector('.nf-caption');
    caption.href = app.page;
    caption.setAttribute('aria-label', `Explore ${app.name}`);
    caption.innerHTML = `<small>${escape(app.category)}, made yours</small><b>${escape(app.name)} ↗</b>`;
  }));

  const dialog = document.querySelector('.hq-dialog');
  let opener;
  if (!dialog || typeof dialog.showModal !== 'function') return;
  document.querySelectorAll('[data-preview]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const app = apps.find(a => a.key === button.dataset.preview);
      if (!app) return;
      opener = button;
      document.querySelector('.hq-detail').innerHTML = `<div><p class="hq-eyebrow">${escape(app.category)}</p><h2 id="hq-detail-title">${escape(app.name)}</h2><p>${escape(app.description)}</p><ul>${app.points.map(p=>`<li>${escape(p)}</li>`).join('')}</ul><a class="hq-primary" href="${escape(app.url)}">View on the App Store <span aria-hidden="true">↗</span></a><small>${escape(app.price)}<br>Apple shows current local prices and terms.</small><a class="hq-textlink" href="${escape(app.page)}">Full product details <span aria-hidden="true">↗</span></a></div><img class="hq-detailimage" src="${escape(app.image)}" alt="${escape(app.name)} app promotional screenshot" width="900" height="1955">`;
      body.classList.add('hq-modal-open');
      dialog.showModal();
      dialog.querySelector('.hq-close').focus();
    });
  });
  function close() { dialog.close(); }
  dialog.querySelector('.hq-close').addEventListener('click', close);
  dialog.addEventListener('close', () => { body.classList.remove('hq-modal-open'); opener?.focus(); });
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) close();
  });
})();
