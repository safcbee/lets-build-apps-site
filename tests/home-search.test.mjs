import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(html, /data-app-search/, 'homepage search input exposes a search hook');
assert.match(html, /data-app-search-item/, 'app cards expose searchable item hooks');

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .join('\n');

const listeners = {};
const input = {
  value: '',
  addEventListener(type, handler) {
    listeners[type] = handler;
  },
};

function makeCard(searchText) {
  return {
    dataset: { appSearchText: searchText },
    hidden: false,
    style: { display: '' },
  };
}

const cards = [
  makeCard('lets build sentences education handwriting'),
  makeCard('lets build countdowns family timer'),
  makeCard('lets build perfect coffee lifestyle brew'),
];

const context = {
  window: {},
  tailwind: {},
  document: {
    querySelector(selector) {
      return selector === '[data-app-search]' ? input : null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-app-search-item]') return cards;
      if (selector === '.soft-shadow') return [];
      return [];
    },
  },
};

vm.createContext(context);
vm.runInContext(scripts, context);

assert.equal(typeof context.window.applyAppSearchFilter, 'function');
context.window.applyAppSearchFilter('coffee');
assert.equal(cards[0].hidden, true, 'non-matching cards are hidden');
assert.equal(cards[1].hidden, true, 'non-matching cards are hidden');
assert.equal(cards[2].hidden, false, 'matching card remains visible');

context.window.applyAppSearchFilter('');
assert.deepEqual(cards.map((card) => card.hidden), [false, false, false], 'empty search shows all cards');

input.value = 'timer';
listeners.input();
assert.deepEqual(cards.map((card) => card.hidden), [true, false, true], 'typing filters cards');
