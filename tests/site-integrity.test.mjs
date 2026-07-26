import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const pages = [
  'index.html',
  'sentences/index.html',
  'countdowns/index.html',
  'paw-care/index.html',
  'paw-care/privacy/index.html',
  'perfect-coffee/index.html',
  'family-trips/index.html',
  'travel-plans/index.html',
  'travel-plans/privacy/index.html',
  'better-pics/index.html',
  'better-pics/privacy/index.html',
  'privacy/index.html',
  'portaflow/index.html',
];

const appPages = [
  'sentences/index.html',
  'countdowns/index.html',
  'paw-care/index.html',
  'perfect-coffee/index.html',
  'family-trips/index.html',
  'travel-plans/index.html',
  'better-pics/index.html',
];

const root = new URL('../public/', import.meta.url);

function read(page) {
  return readFileSync(new URL(page, root), 'utf8');
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

for (const page of pages) {
  const html = read(page);
  assert.match(html, /Let(?:'|&apos;|’)s Build Apps/, `${page} keeps site branding`);

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const target = match[1];
    if (
      target.startsWith('http') ||
      target.startsWith('mailto:') ||
      target.startsWith('data:') ||
      target.startsWith('#')
    ) {
      continue;
    }

    const cleanTarget = target.split('#')[0].split('?')[0];
    if (!cleanTarget) continue;

    const candidate = normalize(join(dirname(page), cleanTarget));
    const resolved = cleanTarget.endsWith('/') ? join(candidate, 'index.html') : candidate;
    assert.equal(existsSync(new URL(resolved, root)), true, `${page} links to existing local file: ${target}`);
  }

  for (const match of html.matchAll(/\bhref=["']#([^"']+)["']/gi)) {
    const id = match[1];
    assert.match(html, new RegExp(`\\bid=["']${id}["']`), `${page} has target for #${id}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    assert.match(tag, /\balt=["'][^"']+["']/i, `${page} image has non-empty alt text: ${tag}`);
  }
}

for (const page of appPages) {
  const html = read(page);
  assert.match(html, /href=["']\.\.\/["']/, `${page} links back to the homepage`);
  if (
    page === 'travel-plans/index.html' ||
    page === 'family-trips/index.html' ||
    page === 'paw-care/index.html' ||
    page === 'better-pics/index.html'
  ) {
    assert.match(html, /href=["']\.\/privacy\/["']/, `${page} links to its app-specific Privacy policy`);
  } else {
    assert.match(html, /href=["']\.\.\/privacy\/(?:#[^"']+)?["']/, `${page} links to Privacy`);
  }
  assert.match(html, /mailto:support@leary\.cloud/, `${page} links to support`);
}

const home = read('index.html');
assert.match(home, /mailto:support@leary\.cloud/, 'homepage links to support');
assert.match(home, /href=["']\.\/privacy\/["']/, 'homepage links to Privacy');
assert.match(home, /Beautiful tools for real family life\./, 'homepage uses the expected production experience');
assert.equal((visibleText(home).match(/\bView product page\b/g) || []).length, 7, 'homepage has a visible product page link for each product section');

const privacy = read('privacy/index.html');
assert.match(privacy, /Last updated:\s*26 July 2026/, 'privacy policy shows its current revision date');
assert.match(privacy, /mailto:privacy@leary\.cloud/, 'privacy page exposes privacy contact');
assert.match(privacy, /mailto:support@leary\.cloud/, 'privacy page exposes support contact');

const travelPlans = read('travel-plans/index.html');
assert.match(travelPlans, /Plan, Pack, Pay, Paperwork, People/, 'Travel Plans reflects the verified V2 pillars');
assert.match(travelPlans, /First trip free/, 'Travel Plans explains the V2 free experience');
assert.match(travelPlans, /Each person who wants Plus subscribes individually/, 'Travel Plans does not repeat the retired family-wide entitlement claim');
assert.match(travelPlans, /build 37 is the current verified TestFlight upload/, 'Travel Plans identifies the current verified TestFlight build');

const travelPrivacy = read('travel-plans/privacy/index.html');
assert.match(travelPrivacy, /does not require a Let’s Build Apps account, Sign in with Apple login or Supabase account/, 'Travel Plans privacy reflects the mounted V2 app');
assert.match(travelPrivacy, /Apple CloudKit/, 'Travel Plans privacy discloses Plus sync');
assert.match(travelPrivacy, /Apple Foundation Models/, 'Travel Plans privacy discloses on-device assistance');
assert.match(travelPrivacy, /Build 37 is the current verified TestFlight upload/, 'Travel Plans privacy reflects the shipped TestFlight implementation');

const betterPics = read('better-pics/index.html');
assert.match(betterPics, /Private TestFlight/, 'Better Pics reports its private TestFlight availability');
assert.match(betterPics, /There is no public App Store listing yet/, 'Better Pics states the verified release status');
assert.match(betterPics, /what you are photographing, which lens is mounted/i, 'Better Pics explains the guided settings workflow');
assert.match(betterPics, /selected original is not uploaded/i, 'Better Pics explains its on-device photo handling');
assert.match(betterPics, /not endorsed by Canon/i, 'Better Pics includes the Canon independence disclaimer');
assert.match(betterPics, /href=["']\.\/privacy\/["']/, 'Better Pics links to its dedicated privacy policy');
assert.match(betterPics, /https:\/\/apps\.leary\.cloud\/assets\/site-v3\/better-pics-social\.jpg/, 'Better Pics publishes its product-specific social card');

const betterPicsPrivacy = read('better-pics/privacy/index.html');
assert.match(betterPicsPrivacy, /Last updated:\s*26 July 2026/, 'Better Pics privacy shows its current revision date');
assert.match(betterPicsPrivacy, /up to 20 small review summaries/i, 'Better Pics privacy describes local review history');
assert.match(betterPicsPrivacy, /GPS coordinates and camera serial number are not displayed or written to review history/, 'Better Pics privacy excludes sensitive metadata from history');
assert.match(betterPicsPrivacy, /mailto:privacy@leary\.cloud/, 'Better Pics privacy exposes the privacy contact');

const allText = pages.map((page) => visibleText(read(page))).join(' ');
assert.doesNotMatch(allText, /support@letsbuildapps\.io/i, 'old support email is removed');
assert.doesNotMatch(allText, /Good Habits/i, 'retired Good Habits product is removed');
assert.doesNotMatch(allText, /Portaflow cards|Portaflow navigation/i, 'Portaflow does not appear as primary product content');
assert.doesNotMatch(allText, /Future Projects|Concept Stage/i, 'placeholder homepage sections are removed');
assert.doesNotMatch(home, /experimental|View preview page/i, 'production homepage has no preview promotion copy');

const portaflow = read('portaflow/index.html');
assert.match(portaflow, /http-equiv=["']refresh["']/i, 'Portaflow legacy route redirects');
assert.match(portaflow, /url=\.\.\/perfect-coffee\//i, 'Portaflow redirects to Perfect Coffee');
