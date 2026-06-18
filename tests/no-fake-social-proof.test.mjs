import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pages = [
  'index.html',
  'sentences/index.html',
  'countdowns/index.html',
  'good-habits/index.html',
  'perfect-coffee/index.html',
  'travel-plans/index.html',
  'privacy/index.html',
];

const forbiddenPatterns = [
  /5\.0\s*Rating/i,
  /\b\d+(?:\.\d+)?\s*star(?:s)?\b/i,
  /\b(?:review|testimonial)\b/i,
  /\b(?:joined by|join over|join thousands|thousands of|happy learners|happy families)\b/i,
  /\b(?:50,000|10,000|4,000|\+4k)\b/i,
  /\b(?:98%|85%|92%)\b/,
  /\b(?:Success Rate|Retention Rate)\b/i,
  /\b(?:James H\.|Sarah Jenkins|Barista|Travel Blogger|Mother of)\b/i,
  /\b(?:world-class|life-changing)\b/i,
];

for (const page of pages) {
  const html = readFileSync(new URL(`../${page}`, import.meta.url), 'utf8');
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(visibleText, pattern, `${page} contains fake social proof: ${pattern}`);
  }
}

