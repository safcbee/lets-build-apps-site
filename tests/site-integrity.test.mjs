import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const pages = [
  'index.html',
  'sentences/index.html',
  'countdowns/index.html',
  'good-habits/index.html',
  'perfect-coffee/index.html',
  'family-trips/index.html',
  'travel-plans/index.html',
  'travel-plans/privacy/index.html',
  'privacy/index.html',
  'portaflow/index.html',
];

const appPages = [
  'sentences/index.html',
  'countdowns/index.html',
  'good-habits/index.html',
  'perfect-coffee/index.html',
  'family-trips/index.html',
  'travel-plans/index.html',
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
  if (page === 'travel-plans/index.html' || page === 'family-trips/index.html') {
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
assert.equal((visibleText(home).match(/\bView product page\b/g) || []).length, 6, 'homepage has a visible product page link for each product section');

const privacy = read('privacy/index.html');
assert.match(privacy, /Last updated:\s*10 July 2026/, 'privacy policy shows its current revision date');
assert.match(privacy, /mailto:privacy@leary\.cloud/, 'privacy page exposes privacy contact');
assert.match(privacy, /mailto:support@leary\.cloud/, 'privacy page exposes support contact');

const allText = pages.map((page) => visibleText(read(page))).join(' ');
assert.doesNotMatch(allText, /support@letsbuildapps\.io/i, 'old support email is removed');
assert.doesNotMatch(allText, /Portaflow cards|Portaflow navigation/i, 'Portaflow does not appear as primary product content');
assert.doesNotMatch(allText, /Future Projects|Concept Stage/i, 'placeholder homepage sections are removed');
assert.doesNotMatch(home, /experimental|View preview page/i, 'production homepage has no preview promotion copy');

const portaflow = read('portaflow/index.html');
assert.match(portaflow, /http-equiv=["']refresh["']/i, 'Portaflow legacy route redirects');
assert.match(portaflow, /url=\.\.\/perfect-coffee\//i, 'Portaflow redirects to Perfect Coffee');
