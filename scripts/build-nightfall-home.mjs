import { readFile, writeFile } from 'node:fs/promises';

const catalogue = JSON.parse(await readFile('marketing/apps.json', 'utf8'));
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const presentation = {
  'my-world': { short: 'My World', icon: '◎', colour: '#2ec987', glow: 'rgba(46,201,135,0.34)', group: 'life', image: 'site-v4/my-world-01-world.jpg', secondImage: 'site-v7/my-world-02-rhythm.jpg', line: 'Every journey, part of your story.', price: 'Free core · Optional My World+' },
  'travel-plans': { short: 'Travel Plans', icon: '◇', colour: '#f0956a', glow: 'rgba(240,149,106,0.36)', group: 'life', image: 'duo/travel-plans-standard.jpg', secondImage: 'travel-plans-journal/journal-plan-day-switching.png', line: 'Plan one trip free. Unlock full access once.', price: 'Free to start · £3.99 one-time full unlock' },
  'sentences': { short: 'Sentences', icon: 'Aa', colour: '#f4c95d', glow: 'rgba(244,201,93,0.32)', group: 'create', image: 'site-v4/sentences-1.jpg', secondImage: 'site-v4/sentences-4.jpg', line: 'Their next sentence starts here.', price: 'Free starter · One-time Premium' },
  'better-coffee': { short: 'Better Coffee', icon: '≋', colour: '#dc7b41', glow: 'rgba(220,123,65,0.36)', group: 'life', image: 'site-v5/coffee-home.jpg', secondImage: 'site-v5/coffee-beans.jpg', line: 'Make your next shot a better one.', price: 'Essentials stay free · Optional Better Coffee Pro' },
  'better-pictures': { short: 'Better Pictures', icon: '⊙', colour: '#e89b3c', glow: 'rgba(232,155,60,0.36)', group: 'create', image: 'site-v4/better-pics-01-never-guess.jpg', secondImage: 'site-v4/better-pics-03-camera-plan.jpg', line: 'Walk up to the shot with a plan.', price: 'Free core · One-time Pro' },
  'countdowns': { short: 'Countdowns', icon: '↗', colour: '#f0764a', glow: 'rgba(240,118,74,0.34)', group: 'life', image: 'site-v4/countdowns-next.jpg', secondImage: 'site-v4/countdowns-list.jpg', line: 'Something good to look forward to.', price: 'Free starter · One-time Plus' },
};
const upcomingPresentation = {
  'family-memories': { short: 'Family Memories', colour: '#7dd3fc', iconFile: 'site-v6/icon-family-memories.png', shots: ['site-v6/family-memories-today.jpg', 'site-v6/family-memories-capture.jpg'] },
  'paw-care': { short: 'Paw Care', colour: '#a78bfa', iconFile: 'site-v4/icon-paw-care.png', iconOnly: true, shots: ['site-v4/icon-paw-care.png'] },
  'weddings': { short: 'Weddings', colour: '#f48fb1', iconFile: 'site-v3/icon-weddings.png', shots: ['site-v4/weddings-today.jpg', 'site-v4/weddings-budget.jpg'] },
};

const live = Object.keys(presentation).map(key => ({ ...catalogue.apps.find(a => a.key === key), ...presentation[key] }));
if (live.some(a => a.stage !== 'live' || !a.appStoreUrl)) throw new Error('Every featured app must have a verified live listing.');
const upcoming = catalogue.apps.filter(a => a.stage !== 'live' && a.stage !== 'retired');
const route = a => a.sitePath.startsWith('https:') ? a.sitePath : `.${a.sitePath}`;
const appId = a => a.sitePath.startsWith('https:') ? a.key : a.sitePath.replaceAll('/', '');
const liveIconFile = a => a.key === 'travel-plans'
  ? 'duo/travel-plans-icon.jpg'
  : a.key === 'better-coffee'
    ? 'site-v5/icon-coffee.png'
    : a.key === 'countdowns'
      ? 'site-v3/icon-countdowns.png'
      : 'site-v4/icon-' + ({ 'better-pictures': 'better-pics' }[a.key] || a.key) + '.png';

const nav = `<header class="hq-nav">
  <a class="hq-logo" href="./" aria-label="Let’s Build Apps HQ home"><span class="hq-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>let’s build<small>apps hq</small></span></a>
  <nav class="hq-navlinks" aria-label="Primary navigation"><a href="#light-table">Light Table</a><a href="#products">The apps</a><a href="#iphone-duo">iPhone Duo</a><a href="#philosophy">Our story</a><a href="./support/">Support</a><a class="hq-navcta" href="#products">Six apps live ↗</a></nav>
  <details class="hq-mobile-nav"><summary>Menu <span aria-hidden="true">+</span></summary><nav aria-label="Mobile navigation"><a href="#light-table">Light Table</a><a href="#products">The apps</a><a href="#iphone-duo">iPhone Duo</a><a href="#philosophy">Our story</a><a href="#in-the-works">In the works</a><a href="./testflight/">TestFlight</a><a href="./support/">Support</a><a href="./privacy/">Privacy</a></nav></details>
</header>`;

let hero = await readFile('scripts/templates/nightfall-hero.html', 'utf8');
hero = hero.replace(/<div class="nf-dock"[\s\S]*$/, '');
hero = hero.replace(/data-scroll="[^"]*"/g, '');
hero = hero.replace('<section class="nf-hero hq-enter">', '<section class="nf-hero hq-enter"><canvas class="kd-canvas" aria-hidden="true"></canvas>');
hero = hero.replace('<div class="nf-caption">', '<a class="nf-caption" href="./my-world/" aria-label="Explore My World">').replace('<b>My World ↗</b></div>', '<b>My World ↗</b></a>');
hero = hero.replace('</section>', '<button class="hq-motion" type="button" aria-pressed="false" hidden>Pause motion</button></section>');
hero = hero.replace('class="nf-phone"', 'class="nf-phone" id="featured-screen"');

const duo = await readFile('scripts/templates/nightfall-duo.html', 'utf8');
const dock = `<div class="nf-dock" role="group" aria-label="Choose a featured app">${live.map((a, i) => `<button type="button" data-feature="${a.key}" aria-pressed="${i === 0}" aria-controls="featured-screen"><span class="hq-miniicon" aria-hidden="true">${a.icon}</span>${a.short}</button>`).join('')}</div>`;

const cards = live.map(a => `<article class="hq-appcard" id="${appId(a)}" data-category="${a.group}" style="--hq-card-color:${a.colour}">
  <div class="hq-cardtop"><img class="hq-appicon" src="./assets/${liveIconFile(a)}" alt="${escape(a.name)} app icon" width="60" height="60" loading="lazy"><small>${escape(a.category)}</small></div>
  <p class="hq-availability">Available on App Store</p><h3><a href="${route(a)}">${escape(a.name)}</a></h3><p>${escape(a.line)}</p><p class="hq-price">${escape(a.price)}</p>
  <div class="hq-cardlinks"><a href="${route(a)}">View product page <span aria-hidden="true">↗</span></a><a href="./testflight/?app=${a.key}">Test upcoming versions ↗</a><button type="button" data-preview="${a.key}" aria-label="Preview ${a.short}" hidden>Quick look <span aria-hidden="true">+</span></button></div>
</article>`).join('\n');

const future = upcoming.map(a => `<article id="${appId(a)}"><div><span class="hq-availability">${escape(a.stageLabel)}</span><h3>${escape(a.name)}</h3><p>${escape(a.promise)}</p></div><div class="hq-coming-actions"><a class="hq-textlink" href="./testflight/?app=${a.key}">Request TestFlight access ↗</a><a class="hq-textlink" href="${route(a)}">${a.key === 'weddings' ? 'Visit the wedding site' : 'View product page'} <span aria-hidden="true">↗</span></a></div></article>`).join('');

const data = live.map(a => ({
  key: a.key,
  name: a.short,
  fullName: a.name,
  category: a.category,
  image: `./assets/${a.image}`,
  secondImage: `./assets/${a.secondImage}`,
  icon: `./assets/${liveIconFile(a)}`,
  accent: a.colour,
  glow: a.glow,
  description: a.promise,
  price: a.price,
  commercialModel: a.commercialModel,
  url: a.appStoreUrl,
  page: route(a),
  testflight: `./testflight/?app=${a.key}`,
  points: a.claims.slice(0, 3),
}));

const lightTableData = [
  ...data.map(a => ({
    key: a.key,
    name: a.name,
    fullName: a.fullName,
    stage: 'live',
    stageLabel: 'Live on App Store',
    category: a.category,
    accent: a.accent,
    icon: a.icon,
    shots: [a.image, a.secondImage],
    description: a.description,
    points: a.points,
    commercialModel: a.commercialModel,
    primaryLabel: 'Download on App Store ↗',
    primaryHref: a.url,
    pageHref: a.page,
    testflightHref: a.testflight,
  })),
  ...upcoming.map(a => {
    const meta = upcomingPresentation[a.key] || { short: a.name, colour: '#e89b3c', iconFile: 'brand/lets-build-apps-hq-mark.webp', shots: [] };
    return {
      key: a.key,
      name: meta.short,
      fullName: a.name,
      stage: 'upcoming',
      stageLabel: a.stageLabel,
      category: a.category,
      accent: meta.colour,
      icon: `./assets/${meta.iconFile}`,
      iconOnly: Boolean(meta.iconOnly),
      shots: meta.shots.map(s => `./assets/${s}`),
      description: a.promise,
      points: a.claims.slice(0, 3),
      commercialModel: a.commercialModel,
      primaryLabel: 'Request TestFlight access ↗',
      primaryHref: `./testflight/?app=${a.key}`,
      pageHref: route(a),
      testflightHref: `./testflight/?app=${a.key}`,
    };
  }),
];

const json = JSON.stringify(data).replaceAll('<', '\\u003c');
const ltJson = JSON.stringify(lightTableData).replaceAll('<', '\\u003c');
const webAnalytics = await readFile('scripts/templates/web-analytics.html', 'utf8');

const lightTableSection = `<section class="kd-lighttable" id="light-table" aria-labelledby="light-table-title" hidden>
  <div class="hq-sectionhead"><div><p class="hq-eyebrow"><span class="hq-dot"></span>Interactive Light Table</p><h2 id="light-table-title">Inspect every app side by side.</h2></div><p>Six live apps and three in preparation. Compare real screens, key features and plain-English purchase terms.</p></div>
  <div class="kd-lt-dock" id="kd-lt-dock" role="tablist" aria-label="Select an app to inspect"></div>
  <div class="kd-lt-panel" id="kd-lt-panel" aria-live="polite"></div>
</section>`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Let’s Build Apps HQ — Small Apps. Big Everyday.</title>
  <meta name="description" content="Independent Apple apps for travel memories, trip planning, first sentences, better photographs, everyday moments and better coffee. Find your everyday favourite.">
  <meta name="theme-color" content="#080a0f"><link rel="canonical" href="https://letsbuildappshq.com/">
  <meta property="og:type" content="website"><meta property="og:url" content="https://letsbuildappshq.com/"><meta property="og:title" content="Let’s Build Apps HQ — Small Apps. Big Everyday."><meta property="og:description" content="Independent apps for the places you go, the things you make and the little rituals in between."><meta property="og:image" content="https://letsbuildappshq.com/og-editorial.png">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@letsbuildappshq">
  <link rel="stylesheet" href="./assets/nightfall.css"><link rel="stylesheet" href="./assets/nightfall-pages.css"><script src="./assets/nightfall.js" defer></script>
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: catalogue.brand.name, url: catalogue.brand.siteUrl, sameAs: [catalogue.brand.social.xUrl, catalogue.brand.social.instagramUrl, catalogue.brand.social.youtubeUrl] })}</script>
</head>
<body class="nightfall homePage"><a class="skip" href="#products">Skip to the apps</a><div class="hq-page">
${nav}
<main id="main">${hero}${dock}
${duo}
${lightTableSection}
<section class="hq-catalogue" id="products" aria-labelledby="apps-title"><div class="hq-sectionhead" id="live-now"><div><p class="hq-eyebrow">The everyday collection</p><h2 id="apps-title">Find your everyday favourite.</h2></div><p>Six independent apps.<br>A little help with the things you love.</p></div>
<div class="hq-filters" role="group" aria-label="Filter available apps" hidden><button type="button" class="hq-filter" data-filter="all" aria-pressed="true">All apps</button><button type="button" class="hq-filter" data-filter="create" aria-pressed="false">Learn & create</button><button type="button" class="hq-filter" data-filter="life" aria-pressed="false">Everyday life</button></div><p class="hq-sr-only" id="filter-status" aria-live="polite"></p><div class="hq-cards">${cards}</div></section>
<section class="hq-about" id="philosophy"><div><p class="hq-eyebrow">Independent by choice</p><h2>Small details.<br>Personal care.</h2></div><div><p>Let’s Build Apps HQ is an independent maker of Apple apps for real life. Each starts with one everyday need, from remembering a journey to finding a better coffee recipe.</p><p>Useful things, made with care. Clear choices about purchases and privacy, explained app by app.</p><a class="hq-textlink" href="./privacy/">Our approach to privacy <span aria-hidden="true">↗</span></a></div></section>
<section class="hq-coming" id="in-the-works"><div class="hq-sectionhead"><div><p class="hq-eyebrow">In the works</p><h2>More good things.</h2></div><p>Three more apps in private testing and release preparation.</p></div><div class="hq-cominglist">${future}</div></section>
<section class="hq-download" id="download"><div class="hq-sectionhead"><h2>Make one of them yours.</h2><p>Six apps available now on the App Store.</p></div><div class="downloadList">${live.map(a => `<a href="${a.appStoreUrl}"><span>${escape(a.category)}</span><b>${a.short}</b><i aria-hidden="true">↗</i></a>`).join('')}</div></section>
<section class="hq-follow" id="follow"><p class="hq-eyebrow">Follow the build</p><h2>The small details. As they happen.</h2><div><a href="https://x.com/letsbuildappshq" rel="me">X ↗</a><a href="https://www.instagram.com/letsbuildappshq/" rel="me">Instagram ↗</a><a href="https://www.youtube.com/@letsbuildappshq" rel="me">YouTube ↗</a></div></section>
</main>
<footer class="hq-footer"><span>© 2026 Let’s Build Apps HQ</span><div><a href="./testflight/">TestFlight</a><a href="./support/">Support</a><a href="./privacy/">Privacy</a><a href="./press/">Press</a></div></footer>
</div><dialog class="hq-dialog" aria-labelledby="hq-detail-title"><div class="hq-dialogbar"><span>A closer look</span><button type="button" class="hq-close" aria-label="Close product preview">×</button></div><div class="hq-detail"></div></dialog>
<script type="application/json" id="site-catalogue">${json}</script>
<script type="application/json" id="light-table-catalogue">${ltJson}</script>
${webAnalytics}</body></html>`;
await writeFile('public/index.html', html);
