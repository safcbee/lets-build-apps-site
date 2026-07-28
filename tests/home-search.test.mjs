import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const visibleText = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ');

assert.doesNotMatch(html, /data-app-search|Search apps/i, 'production homepage has no dead search control');
assert.match(visibleText, /Beautiful tools for real family life\./, 'production homepage has the expected hero');
assert.match(html, /href=["']#products["']/, 'homepage has a products anchor CTA');
assert.match(html, /href=["']#testflight["']/, 'homepage has a TestFlight anchor CTA');

for (const id of ['sentences', 'countdowns', 'my-world', 'family-trips', 'travel-plans', 'paw-care', 'perfect-coffee', 'better-pics', 'weddings']) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `homepage exposes ${id} product section`);
}
