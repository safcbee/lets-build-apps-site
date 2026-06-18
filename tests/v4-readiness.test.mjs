import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);

const products = [
  {
    name: "Let's Build Sentences",
    page: 'sentences/index.html',
    status: 'Available on App Store',
    primary: 'Download on App Store',
    testFlightSubject: 'TestFlight%20Interest%20-%20Let%27s%20Build%20Sentences',
  },
  {
    name: "Let's Build Countdowns",
    page: 'countdowns/index.html',
    status: 'Available on App Store',
    primary: 'Download on App Store',
    testFlightSubject: 'TestFlight%20Interest%20-%20Let%27s%20Build%20Countdowns',
  },
  {
    name: "Let's Build Travel Plans",
    page: 'travel-plans/index.html',
    status: 'In Development',
    primary: 'Register interest in TestFlight',
    testFlightSubject: 'TestFlight%20Interest%20-%20Let%27s%20Build%20Travel%20Plans',
  },
  {
    name: "Let's Build Good Habits",
    page: 'good-habits/index.html',
    status: 'In Development',
    primary: 'Register interest in TestFlight',
    testFlightSubject: 'TestFlight%20Interest%20-%20Let%27s%20Build%20Good%20Habits',
  },
  {
    name: "Let's Build Perfect Coffee",
    page: 'perfect-coffee/index.html',
    status: 'In Development',
    primary: 'Register interest in TestFlight',
    testFlightSubject: 'TestFlight%20Interest%20-%20Let%27s%20Build%20Perfect%20Coffee',
  },
];

const pages = [
  'index.html',
  ...products.map((product) => product.page),
  'privacy/index.html',
  'portaflow/index.html',
];

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

function textPattern(value) {
  return new RegExp(value
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/'/g, "['’]"));
}

const home = read('index.html');
const homeText = visibleText(home);

for (const product of products) {
  assert.match(homeText, textPattern(product.name), `${product.name} appears on the homepage`);
  assert.match(homeText, new RegExp(product.status.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${product.name} has a homepage status pill`);
  assert.match(homeText, new RegExp(product.primary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${product.name} has a homepage primary CTA`);
  assert.match(home, new RegExp(`href=["']\\.\\/${product.page.replace('/index.html', '/')}["']`), `${product.name} has a product page link`);

  const html = read(product.page);
  const text = visibleText(html);
  assert.match(text, new RegExp(product.status.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${product.page} has a status pill`);
  assert.match(text, new RegExp(`Help shape ${product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), `${product.page} has a TestFlight section`);
  assert.match(html, new RegExp(`mailto:support@leary\\.cloud\\?subject=${product.testFlightSubject}`), `${product.page} has app-specific TestFlight interest mailto`);
  assert.match(text, /Why we built this/, `${product.page} explains why the app exists`);
  assert.match(text, /Availability/, `${product.page} has an availability block`);
  assert.match(text, /Key verified features/, `${product.page} has verified features`);
}

for (const page of pages) {
  const html = read(page);
  const text = visibleText(html);
  assert.doesNotMatch(text, /\bGet Started\b/, `${page} has no generic Get Started CTA`);

  for (const match of html.matchAll(/href=["']mailto:([^"'?]+)(?:\?[^"']*)?["']/gi)) {
    assert.match(match[1], /@leary\.cloud$/i, `${page} mailto uses @leary.cloud: ${match[1]}`);
  }
}

const travelText = visibleText(read('travel-plans/index.html'));
assert.doesNotMatch(travelText, /Collaborative trips/i, 'Travel Plans does not claim collaborative trips');
assert.doesNotMatch(travelText, /Live editors/i, 'Travel Plans does not claim live editors');
assert.doesNotMatch(travelText, /No-account group planning/i, 'Travel Plans does not claim no-account group planning');
assert.doesNotMatch(travelText, /automatic routes/i, 'Travel Plans does not claim automatic routes');
assert.doesNotMatch(travelText, /It's Free|Free app|Free to start/i, 'Travel Plans does not claim a free app');

const goodHabitsText = visibleText(read('good-habits/index.html'));
assert.doesNotMatch(goodHabitsText, /Espresso|template|sample/i, 'Good Habits has no template/sample/Espresso wording');

const portaflow = read('portaflow/index.html');
assert.match(portaflow, /http-equiv=["']refresh["']/i, 'Portaflow legacy route redirects');
assert.match(portaflow, /url=\.\.\/perfect-coffee\//i, 'Portaflow redirects to Perfect Coffee');

assert.match(home, /overflow-x\s*:\s*hidden|overflow-x-hidden|body class="[^"]*overflow-x-hidden/, 'homepage includes horizontal-overflow protection for mobile rendering');
