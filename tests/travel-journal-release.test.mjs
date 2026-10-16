import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const product = readFileSync(new URL('../public/travel-plans/index.html', import.meta.url), 'utf8');
const privacy = readFileSync(new URL('../public/travel-plans/privacy/index.html', import.meta.url), 'utf8');
const home = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const privacyOverview = readFileSync(new URL('../public/privacy/index.html', import.meta.url), 'utf8');
const catalogue = JSON.parse(readFileSync(new URL('../marketing/apps.json', import.meta.url), 'utf8'));

test('Travel Plans presents the journal and its genuine app captures', () => {
  assert.match(product, /src="\.\.\/assets\/travel-plans-journal\/app-icon\.png"/);
  assert.doesNotMatch(product, /site-v4-icon-travel-plans-160/);
  const icon = readFileSync(new URL('../public/assets/travel-plans-journal/app-icon.png', import.meta.url));
  assert.equal(icon.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(icon.readUInt32BE(16), 1024);
  assert.equal(icon.readUInt32BE(20), 1024);
  assert.match(product, /photo-covered trips/);
  assert.match(product, /Plan · Ideas · Essentials/);
  assert.match(product, /Tap a day date/);
  assert.match(product, /Packing, spending, documents, travellers, notes and photos/);
  assert.match(product, /Genuine app screenshots with example trip data/);
  assert.equal((product.match(/<figure class="screenCard">/g) || []).length, 6);
  for (const name of [
    'journal-home-shelf.png',
    'journal-plan-day-switching.png',
    'journal-ideas-entry.png',
    'journal-essentials.png',
    'convenience-share-itinerary.png',
    'convenience-move-activity.png',
  ]) {
    const image = product.match(new RegExp(`<img[^>]+src="\\.\\./assets/travel-plans-journal/${name.replaceAll('.', '\\.')}"[^>]+>`));
    assert.ok(image, `real journal capture is published: ${name}`);
    assert.match(image[0], /width="1320" height="2868"/);
    assert.match(image[0], /alt="[^"]+"/);
    const capture = readFileSync(new URL(`../public/assets/travel-plans-journal/${name}`, import.meta.url));
    assert.equal(capture.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name} is a PNG capture`);
    assert.equal(capture.readUInt32BE(16), 1320, `${name} width matches its HTML dimensions`);
    assert.equal(capture.readUInt32BE(20), 2868, `${name} height matches its HTML dimensions`);
  }
  assert.doesNotMatch(product, /travel-plans-sep2026|travel-plans-discovery|Trip Ready|Trips, Current and Me|<b>Current<\/b>|<b>Me<\/b>|Plan, Pack, Pay, Paperwork, People/);
});

test('Ideas and conveniences describe explicit user choices', () => {
  assert.match(product, /Search Apple Maps, add a manual idea or save an HTTPS link/);
  assert.match(product, /Choose an optional photo/);
  assert.match(product, /Manual planning works offline/);
  assert.match(product, /Open Travel Plans and confirm the import into Ideas/);
  assert.match(product, /does not fetch or scan the page/);
  assert.match(product, /Move or copy an activity to another day with its photo/);
  assert.match(product, /selected day as images/);
  assert.match(product, /eight-second Undo window/);
  assert.match(product, /Documents, spending, traveller details and private notes stay out/);
});

test('Release status and commercial copy do not promise unverified availability', () => {
  assert.match(product, /Planned App Store price: <strong>£3\.99, paid once\./);
  assert.match(product, /No subscription/);
  assert.match(product, /public release is still being prepared/);
  assert.match(product, /journal update being prepared for TestFlight/);
  assert.doesNotMatch(product, /Available on (?:the )?App Store|Download now|build 10 (?:is live|available|delivered)|AI-powered|live AI|Travel Plans Plus|first trip free|£2\.99 monthly/i);
  assert.doesNotMatch(product, /aggregateRating|reviewRating/);
  assert.match(product, /trip sync is off/);
});

test('Privacy discloses the local share-extension handoff and confirmed import', () => {
  assert.match(privacy, /Last updated: 16 October 2026/);
  assert.match(privacy, /private App Group container on this device/);
  assert.match(privacy, /selected link and title, the target trip identifier and title/);
  assert.match(privacy, /minimal trip list containing trip identifiers, titles and destinations/);
  assert.match(privacy, /Open Travel Plans and confirm its import into Ideas/);
  assert.match(privacy, /Neither the extension nor this import fetches or scans the page/);
  assert.match(privacy, /does not send the link or trip list to a developer server/);
});

test('Privacy keeps limited itinerary sharing separate from full backups', () => {
  assert.match(privacy, /selected day or whole itinerary as a PDF, or a selected day as images/);
  assert.match(privacy, /activity titles, types and confirmation status/);
  assert.match(privacy, /choose whether to include activity times, Apple Maps directions links and the selected cover photo/);
  assert.match(privacy, /exclude documents, booking references, spending, traveller details, private notes and other attachments/);
  assert.match(privacy, /A full trip backup is a separate export/);
  assert.match(privacy, /may contain private information that the itinerary export excludes/);
  assert.match(privacy, /not an encrypted vault/);
  assert.match(privacy, /Nothing is shared silently/);
});

test('Privacy preserves local data, optional services and the deletion boundary', () => {
  assert.match(privacy, /does not require an account, Sign in with Apple login or Supabase account/);
  assert.match(privacy, /booking files only: trip facts remain stored locally/);
  assert.match(privacy, /Wikimedia Commons/);
  assert.match(privacy, /IP address/);
  assert.match(privacy, /Cloud AI is disabled/);
  assert.match(privacy, /Trip sync and collaboration are disabled/);
  assert.match(privacy, /stops loading trips and preserves the existing store and files/);
  assert.match(privacy, /does not automatically move, delete or replace an unreadable database/);
  assert.match(privacy, /eight-second Undo window/);
  assert.doesNotMatch(privacy, /before creating a fresh store|moves the unreadable store files|automatically synchronis|AI-powered/i);
});

test('Privacy distinguishes Wikimedia collection from local storage and qualifies retention', () => {
  const wikimedia = privacy.match(/<section id="wikimedia-photo-search">[\s\S]*?<\/section>/)?.[0];
  assert.ok(wikimedia, 'the optional provider has an addressable privacy explanation');
  assert.match(privacy, /Result previews load automatically after that search/);
  assert.match(privacy, /full itinerary, notes, documents and personal photos are not sent/);
  assert.match(privacy, /does not attach an app-account or advertising identifier/);
  for (const disclosure of [
    /collection and retention of search terms, IP addresses, User-Agent information and technical request metadata/,
    /request URLs, response\/error codes and timing/,
    /coarse geographical location derived from the IP address, not GPS location/,
    /service operation, security, diagnostics and analytics/,
    /may be associated with your IP address before later deletion, aggregation or de-identification/,
    /no advertising or analytics SDK/,
    /does not use this flow for advertising tracking/,
    /does not prevent Wikimedia’s own collection and analytics/,
    /ephemeral network session on the iPhone does not prevent remote retention/,
    /generally provide for deletion, aggregation or de-identification of IP and search-term records within 90 days/,
    /exceptions include occasional 180-day web-request retention/,
    /longer retention for backups, legal or security needs/,
    /not a guarantee that every request is kept for exactly 90 days or that all copies disappear within 90 days/,
    /not independently verified the retention of an individual app request/,
  ]) assert.match(wikimedia, disclosure);
  for (const source of [
    'https://foundation.wikimedia.org/wiki/Policy:Privacy_policy',
    'https://foundation.wikimedia.org/wiki/Legal:Wikimedia_Foundation_Data_Retention_Guidelines',
    'https://wikitech.wikimedia.org/wiki/Data_Platform/Data_Lake/Traffic/Webrequest',
    'https://wikitech.wikimedia.org/wiki/Data_Platform/Data_Lake/Traffic/mediawiki_api_request',
  ]) assert.ok(wikimedia.includes(`href="${source}"`), `provider evidence is linked: ${source}`);
  assert.doesNotMatch(privacy, /Wikimedia (?:does not|never) (?:collect|retain)|all (?:requests|copies) (?:are|will be) deleted within 90 days|no data is collected/i);
});

test('Travel Plans catalogue, homepage and privacy overview stay consistent', () => {
  const travelPlans = catalogue.apps.find(app => app.key === 'travel-plans');
  assert.equal(travelPlans.appleId, '6808593913');
  assert.equal(travelPlans.stage, 'private-testflight');
  assert.equal(travelPlans.appStoreUrl, null);
  assert.match(travelPlans.promise, /photo-led travel journal with Plan, Ideas and Essentials/);
  assert.match(travelPlans.claims.join(' '), /in preparation for private TestFlight/);
  assert.doesNotMatch(JSON.stringify(travelPlans), /Trip Ready|Five planning pillars|travel-plans-sep2026|store-02-current/);
  assert.equal(travelPlans.approvedAssets.length, 6);
  for (const asset of travelPlans.approvedAssets) {
    assert.match(asset.path, /^\/assets\/travel-plans-journal\//);
    assert.ok(product.includes(asset.path.slice(1)), `catalogue asset is shown on the product page: ${asset.path}`);
  }
  const homeEntry = home.match(/<article id="travel-plans">[\s\S]*?<\/article>/)?.[0];
  assert.ok(homeEntry, 'homepage has a Travel Plans entry');
  assert.ok(homeEntry.includes(travelPlans.promise));
  assert.doesNotMatch(homeEntry, /Trip Ready|Plan, Pack, Pay/);
  const overview = privacyOverview.match(/<section id="travel-plans-privacy">[\s\S]*?<\/section>/)?.[0];
  assert.ok(overview, 'privacy overview has a Travel Plans section');
  assert.match(overview, /confirm its import into Ideas/);
  assert.match(overview, /Full trip backups are a separate export/);
  assert.match(overview, /preserves the existing store and files without automatically replacing them/);
  assert.match(overview, /retained search terms, IP addresses, User-Agent and technical request metadata, and coarse location derived from IP/);
  assert.match(overview, /service operation, security, diagnostics and analytics/);
  assert.match(overview, /within 90 days, with exceptions including occasional 180-day/);
  assert.match(overview, /not a guarantee for every request or copy/);
  assert.match(overview, /href="\.\.\/travel-plans\/privacy\/#wikimedia-photo-search"/);
  assert.doesNotMatch(overview, /dated recovery folder/);
});
