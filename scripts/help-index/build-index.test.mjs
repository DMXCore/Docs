// Integration check over the real content tree: the index must be internally
// consistent, or the chat API would cite anchors and screenshots that 404.

import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { buildIndex, INDEX_FORMAT } from './build-index.mjs';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const { index } = buildIndex({ repoRoot });

test('index header', () => {
  assert.equal(index.format, INDEX_FORMAT);
  assert.equal(index.site, 'https://docs.dmxcore.com');
  assert.ok(index.pages.length >= 90, `pages: ${index.pages.length}`);
});

test('every page chunk id and chunk screenshot id resolves', () => {
  const chunkIds = new Set(index.chunks.map((c) => c.id));
  const screenshotIds = new Set(index.screenshots.map((s) => s.id));
  assert.equal(chunkIds.size, index.chunks.length, 'chunk ids are unique');
  for (const page of index.pages) {
    for (const id of page.chunkIds) assert.ok(chunkIds.has(id), `${page.slug} → ${id}`);
  }
  for (const chunk of index.chunks) {
    for (const id of chunk.screenshots) assert.ok(screenshotIds.has(id), `${chunk.id} → ${id}`);
    if (chunk.anchor) {
      const page = index.pages.find((p) => p.slug === chunk.slug);
      assert.ok(page.headings.some((h) => h.anchor === chunk.anchor), `${chunk.id} anchor`);
    }
  }
});

test('gold-path pages are indexed with their screenshots', () => {
  const recording = index.chunks.find((c) => c.id === 'dmx-core-100/playback/recording#recording-in-the-web-ui');
  assert.ok(recording, 'recording web UI section');
  assert.deepEqual(recording.screenshots, ['record']);

  const routing = index.chunks.find((c) => c.id === 'dmx-core-100/lighting/stream-routing#setting-it-up');
  assert.ok(routing.screenshots.includes('inputs'));

  assert.ok(index.pages.some((p) => p.url === '/dmx-core-100/lighting/fixture-setup/'));
  assert.ok(index.screenshots.some((s) => s.id === 'add-fixture-profile' && s.capture?.route === '/op/fixturesettings/0'));
});
