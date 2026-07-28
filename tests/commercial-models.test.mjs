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
    ['perfect-coffee/index.html', /paid App Store download/i, /no recurring subscription/i],
  ];

  for (const [relativePath, ...patterns] of expectations) {
    const html = read(relativePath);
    for (const pattern of patterns) {
      assert.match(html, pattern, `${relativePath} is missing ${pattern}`);
    }
  }
});

test('Better Coffee never implies that its download is free', () => {
  const coffee = read('perfect-coffee/index.html');
  const privacy = read('privacy/index.html');

  assert.doesNotMatch(coffee, /No extras to buy/i);
  assert.doesNotMatch(coffee, /free (?:app|download)/i);
  assert.match(privacy, /paid App Store download/i);
});
