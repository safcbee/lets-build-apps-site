import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const appStoreUrl = 'https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794';
const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const countdowns = readFileSync(new URL('../countdowns/index.html', import.meta.url), 'utf8');

const availableNow = home.slice(
  home.indexOf('<!-- Available Now Section -->'),
  home.indexOf('<!-- Coming Soon Section -->'),
);
const comingSoon = home.slice(home.indexOf('<!-- Coming Soon Section -->'));

assert.match(availableNow, /Let's Build Countdowns/, 'Countdowns appears in Available Now');
assert.match(availableNow, /Available Now/, 'Countdowns has an Available Now status');
assert.match(availableNow, new RegExp(appStoreUrl), 'homepage Countdowns card links to the App Store');
assert.doesNotMatch(comingSoon, /Let's Build Countdowns/, 'Countdowns is no longer in Coming Soon');

assert.match(countdowns, new RegExp(appStoreUrl), 'Countdowns page links to the App Store');
assert.match(countdowns, /Download on App Store/, 'Countdowns page has a download CTA');
assert.match(countdowns, /href="#features"/, 'Watch Demo scrolls to the feature section');
const retiredSignupCopy = new RegExp([
  ['Get', 'Notified'].join(' '),
  ['yourname', 'email.com'].join('@').replace('.', '\\.'),
  ['No', 'spam'].join(' '),
].join('|'));

assert.doesNotMatch(countdowns, retiredSignupCopy, 'Countdowns page no longer asks for email notification signup');
