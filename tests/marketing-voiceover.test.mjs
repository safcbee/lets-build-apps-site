import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const voiceover = JSON.parse(readFileSync(new URL('../marketing/voiceover.json', import.meta.url), 'utf8'));

test('brand narration is pinned to the approved reproducible voice', () => {
  assert.deepEqual(voiceover, {
    schemaVersion: 1,
    approvedAt: '2026-08-12',
    provider: 'ElevenLabs via Abacus AI',
    voiceName: 'Alice',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2',
    submodel: 'multilingual',
    locale: 'en-GB',
    direction: 'Warm, contemporary British female; conversational, calm and confident; never theatrical, posh or announcer-like.',
    keychain: {
      service: 'abacus-ai-api',
      account: 'letsbuildappshq',
    },
  });
});
