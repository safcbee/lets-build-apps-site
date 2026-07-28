import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../public/', import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, root), 'utf8');

test('product pages describe the verified commercial models', () => {
  const expectations = [
    ['sentences/index.html', /free starter experience/i, /one-time premium/i],
    ['countdowns/index.html', /Start free\. Unlock once\./i, /one-time purchase/i],
    ['my-world/index.html', /essentials stay free/i, /monthly, annual and lifetime/i],
    ['better-pics/index.html', /Free core\. One-time Pro\./i, /one lifetime purchase/i],
    ['family-trips/index.html', /Free for the whole family/i, /without a subscription or paywall/i],
    ['travel-plans/index.html', /first trip is free/i, /£2\.99 monthly or £19\.99 annually/i],
    ['paw-care/index.html', /no subscription/i, /no account/i],
    ['perfect-coffee/index.html', /essentials stay free/i, /monthly, annually or with one lifetime purchase/i],
  ];

  for (const [relativePath, ...patterns] of expectations) {
    const html = read(relativePath);
    for (const pattern of patterns) {
      assert.match(html, pattern, `${relativePath} is missing ${pattern}`);
    }
  }
});

test('Better Coffee describes its free and Pro boundary accurately', () => {
  const coffee = read('perfect-coffee/index.html');
  const privacy = read('privacy/index.html');

  assert.doesNotMatch(coffee, /No extras to buy/i);
  assert.match(coffee, /Manual logging, manual beans, every experience level, basic coaching and full backup stay free/i);
  assert.match(privacy, /Better Coffee Pro monthly, annual and lifetime options are processed by Apple through StoreKit/i);
});
