import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../public/', import.meta.url);
const livePages = [
  ['sentences/index.html', '6761413051'],
  ['countdowns/index.html', '6777798794'],
  ['my-world/index.html', '6790905052'],
  ['better-pics/index.html', '6794868739'],
];

test('robots exposes the root sitemap', () => {
  const robots = readFileSync(new URL('robots.txt', root), 'utf8');
  assert.match(robots, /^User-agent: \*/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/letsbuildappshq\.com\/sitemap\.xml$/m);
});

test('sitemap lists canonical public pages and excludes the legacy redirect', () => {
  const sitemap = readFileSync(new URL('sitemap.xml', root), 'utf8');
  for (const route of ['/', '/sentences/', '/countdowns/', '/my-world/', '/better-pics/', '/family-memories/', '/family-memories/privacy/', '/press/', '/privacy/', '/support/']) {
    assert.match(sitemap, new RegExp(`<loc>https://letsbuildappshq\\.com${route.replaceAll('/', '\\/')}</loc>`));
  }
  assert.doesNotMatch(sitemap, /\/portaflow\//);
});

test('every live app page has canonical, social, Smart App Banner and software metadata', () => {
  for (const [page, appleId] of livePages) {
    const html = readFileSync(new URL(page, root), 'utf8');
    assert.match(html, /<link rel="canonical" href="https:\/\/letsbuildappshq\.com\//);
    assert.match(html, /<meta property="og:title"/);
    assert.match(html, /<meta property="og:image"/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
    assert.match(html, new RegExp(`<meta name="apple-itunes-app" content="app-id=${appleId}">`));
    assert.match(html, /"@type":"SoftwareApplication"/);
    assert.match(html, new RegExp(`"downloadUrl":"https://apps\\.apple\\.com/gb/app/[^\"]+/id${appleId}"`));
    assert.doesNotMatch(html, /aggregateRating|reviewRating/);
  }
});

test('press desk contains only current public App Store links and current approved screens', () => {
  const press = readFileSync(new URL('press/index.html', root), 'utf8');
  assert.match(press, /Four apps are available on the App Store/);
  assert.equal((press.match(/https:\/\/apps\.apple\.com\/gb\/app\//g) || []).length, 4);
  assert.doesNotMatch(press, /placeholder|award-winning|five-star|testimonial/i);
  for (const asset of [
    'site-v4/sentences-1.jpg',
    'site-v4/my-world-01-world.jpg',
    'site-v4/countdowns-next.jpg',
    'site-v4/better-pics-03-camera-plan.jpg',
  ]) {
    assert.match(press, new RegExp(asset.replaceAll('/', '\\/')));
  }
  for (const asset of [
    'assets/social/lets-build-apps-hq-x-header.png',
    'assets/social/lets-build-apps-hq-instagram-banner-4x5.png',
  ]) {
    assert.match(press, new RegExp(asset.replaceAll('/', '\\/')));
  }
});
