import { readFile, writeFile } from 'node:fs/promises';

const catalogue = JSON.parse(await readFile('marketing/apps.json', 'utf8'));
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const presentation = {
  'my-world': { short: 'My World', icon: '◎', colour: '#bddfd2', group: 'life', image: 'site-v4/my-world-01-world.jpg', line: 'Every journey, part of your story.', price: 'Free core · Optional My World+' },
  'sentences': { short: 'Sentences', icon: 'Aa', colour: '#ffe266', group: 'create', image: 'site-v4/sentences-1.jpg', line: 'Their next sentence starts here.', price: 'Free starter · One-time Premium' },
  'better-coffee': { short: 'Better Coffee', icon: '≋', colour: '#dfc6ae', group: 'life', image: 'site-v5/coffee-home.jpg', line: 'Make your next shot a better one.', price: 'Essentials stay free · Optional Better Coffee Pro' },
  'better-pictures': { short: 'Better Pictures', icon: '⊙', colour: '#d0c9fa', group: 'create', image: 'site-v4/better-pics-01-never-guess.jpg', line: 'Walk up to the shot with a plan.', price: 'Free core · One-time Pro' },
  'countdowns': { short: 'Countdowns', icon: '↗', colour: '#ffc5a8', group: 'life', image: 'site-v4/countdowns-next.jpg', line: 'Something good to look forward to.', price: 'Free starter · One-time Plus' },
};
const live = Object.keys(presentation).map(key => ({ ...catalogue.apps.find(a => a.key === key), ...presentation[key] }));
if (live.some(a => a.stage !== 'live' || !a.appStoreUrl)) throw new Error('Every featured app must have a verified live listing.');
const upcoming = catalogue.apps.filter(a => a.stage !== 'live' && a.stage !== 'retired');
const route = a => a.sitePath.startsWith('https:') ? a.sitePath : `.${a.sitePath}`;
const appId = a => a.sitePath.startsWith('https:') ? a.key : a.sitePath.replaceAll('/', '');
const nav = `<header class="hq-nav">
  <a class="hq-logo" href="./" aria-label="Let’s Build Apps HQ home"><span class="hq-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>let’s build<small>apps hq</small></span></a>
  <nav class="hq-navlinks" aria-label="Primary navigation"><a href="#products">The apps</a><a href="#philosophy">Our story</a><a href="./support/">Support</a><a class="hq-navcta" href="#products">Find your app ↗</a></nav>
  <details class="hq-mobile-nav"><summary>Menu <span aria-hidden="true">+</span></summary><nav aria-label="Mobile navigation"><a href="#products">The apps</a><a href="#philosophy">Our story</a><a href="#in-the-works">In the works</a><a href="./support/">Support</a><a href="./privacy/">Privacy</a></nav></details>
</header>`;
let hero = await readFile('scripts/templates/nightfall-hero.html', 'utf8');
hero = hero.replace(/<div class="nf-dock"[\s\S]*$/, '');
hero = hero.replaceAll('class="hq-badge"', 'class="hq-badge"').replace(/data-scroll="[^"]*"/g, '');
hero = hero.replace('<div class="nf-caption">', '<a class="nf-caption" href="./my-world/" aria-label="Explore My World">').replace('<b>My World ↗</b></div>', '<b>My World ↗</b></a>');
hero = hero.replace('</section>', '<button class="hq-motion" type="button" aria-pressed="false" hidden>Pause motion</button></section>');
const dock = `<div class="nf-dock" role="group" aria-label="Choose a featured app">${live.map((a,i) => `<button type="button" data-feature="${a.key}" aria-pressed="${i === 0}" aria-controls="featured-screen"><span class="hq-miniicon" aria-hidden="true">${a.icon}</span>${a.short}</button>`).join('')}</div>`;
hero = hero.replace('class="nf-phone"', 'class="nf-phone" id="featured-screen"');
const cards = live.map(a => `<article class="hq-appcard" id="${appId(a)}" data-category="${a.group}" style="--hq-card-color:${a.colour}">
  <div class="hq-cardtop"><img class="hq-appicon" src="./assets/${a.key === 'better-coffee' ? 'site-v5/icon-coffee.png' : a.key === 'countdowns' ? 'site-v3/icon-countdowns.png' : 'site-v4/icon-' + ({'better-pictures':'better-pics'}[a.key] || a.key) + '.png'}" alt="${escape(a.name)} app icon" width="60" height="60" loading="lazy"><small>${escape(a.category)}</small></div>
  <p class="hq-availability">Available on App Store</p><h3><a href="${route(a)}">${escape(a.name)}</a></h3><p>${escape(a.line)}</p><p class="hq-price">${escape(a.price)}</p>
  <div class="hq-cardlinks"><a href="${route(a)}">View product page <span aria-hidden="true">↗</span></a><a href="./testflight/?app=${a.key}">Test upcoming versions ↗</a><button type="button" data-preview="${a.key}" aria-label="Preview ${a.short}" hidden>Quick look <span aria-hidden="true">+</span></button></div>
</article>`).join('\n');
const future = upcoming.map(a => `<article id="${appId(a)}"><div><span class="hq-availability">${escape(a.stageLabel)}</span><h3>${escape(a.name)}</h3><p>${escape(a.promise)}</p></div><div class="hq-coming-actions"><a class="hq-textlink" href="./testflight/?app=${a.key}">Request TestFlight access ↗</a><a class="hq-textlink" href="${route(a)}">${a.key === 'weddings' ? 'Visit the wedding site' : 'View product page'} <span aria-hidden="true">↗</span></a></div></article>`).join('');
const data = live.map(a => ({ key: a.key, name: a.short, category: a.category, image: `./assets/${a.image}`, description: a.promise, price: a.price, url: a.appStoreUrl, page: route(a), points: a.claims.slice(0, 3) }));
const json = JSON.stringify(data).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Let’s Build Apps HQ — Small Apps. Big Everyday.</title>
  <meta name="description" content="Independent Apple apps for travel memories, first sentences, better photographs, everyday moments and better coffee. Find your everyday favourite.">
  <meta name="theme-color" content="#080c10"><link rel="canonical" href="https://letsbuildappshq.com/">
  <meta property="og:type" content="website"><meta property="og:url" content="https://letsbuildappshq.com/"><meta property="og:title" content="Let’s Build Apps HQ — Small Apps. Big Everyday."><meta property="og:description" content="Independent apps for the places you go, the things you make and the little rituals in between."><meta property="og:image" content="https://letsbuildappshq.com/og-editorial.png">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@letsbuildappshq">
  <link rel="stylesheet" href="./assets/nightfall.css"><link rel="stylesheet" href="./assets/nightfall-pages.css"><script src="./assets/nightfall.js" defer></script>
  <script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:catalogue.brand.name,url:catalogue.brand.siteUrl,sameAs:[catalogue.brand.social.xUrl,catalogue.brand.social.instagramUrl,catalogue.brand.social.youtubeUrl]})}</script>
</head>
<body class="nightfall homePage"><a class="skip" href="#products">Skip to the apps</a><div class="hq-page">
${nav}
<main id="main">${hero}${dock}
<section class="hq-catalogue" id="products" aria-labelledby="apps-title"><div class="hq-sectionhead" id="live-now"><div><p class="hq-eyebrow">The everyday collection</p><h2 id="apps-title">Find your everyday favourite.</h2></div><p>Five independent apps.<br>A little help with the things you love.</p></div>
<div class="hq-filters" role="group" aria-label="Filter available apps" hidden><button type="button" class="hq-filter" data-filter="all" aria-pressed="true">All apps</button><button type="button" class="hq-filter" data-filter="create" aria-pressed="false">Learn & create</button><button type="button" class="hq-filter" data-filter="life" aria-pressed="false">Everyday life</button></div><p class="hq-sr-only" id="filter-status" aria-live="polite"></p><div class="hq-cards">${cards}</div></section>
<section class="hq-about" id="philosophy"><div><p class="hq-eyebrow">Independent by choice</p><h2>Small details.<br>Personal care.</h2></div><div><p>Let’s Build Apps HQ is an independent maker of Apple apps for real life. Each starts with one everyday need, from remembering a journey to finding a better coffee recipe.</p><p>Useful things, made with care. Clear choices about purchases and privacy, explained app by app.</p><a class="hq-textlink" href="./privacy/">Our approach to privacy <span aria-hidden="true">↗</span></a></div></section>
<section class="hq-coming" id="in-the-works"><div class="hq-sectionhead"><div><p class="hq-eyebrow">In the works</p><h2>More good things.</h2></div><p>Four more apps in private testing and release preparation.</p></div><div class="hq-cominglist">${future}</div></section>
<section class="hq-download" id="download"><div class="hq-sectionhead"><h2>Make one of them yours.</h2><p>Available now on the App Store.</p></div><div class="downloadList">${live.map(a=>`<a href="${a.appStoreUrl}"><span>${escape(a.category)}</span><b>${a.short}</b><i aria-hidden="true">↗</i></a>`).join('')}</div></section>
<section class="hq-follow" id="follow"><p class="hq-eyebrow">Follow the build</p><h2>The small details. As they happen.</h2><div><a href="https://x.com/letsbuildappshq" rel="me">X ↗</a><a href="https://www.instagram.com/letsbuildappshq/" rel="me">Instagram ↗</a><a href="https://www.youtube.com/@letsbuildappshq" rel="me">YouTube ↗</a></div></section>
</main>
<footer class="hq-footer"><span>© 2026 Let’s Build Apps HQ</span><div><a href="./support/">Support</a><a href="./privacy/">Privacy</a><a href="./press/">Press</a></div></footer>
</div><dialog class="hq-dialog" aria-labelledby="hq-detail-title"><div class="hq-dialogbar"><span>A closer look</span><button type="button" class="hq-close" aria-label="Close product preview">×</button></div><div class="hq-detail"></div></dialog>
<script type="application/json" id="site-catalogue">${json}</script>
</body></html>`;
await writeFile('public/index.html', html);
