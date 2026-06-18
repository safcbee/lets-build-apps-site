import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const appStoreUrl = 'https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794';
const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const countdowns = readFileSync(new URL('../countdowns/index.html', import.meta.url), 'utf8');

assert.match(home, /id=["']countdowns["']/, 'Countdowns appears as a product-led homepage section');
assert.match(home, /Available on App Store/, 'Countdowns has an available status');
assert.match(home, /href="\.\/countdowns\/"/, 'homepage Countdowns card links to the Countdowns page');
assert.doesNotMatch(home, /Coming Soon/, 'homepage no longer separates active products into Coming Soon');
assert.doesNotMatch(home, /Future Projects/, 'homepage no longer contains placeholder future projects');

assert.match(countdowns, new RegExp(appStoreUrl), 'Countdowns page links to the App Store');
assert.match(countdowns, /Download on App Store/, 'Countdowns page has a download CTA');
assert.match(countdowns, /Help shape Let's Build Countdowns/, 'Countdowns page has a TestFlight interest section');
const retiredSignupCopy = new RegExp([
  ['Get', 'Notified'].join(' '),
  ['yourname', 'email.com'].join('@').replace('.', '\\.'),
  ['No', 'spam'].join(' '),
].join('|'));

assert.doesNotMatch(countdowns, retiredSignupCopy, 'Countdowns page no longer asks for email notification signup');
