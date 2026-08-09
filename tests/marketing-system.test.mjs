import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createMarketingPack } from '../scripts/generate-marketing-pack.mjs';
import { evaluateStatuses } from '../scripts/check-app-store-status.mjs';

const catalog = JSON.parse(readFileSync(new URL('../marketing/apps.json', import.meta.url), 'utf8'));

test('portfolio catalogue has one verified entry for every current app', () => {
  assert.equal(catalog.apps.length, 9);
  assert.equal(new Set(catalog.apps.map((app) => app.key)).size, 9, 'app keys are unique');
  assert.equal(new Set(catalog.apps.map((app) => app.appleId)).size, 9, 'Apple IDs are unique');
  assert.equal(catalog.apps.filter((app) => app.stage === 'live').length, 4, 'exactly four apps are currently public');

  for (const app of catalog.apps) {
    assert.ok(app.audience.length > 30, `${app.key} has a useful audience definition`);
    assert.ok(app.promise.length > 30, `${app.key} has an approved promise`);
    assert.ok(app.commercialModel.length > 20, `${app.key} has exact purchase wording`);
    assert.ok(app.claims.length >= 3, `${app.key} has a bounded claim set`);
    assert.ok(app.approvedAssets.length >= 1, `${app.key} has current approved marketing assets`);
    for (const asset of app.approvedAssets) {
      assert.equal(
        existsSync(new URL(`../public${asset.path}`, import.meta.url)),
        true,
        `${app.key} approved asset exists: ${asset.path}`,
      );
      assert.doesNotMatch(asset.path, /product-evidence|site-v2\//, `${app.key} does not allow a legacy evidence asset`);
    }
  }

  const live = catalog.apps.filter((app) => app.stage === 'live');
  for (const app of live) {
    assert.match(app.appStoreUrl, new RegExp(`/id${app.appleId}$`));
    assert.ok(app.publicVersion, `${app.key} records its current public version`);
  }
});

test('the first campaign week is deterministic, current and approval-gated', () => {
  const pack = createMarketingPack({ catalog, week: '2026-08-10' });
  assert.equal(pack.app.key, 'sentences');
  assert.match(pack.markdown, /One letter at a time\. One whole sentence at the end\./);
  assert.match(pack.markdown, /Free starter experience with one-time Premium/);
  assert.match(pack.markdown, /A person has approved every post before scheduling/);
  assert.match(pack.markdown, /untracked fallback/i);
  assert.match(pack.csv, /"Instagram"/);
  assert.match(pack.csv, /"X"/);
  assert.match(pack.csv, /Europe\/London/);
  assert.doesNotMatch(pack.markdown, /five-star|award-winning|thousands of|guaranteed improvement/i);
});

test('an optional Apple provider token produces channel-specific campaign links', () => {
  const pack = createMarketingPack({
    catalog,
    week: '2026-08-10',
    appKey: 'countdowns',
    providerToken: '123456',
  });
  assert.equal(pack.trackingReady, true);
  assert.match(pack.markdown, /pt=123456/);
  assert.match(pack.markdown, /ct=count_260810_ig/);
  assert.match(pack.markdown, /ct=count_260810_x/);
  assert.match(pack.markdown, /ct=count_260810_email/);
});

test('public storefront differences are detected without guessing internal review state', () => {
  const matchingObservations = Object.fromEntries(catalog.apps.map((app) => [app.appleId, null]));
  for (const app of catalog.apps.filter((candidate) => candidate.stage === 'live')) {
    matchingObservations[app.appleId] = {
      name: app.storefrontName,
      version: app.publicVersion,
      url: app.appStoreUrl,
      price: 'Free',
    };
  }
  const matching = evaluateStatuses(catalog, matchingObservations);
  assert.equal(matching.alerts.length, 0);

  matchingObservations['6785081962'] = {
    name: "Let's Build Better Coffee",
    version: '1.0',
    url: 'https://apps.apple.com/gb/app/id6785081962',
    price: 'Free',
  };
  const launch = evaluateStatuses(catalog, matchingObservations);
  assert.equal(launch.alerts.length, 1);
  assert.equal(launch.alerts[0].type, 'launch-detected');
  assert.equal(launch.alerts[0].appKey, 'better-coffee');
});

test('similarly named travel products retain separate storage and purchase facts', () => {
  const familyTrips = catalog.apps.find((app) => app.key === 'family-trips');
  const travelPlans = catalog.apps.find((app) => app.key === 'travel-plans');
  assert.match(familyTrips.commercialModel, /no subscription, paywall or in-app purchase/i);
  assert.match(familyTrips.claims.join(' '), /Sign in with Apple.*Supabase/i);
  assert.match(travelPlans.commercialModel, /first trip is free.*monthly.*annually/i);
  assert.match(travelPlans.claims.join(' '), /CloudKit/i);
});
