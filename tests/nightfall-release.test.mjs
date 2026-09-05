import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = resolve('public');
function walk(dir) { return readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(join(dir,e.name)) : [join(dir,e.name)]); }
const pages = walk(root).filter(p=>p.endsWith('/index.html')&&!p.includes('/portaflow/'));
for (const page of pages) {
  const html = readFileSync(page,'utf8');
  assert.match(html, /<body[^>]*class="[^"]*nightfall/, `${page}: consistent theme`);
  assert.match(html, /<link rel="canonical"/, `${page}: canonical URL`);
  assert.match(html, /<details class="hq-mobile-nav">/, `${page}: navigation works without JavaScript`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag, /width="\d+"/, `${page}: reserve image width`);
    assert.match(tag, /height="\d+"/, `${page}: reserve image height`);
    const srcset = tag.match(/srcset="([^"]+)"/)?.[1];
    for (const source of srcset?.split(',')||[]) assert.ok(existsSync(resolve(dirname(page),source.trim().split(' ')[0])));
  }
}
const home = readFileSync(join(root,'index.html'),'utf8');
const catalogue = JSON.parse(readFileSync('marketing/apps.json','utf8')).apps;
const previews = JSON.parse(home.match(/id="site-catalogue">([\s\S]*?)<\/script>/)[1]);
assert.equal(previews.length, 5);
for (const preview of previews) {
  const verified = catalogue.find(a=>a.key===preview.key);
  assert.equal(verified.stage,'live');
  assert.equal(preview.url, verified.appStoreUrl);
  assert.ok(existsSync(resolve(root,preview.image)));
}
// Protect the image improvements without requiring a browser or network in CI.
const sources = new Set([...home.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]));
const bytes = [...sources].reduce((sum,src)=>sum+statSync(resolve(root,src)).size,0);
assert.ok(bytes < 200_000, `Homepage default image payload is ${bytes} bytes (budget 200 KB)`);
const manifest = JSON.parse(readFileSync('scripts/nightfall-assets.json','utf8'));
for (const [name,asset] of Object.entries(manifest)) {
  if (name.includes('icon-')) assert.ok(asset.variants[0].bytes < 20_000, `${name}: small display icon`);
}
console.log(`Nightfall: ${pages.length} themed pages, 5 verified app previews, ${bytes.toLocaleString()} homepage image bytes.`);
