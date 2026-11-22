(() => {
  'use strict';
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let manualPause = false;
  const motion = document.querySelector('.hq-motion');
  function isMotionPaused() { return reduced.matches || manualPause; }
  function updateMotion() {
    const paused = isMotionPaused();
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

  // Native details keeps navigation working without JavaScript.
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
      }, { threshold: 0.12 });
      observer.observe(el);
    }
  });

  // Ambient Optical Bokeh Canvas in the Kinetic Darkroom Hero
  const canvas = document.querySelector('.kd-canvas');
  let heroVisible = true;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let orbs = [];
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!orbs.length) {
        orbs = Array.from({ length: 24 }, (_, i) => ({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          r: 3 + Math.random() * 14,
          vx: (Math.random() - 0.5) * 0.24,
          vy: -0.1 - Math.random() * 0.24,
          hue: i % 3 === 0 ? '232,155,60' : i % 3 === 1 ? '52,211,153' : '255,224,180',
          alpha: 0.08 + Math.random() * 0.2,
        }));
      }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { heroVisible = entries[0]?.isIntersecting ?? true; }).observe(canvas);
    }
    function tick() {
      if (!isMotionPaused() && heroVisible && !document.hidden) {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        for (const o of orbs) {
          o.x += o.vx;
          o.y += o.vy;
          if (o.y < -20) { o.y = rect.height + 20; o.x = Math.random() * rect.width; }
          if (o.x < -20) o.x = rect.width + 20;
          if (o.x > rect.width + 20) o.x = -20;
          const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
          g.addColorStop(0, `rgba(${o.hue},${o.alpha})`);
          g.addColorStop(1, `rgba(${o.hue},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const catalogueNode = document.getElementById('site-catalogue');
  if (!catalogueNode) return;
  const apps = JSON.parse(catalogueNode.textContent);
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

  // Category filters
  const filters = document.querySelector('.hq-filters');
  if (filters) {
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
      const status = document.getElementById('filter-status');
      if (status) status.textContent = `${count} apps shown`;
    });
  }

  // Interactive 6-App 3D Perspective Coverflow Deck
  const stage = document.querySelector('.nf-stage');
  const heroEl = document.querySelector('.nf-hero');
  const caption = document.querySelector('.nf-caption');
  const dockButtons = Array.from(document.querySelectorAll('[data-feature]'));

  if (stage && apps.length) {
    let activeIdx = 0;
    const deck = document.createElement('div');
    deck.className = 'kd-deck';
    const cardEls = apps.map((app, idx) => {
      const fig = document.createElement('figure');
      fig.className = 'kd-card';
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('aria-label', `Feature ${app.name}`);
      const img = document.createElement('img');
      img.src = app.image;
      img.alt = `${app.name} app screenshot`;
      img.decoding = 'async';
      img.loading = idx === 0 ? 'eager' : 'lazy';
      fig.appendChild(img);
      fig.addEventListener('click', () => { activeIdx = idx; renderDeck(); });
      fig.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activeIdx = idx; renderDeck(); } });
      deck.appendChild(fig);
      return fig;
    });

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'kd-deck-nav kd-deck-prev';
    prevBtn.setAttribute('aria-label', 'Previous live app');
    prevBtn.textContent = '←';
    prevBtn.addEventListener('click', () => { activeIdx = (activeIdx + apps.length - 1) % apps.length; renderDeck(); });

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'kd-deck-nav kd-deck-next';
    nextBtn.setAttribute('aria-label', 'Next live app');
    nextBtn.textContent = '→';
    nextBtn.addEventListener('click', () => { activeIdx = (activeIdx + 1) % apps.length; renderDeck(); });

    stage.appendChild(deck);
    stage.appendChild(prevBtn);
    stage.appendChild(nextBtn);
    stage.dataset.deck = 'ready';

    function renderDeck() {
      const app = apps[activeIdx];
      const spread = window.innerWidth < 640 ? 92 : 132;
      if (heroEl && app.glow) heroEl.style.setProperty('--kd-glow', app.glow);
      if (heroEl && app.accent) heroEl.style.setProperty('--hq-accent', app.accent);
      cardEls.forEach((card, idx) => {
        let offset = idx - activeIdx;
        if (offset > Math.floor(apps.length / 2)) offset -= apps.length;
        if (offset < -Math.floor(apps.length / 2)) offset += apps.length;
        const abs = Math.abs(offset);
        const tx = offset * spread;
        const tz = -abs * 120;
        const ry = offset * -26;
        const scale = Math.max(0.68, 1 - abs * 0.12);
        card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
        card.style.opacity = abs === 0 ? '1' : abs === 1 ? '0.8' : abs === 2 ? '0.42' : '0.16';
        card.style.zIndex = String(10 - abs);
        card.style.borderColor = abs === 0 ? (app.accent || '#e89b3c') : 'rgba(255,255,255,0.16)';
        card.style.boxShadow = abs === 0 ? `0 28px 66px ${app.glow || 'rgba(232,155,60,0.34)'}` : '0 14px 30px rgba(0,0,0,0.6)';
      });
      dockButtons.forEach(btn => {
        const match = btn.dataset.feature === app.key;
        btn.setAttribute('aria-pressed', String(match));
      });
      if (caption) {
        caption.href = app.page;
        caption.setAttribute('aria-label', `Explore ${app.name}`);
        caption.innerHTML = `<span><small>${escape(app.category)} · ${escape(app.price)}</small><b>${escape(app.name)} ↗</b></span>`;
      }
    }

    dockButtons.forEach(btn => btn.addEventListener('click', () => {
      const idx = apps.findIndex(a => a.key === btn.dataset.feature);
      if (idx >= 0) { activeIdx = idx; renderDeck(); }
    }));
    window.addEventListener('resize', renderDeck);
    document.addEventListener('keydown', e => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (document.querySelector('.hq-dialog[open]')) return;
      if (e.key === 'ArrowRight') { activeIdx = (activeIdx + 1) % apps.length; renderDeck(); }
      if (e.key === 'ArrowLeft') { activeIdx = (activeIdx + apps.length - 1) % apps.length; renderDeck(); }
    });
    renderDeck();
  }

  // Interactive 9-App Darkroom Light Table
  const ltNode = document.getElementById('light-table-catalogue');
  const ltSection = document.getElementById('light-table');
  const ltDock = document.getElementById('kd-lt-dock');
  const ltPanel = document.getElementById('kd-lt-panel');
  if (ltNode && ltSection && ltDock && ltPanel) {
    const items = JSON.parse(ltNode.textContent);
    let selectedKey = items[0]?.key;
    let detailTab = 'highlights';
    ltSection.hidden = false;

    const tabButtons = items.map(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kd-lt-tab';
      btn.setAttribute('role', 'tab');
      btn.dataset.stage = item.stage;
      btn.style.setProperty('--lt-accent', item.accent);
      btn.innerHTML = `<img src="${escape(item.icon)}" alt="" width="34" height="34" loading="lazy"><span><b>${escape(item.name)}</b><small>${item.stage === 'live' ? 'Live' : 'Upcoming'}</small></span>`;
      btn.addEventListener('click', () => { selectedKey = item.key; renderLightTable(); });
      ltDock.appendChild(btn);
      return { key: item.key, btn };
    });

    function renderLightTable() {
      const item = items.find(i => i.key === selectedKey) || items[0];
      if (!item) return;
      tabButtons.forEach(({ key, btn }) => btn.setAttribute('aria-selected', String(key === item.key)));
      ltPanel.style.setProperty('--lt-accent', item.accent);
      const screensHtml = item.shots.map((src, i) => `
        <figure class="kd-lt-frame${item.iconOnly ? ' is-icon' : ''}">
          <img src="${escape(src)}" alt="${escape(item.fullName)} screen ${i + 1}" loading="lazy" decoding="async">
        </figure>
      `).join('');
      const boxContent = detailTab === 'highlights'
        ? `<ul>${item.points.map(p => `<li>${escape(p)}</li>`).join('')}</ul>`
        : `<p style="margin:0">${escape(item.commercialModel)}</p>`;

      ltPanel.innerHTML = `
        <div class="kd-lt-screens">${screensHtml}</div>
        <div>
          <div class="kd-lt-head">
            <img src="${escape(item.icon)}" alt="${escape(item.fullName)} icon" width="52" height="52" loading="lazy">
            <div>
              <span>${escape(item.stageLabel)} · ${escape(item.category)}</span>
              <h3>${escape(item.fullName)}</h3>
            </div>
          </div>
          <p class="kd-lt-desc">${escape(item.description)}</p>
          <div class="kd-lt-toggle" role="tablist" aria-label="App details view">
            <button type="button" role="tab" data-lt-tab="highlights" aria-selected="${detailTab === 'highlights'}">What it does</button>
            <button type="button" role="tab" data-lt-tab="pricing" aria-selected="${detailTab === 'pricing'}">Pricing &amp; access</button>
          </div>
          <div class="kd-lt-box">${boxContent}</div>
          <div class="kd-lt-actions">
            <a class="hq-primary" href="${escape(item.primaryHref)}">${escape(item.primaryLabel)}</a>
            <a class="hq-textlink" href="${escape(item.pageHref)}">${item.key === 'weddings' ? 'Visit wedding site ↗' : 'Explore details ↗'}</a>
            ${item.stage === 'live' ? `<a class="hq-textlink" href="${escape(item.testflightHref)}">TestFlight beta ↗</a>` : ''}
          </div>
        </div>
      `;
      ltPanel.querySelectorAll('[data-lt-tab]').forEach(btn => {
        btn.addEventListener('click', () => { detailTab = btn.dataset.ltTab; renderLightTable(); });
      });
    }
    renderLightTable();
  }

  // Quick Look Modal
  const dialog = document.querySelector('.hq-dialog');
  let opener;
  if (!dialog || typeof dialog.showModal !== 'function') return;
  document.querySelectorAll('[data-preview]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const app = apps.find(a => a.key === button.dataset.preview);
      if (!app) return;
      opener = button;
      document.querySelector('.hq-detail').innerHTML = `<div><p class="hq-eyebrow">${escape(app.category)}</p><h2 id="hq-detail-title">${escape(app.name)}</h2><p>${escape(app.description)}</p><ul>${app.points.map(p => `<li>${escape(p)}</li>`).join('')}</ul><a class="hq-primary" href="${escape(app.url)}">View on the App Store <span aria-hidden="true">↗</span></a><small>${escape(app.price)}<br>Apple shows current local prices and terms.</small><a class="hq-textlink" href="${escape(app.page)}">Full product details <span aria-hidden="true">↗</span></a></div><img class="hq-detailimage" src="${escape(app.image)}" alt="${escape(app.name)} app promotional screenshot" width="900" height="1955">`;
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
