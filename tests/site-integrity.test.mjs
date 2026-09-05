import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const pages = [
  'index.html',
  'sentences/index.html',
  'countdowns/index.html',
  'paw-care/index.html',
  'paw-care/privacy/index.html',
  'perfect-coffee/index.html',
  'family-memories/index.html',
  'family-memories/privacy/index.html',
  'family-trips/index.html',
  'travel-plans/index.html',
  'travel-plans/privacy/index.html',
  'better-pics/index.html',
  'better-pics/privacy/index.html',
  'my-world/index.html',
  'press/index.html',
  'privacy/index.html',
  'support/index.html',
  'portaflow/index.html',
];

const appPages = [
  'sentences/index.html',
  'countdowns/index.html',
  'paw-care/index.html',
  'perfect-coffee/index.html',
  'family-memories/index.html',
  'family-trips/index.html',
  'travel-plans/index.html',
  'better-pics/index.html',
  'my-world/index.html',
];

const root = new URL('../public/', import.meta.url);

function read(page) {
  return readFileSync(new URL(page, root), 'utf8');
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

for (const page of pages) {
  const html = read(page);
  assert.match(html, /Let(?:'|&apos;|’)s Build Apps/, `${page} keeps site branding`);

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const target = match[1];
    if (
      target.startsWith('http') ||
      target.startsWith('mailto:') ||
      target.startsWith('data:') ||
      target.startsWith('#')
    ) {
      continue;
    }

    const cleanTarget = target.split('#')[0].split('?')[0];
    if (!cleanTarget) continue;

    const candidate = normalize(join(dirname(page), cleanTarget));
    const resolved = cleanTarget.endsWith('/') ? join(candidate, 'index.html') : candidate;
    assert.equal(existsSync(new URL(resolved, root)), true, `${page} links to existing local file: ${target}`);
  }

  for (const match of html.matchAll(/\bhref=["']#([^"']+)["']/gi)) {
    const id = match[1];
    assert.match(html, new RegExp(`\\bid=["']${id}["']`), `${page} has target for #${id}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    assert.match(tag, /\balt=["'][^"']+["']/i, `${page} image has non-empty alt text: ${tag}`);
  }
}

for (const page of appPages) {
  const html = read(page);
  assert.match(html, /href=["']\.\.\/["']/, `${page} links back to the homepage`);
  if (
    page === 'travel-plans/index.html' ||
    page === 'family-memories/index.html' ||
    page === 'family-trips/index.html' ||
    page === 'paw-care/index.html' ||
    page === 'better-pics/index.html'
  ) {
    assert.match(html, /href=["']\.\/privacy\/["']/, `${page} links to its app-specific Privacy policy`);
  } else {
    assert.match(html, /href=["']\.\.\/privacy\/(?:#[^"']+)?["']/, `${page} links to Privacy`);
  }
  assert.match(html, /href=["'][^"']*support\//g, `${page} links to support`);
}

const home = read('index.html');
assert.match(home, /href=["']\.\/support\/["']/, 'homepage links to support');
assert.match(home, /href=["']\.\/privacy\/["']/, 'homepage links to Privacy');
assert.match(home, /href=["']\.\/press\/["']/, 'homepage links to the press and creator desk');
assert.match(home, /href=["']https:\/\/x\.com\/letsbuildappshq["']/, 'homepage links to the verified X profile');
assert.match(home, /href=["']https:\/\/www\.instagram\.com\/letsbuildappshq\/["']/, 'homepage links to the verified Instagram profile');
assert.match(home, /href=["']https:\/\/www\.youtube\.com\/@letsbuildappshq["']/, 'homepage links to the verified YouTube channel');
assert.match(home, /"sameAs":\["https:\/\/x\.com\/letsbuildappshq","https:\/\/www\.instagram\.com\/letsbuildappshq\/","https:\/\/www\.youtube\.com\/@letsbuildappshq"\]/, 'homepage publishes social identity metadata');
assert.match(home, /Small apps\.<br><em>Big everyday\.<\/em>/, 'homepage uses the selected Nightfall experience');
assert.equal((visibleText(home).match(/\bView product page\b/g) || []).length, 9, 'homepage has a visible product page link for each product page');
assert.match(
  home,
  /Let’s Build My World[\s\S]*?Available on App Store[\s\S]*?https:\/\/apps\.apple\.com\/gb\/app\/lets-build-my-world\/id6790905052/,
  'homepage reports My World as live and links to its verified listing',
);
assert.match(
  home,
  /Let’s Build Better Pictures[\s\S]*?Available on App Store[\s\S]*?https:\/\/apps\.apple\.com\/gb\/app\/lets-build-better-pictures\/id6794868739/,
  'homepage reports Better Pictures as live and links to its verified listing',
);

const privacy = read('privacy/index.html');
assert.match(privacy, /Last updated:\s*5 September 2026/, 'privacy policy shows its current revision date');
assert.match(privacy, /href=["'][^"']*support\//g, 'privacy page exposes the private support form');
assert.match(
  privacy,
  /Better Coffee Pro monthly, annual and lifetime options are processed by Apple through StoreKit/,
  'privacy page describes the optional Better Coffee Pro purchase model',
);

const sentences = read('sentences/index.html');
const sentencesPrivacySection = privacy.match(
  /<section\s+id=["']sentences-privacy["'][^>]*>[\s\S]*?<\/section>/i,
);
assert.ok(sentencesPrivacySection, 'privacy page contains the Let’s Build Sentences section');
const sentencesPersonalVoiceClaims = [
  ['sentences/index.html', visibleText(sentences)],
  ['privacy/index.html#sentences-privacy', visibleText(sentencesPrivacySection[0])],
]
  .filter(([, text]) => /\bPersonal Voice\b/i.test(text))
  .map(([page]) => page);
assert.deepEqual(
  sentencesPersonalVoiceClaims,
  [],
  'Sentences product and privacy copy stays fail-closed against Personal Voice claims until authoritative current source and entitlement evidence explicitly enable the feature',
);

const coffee = read('perfect-coffee/index.html');
assert.match(coffee, /Essentials stay free/i, 'Better Coffee describes its free essentials');
assert.match(coffee, /Optional Better Coffee Pro/i, 'Better Coffee describes its optional Pro model');
assert.match(coffee, /Available on (?:the )?App Store/i, 'Better Coffee reports its verified public release');
assert.match(coffee, /£2\.99 monthly, £19\.99 annually or £39\.99 lifetime/i, 'Better Coffee publishes its confirmed UK Pro prices');
assert.match(coffee, /34 roaster sources/i, 'Better Coffee publishes the current roaster discovery breadth');
assert.doesNotMatch(coffee, /No extras to buy/i, 'Better Coffee does not imply there is no purchase');
assert.match(home, /Optional Better Coffee Pro/, 'homepage describes the Better Coffee Pro model');
assert.match(home, /id=["']perfect-coffee["'][\s\S]*?Available on App Store[\s\S]*?Let’s Build Better Coffee/, 'homepage reports Better Coffee is live');

const travelPlans = read('travel-plans/index.html');
assert.match(travelPlans, /Plan, Pack, Pay, Paperwork, People/, 'Travel Plans reflects the verified V2 pillars');
assert.match(travelPlans, /Unlimited local trips/, 'Travel Plans reflects the current unlimited local experience');
assert.match(travelPlans, /No account required/, 'Travel Plans explains the current account-free experience');
assert.match(travelPlans, /never a misleading percentage/, 'Travel Plans describes the qualitative readiness model');
assert.doesNotMatch(travelPlans, /Travel Plans Plus|first trip is free|£2\.99 monthly/i, 'Travel Plans removes claims from the retired subscription build');

const travelPrivacy = read('travel-plans/privacy/index.html');
assert.match(travelPrivacy, /does not require an account, Sign in with Apple login or Supabase account/, 'Travel Plans privacy reflects the mounted V2 app');
assert.match(travelPrivacy, /booking files only: trip facts remain stored locally/, 'Travel Plans privacy describes the optional iCloud Drive boundary');
assert.match(travelPrivacy, /moves the unreadable store files into a dated recovery folder/, 'Travel Plans privacy explains safe local-store recovery');
assert.match(travelPrivacy, /covers Travel Plans 2\.0 build 1/, 'Travel Plans privacy identifies the current private TestFlight implementation');

const familyMemories = read('family-memories/index.html');
assert.match(familyMemories, /Keep the <em>little things\.<\/em>/, 'Family Memories uses the approved Design 1 headline');
assert.match(familyMemories, /Art Alive/, 'Family Memories explains Art Alive');
assert.match(familyMemories, /voice or video/i, 'Family Memories keeps voice and video with artwork');
assert.match(familyMemories, /Journaling Suggestions/, 'Family Memories explains the explicit Apple suggestion flow');
assert.match(familyMemories, /Private TestFlight/, 'Family Memories reports its current private distribution state');

const familyMemoriesPrivacy = read('family-memories/privacy/index.html');
assert.match(familyMemoriesPrivacy, /Last updated:\s*5 September 2026/, 'Family Memories privacy shows its current revision date');
assert.match(familyMemoriesPrivacy, /Apple CloudKit and CKShare/, 'Family Memories privacy explains optional Apple family sharing');
assert.match(familyMemoriesPrivacy, /does not send this information to a developer server or an external language-model provider/i, 'Family Memories privacy explains Day Weave processing');

const betterPics = read('better-pics/index.html');
assert.match(betterPics, /Available on App Store/, 'Better Pictures reports its live availability');
assert.match(betterPics, /https:\/\/apps\.apple\.com\/gb\/app\/lets-build-better-pictures\/id6794868739/, 'Better Pictures links to its verified App Store listing');
assert.match(betterPics, /Canon, Nikon, Sony, Fujifilm, OM System and Panasonic/, 'Better Pictures reflects its current multi-brand kit');
assert.match(betterPics, /one lifetime purchase/i, 'Better Pictures describes the current one-time Pro model');
assert.match(betterPics, /what you(?:’|')re photographing, which lens is mounted/i, 'Better Pictures explains the guided settings workflow');
assert.match(betterPics, /original is not uploaded/i, 'Better Pics explains its on-device photo handling');
assert.match(betterPics, /not endorsed by Canon, Nikon, Sony, Fujifilm, OM System or Panasonic/i, 'Better Pictures includes its manufacturer independence disclaimer');
assert.match(betterPics, /href=["']\.\/privacy\/["']/, 'Better Pics links to its dedicated privacy policy');
assert.match(betterPics, /https:\/\/letsbuildappshq\.com\/og-editorial\.png/, 'Better Pictures publishes the refreshed Let’s Build Apps HQ social card');

const myWorld = read('my-world/index.html');
assert.match(myWorld, /Available on App Store/, 'My World reports its live availability');
assert.match(myWorld, /https:\/\/apps\.apple\.com\/gb\/app\/lets-build-my-world\/id6790905052/, 'My World links to its verified App Store listing');
assert.match(myWorld, /countries, regions, cities, airports and all 50 US states/i, 'My World describes the current place coverage');
assert.match(myWorld, /Photo Discovery analyses dates and locations on-device/i, 'My World explains on-device Photo Discovery');
assert.match(myWorld, /href=["']\.\.\/privacy\/#my-world-privacy["']/, 'My World links to its privacy summary');

const betterPicsPrivacy = read('better-pics/privacy/index.html');
assert.match(betterPicsPrivacy, /Last updated:\s*5 September 2026/, 'Better Pics privacy shows its current revision date');
assert.match(betterPicsPrivacy, /up to 20 small review summaries/i, 'Better Pics privacy describes local review history');
assert.match(betterPicsPrivacy, /GPS coordinates and camera serial number are not displayed or written to review history/, 'Better Pics privacy excludes sensitive metadata from history');
assert.match(betterPicsPrivacy, /href=["'][^"']*support\//g, 'Better Pics privacy exposes the privacy contact');

const allText = pages.map((page) => visibleText(read(page))).join(' ');
const allHtml = pages.map((page) => read(page)).join(' ');
assert.doesNotMatch(allText, /support@letsbuildapps\.io/i, 'old support email is removed');
assert.doesNotMatch(allText, /leary\.cloud|SAFCMedia/i, 'legacy domains and company references are removed');
assert.match(allText, /© 2026 Let’s Build Apps HQ/, 'copyright is attributed to Let’s Build Apps HQ');
assert.doesNotMatch(allHtml, /Brian Leary/i, 'personal name is removed from public pages and structured metadata');
assert.doesNotMatch(allText, /Good Habits/i, 'retired Good Habits product is removed');
assert.doesNotMatch(allText, /Portaflow cards|Portaflow navigation/i, 'Portaflow does not appear as primary product content');
assert.doesNotMatch(allText, /Future Projects|Concept Stage/i, 'placeholder homepage sections are removed');
assert.doesNotMatch(
  allText,
  /No pretend launch dates|invented claims|The house rules|not a marketing mock-up|Generated from the submitted app|Name withheld until supplied/i,
  'internal audit and placeholder language is not published',
);
assert.doesNotMatch(home, /experimental|View preview page/i, 'production homepage has no preview promotion copy');

const portaflow = read('portaflow/index.html');
assert.match(portaflow, /http-equiv=["']refresh["']/i, 'Portaflow legacy route redirects');
assert.match(portaflow, /url=\.\.\/perfect-coffee\//i, 'Portaflow redirects to Perfect Coffee');
