import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function visibleText(source) {
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

const text = visibleText(html);

assert.match(text, /Beautiful tools for real family life\./, 'V5 has premium emotional hero');
assert.match(text, /A family of focused apps\./, 'V5 frames the products as a connected family');

for (const id of ['sentences', 'countdowns', 'travel-plans', 'good-habits', 'perfect-coffee']) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `V5 includes ${id} product section`);
}

for (const phrase of [
  'Confidence, one sentence at a time.',
  'The excitement before the moment.',
  'The calm before the journey.',
  'Small routines. Big changes.',
  'Every great coffee starts with a better recipe.',
  'Built for real life',
]) {
  assert.match(text, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `V5 includes ${phrase}`);
}

assert.match(html, /https:\/\/apps\.apple\.com\/gb\/app\/lets-build-sentences\/id6761413051/, 'Sentences App Store link is present');
assert.match(html, /https:\/\/apps\.apple\.com\/gb\/app\/lets-build-countdowns\/id6777798794/, 'Countdowns App Store link is present');
assert.match(html, /mailto:support@leary\.cloud\?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Travel%20Plans/, 'Travel TestFlight interest link is present');
assert.match(html, /mailto:support@leary\.cloud\?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Good%20Habits/, 'Good Habits TestFlight interest link is present');
assert.match(html, /mailto:support@leary\.cloud\?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Perfect%20Coffee/, 'Perfect Coffee TestFlight interest link is present');

for (const asset of [
  './assets/product-evidence-v4/sentences/iphone-1-portrait-intro.png',
  './assets/product-evidence-v4/sentences/iphone-2-portrait-trace-off.png',
  './assets/product-evidence-v4/countdowns/01-hero-your-moments-next-up.png',
  './assets/product-evidence-v4/countdowns/02-moments-list.png',
  './assets/product-evidence-v4/travel-plans/visual-preview.jpeg',
  './assets/product-evidence-v4/good-habits/visual-preview.jpg',
  './assets/product-evidence-v4/perfect-coffee/dashboard.png',
]) {
  assert.match(html, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `V5 references ${asset}`);
}

assert.match(html, /prefers-reduced-motion/, 'V5 supports reduced motion');
assert.match(html, /IntersectionObserver/, 'V5 has tasteful scroll-triggered reveals');
assert.doesNotMatch(text, /testimonial|star rating|join thousands|happy families|happy learners/i, 'V5 does not invent social proof');
assert.doesNotMatch(text, /\bAnalytics\b/i, 'V5 does not add analytics messaging');
assert.doesNotMatch(text, /V5 experimental|Production V4|View V4 page/i, 'production V5 copy has no preview-era labels');
assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic/i, 'V5 does not load external font services');
assert.doesNotMatch(html, /font-size\s*:\s*clamp\(|font-size\s*:[^;]*vw/i, 'V5 avoids viewport-scaled font sizes');

for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
  const target = match[1];
  if (target.startsWith('http') || target.startsWith('mailto:') || target.startsWith('#') || target.startsWith('data:')) {
    continue;
  }

  const cleanTarget = target.split('#')[0].split('?')[0];
  if (!cleanTarget) continue;

  const candidate = normalize(join(dirname('index.html'), cleanTarget));
  const resolved = cleanTarget.endsWith('/') ? join(candidate, 'index.html') : candidate;
  assert.equal(existsSync(new URL(resolved, root)), true, `V5 links to existing local file: ${target}`);
}

for (const match of html.matchAll(/\bhref=["']#([^"']+)["']/gi)) {
  const id = match[1];
  assert.match(html, new RegExp(`\\bid=["']${id}["']`), `V5 has target for #${id}`);
}
