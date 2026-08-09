import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const publishPath = fileURLToPath(new URL('../public/', import.meta.url));

const requiredFiles = [
  'index.html',
  'CNAME',
  'apple-touch-icon.png',
  'favicon.ico',
  'assets/brand/lets-build-apps-hq-mark.webp',
  'sentences/index.html',
  'countdowns/index.html',
  'paw-care/index.html',
  'paw-care/privacy/index.html',
  'perfect-coffee/index.html',
  'family-trips/index.html',
  'portaflow/index.html',
  'privacy/index.html',
  'travel-plans/index.html',
  'travel-plans/privacy/index.html',
  'family-trips/privacy/index.html',
  'better-pics/index.html',
  'better-pics/privacy/index.html',
  'my-world/index.html',
  'press/index.html',
  'robots.txt',
  'sitemap.xml',
  'support/index.html',
];

const allowedTopLevelEntries = new Set([
  'CNAME',
  'apple-touch-icon.png',
  'assets',
  'better-pics',
  'countdowns',
  'family-trips',
  'favicon.ico',
  'my-world',
  'paw-care',
  'press',
  'index.html',
  'og-editorial.png',
  'og.png',
  'perfect-coffee',
  'portaflow',
  'privacy',
  'sentences',
  'robots.txt',
  'sitemap.xml',
  'support',
  'travel-plans',
]);

const forbiddenTopLevelEntries = new Set([
  'reports',
  'stitch_bambino_app_dashboard',
  'tests',
  'v4',
  'v5',
  'internal',
  'docs',
]);

assert.equal(existsSync(publishPath), true, 'public/ publish folder exists');
assert.equal(statSync(publishPath).isDirectory(), true, 'public/ is a directory');

for (const file of requiredFiles) {
  assert.equal(existsSync(join(publishPath, file)), true, `required published file exists: ${file}`);
}

const topLevelEntries = readdirSync(publishPath).sort();
for (const entry of topLevelEntries) {
  assert.equal(allowedTopLevelEntries.has(entry), true, `unexpected top-level entry in public/: ${entry}`);
  assert.equal(forbiddenTopLevelEntries.has(entry), false, `forbidden top-level entry in public/: ${entry}`);
}

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    entries.push(fullPath);
    if (statSync(fullPath).isDirectory()) entries.push(...walk(fullPath));
  }
  return entries;
}

for (const fullPath of walk(publishPath)) {
  const rel = relative(publishPath, fullPath);
  assert.notEqual(extname(fullPath), '.md', `Markdown/internal note copied to public/: ${rel}`);
  assert.equal(rel.startsWith('assets/stitch-screenshots/'), false, `Stitch screenshot asset copied to public/: ${rel}`);
  assert.equal(rel.startsWith('reports/'), false, `report copied to public/: ${rel}`);
  assert.equal(rel.startsWith('stitch_bambino_app_dashboard/'), false, `Stitch export copied to public/: ${rel}`);
}

const htmlFiles = walk(publishPath).filter((file) => extname(file) === '.html');
for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const target = match[1];
    if (
      target.startsWith('http:') ||
      target.startsWith('https:') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:') ||
      target.startsWith('data:') ||
      target.startsWith('#')
    ) {
      continue;
    }

    const cleanTarget = target.split('#')[0].split('?')[0];
    if (!cleanTarget) continue;

    const candidate = normalize(join(dirname(relative(publishPath, htmlFile)), cleanTarget));
    const resolved = cleanTarget.endsWith('/') ? join(candidate, 'index.html') : candidate;
    assert.equal(
      existsSync(join(publishPath, resolved)),
      true,
      `${relative(publishPath, htmlFile)} links to existing published file: ${target}`,
    );
  }
}

const cname = readFileSync(join(publishPath, 'CNAME'), 'utf8').trim();
assert.equal(cname, 'letsbuildappshq.com', 'published CNAME keeps letsbuildappshq.com');
