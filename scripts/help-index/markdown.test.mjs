import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chunkPage, findImages, headingText } from './markdown.mjs';

const resolveImage = (url) => ({ '/assets/web/record.png': 'record', '/assets/device/uno-inputs.png': 'uno-inputs' })[url] ?? null;

test('headingText strips inline markdown the way the rendered heading reads', () => {
  assert.equal(headingText('**Bold** and `code` [link](/x/)'), 'Bold and code link');
  assert.equal(headingText('Stop, Blackout and Output Off'), 'Stop, Blackout and Output Off');
});

test('chunks intro, H2 and H3 with Starlight anchors and heading paths', () => {
  const body = [
    'Intro paragraph.',
    '',
    '## Recording in the Web UI',
    '',
    'Go to **Utilities > Record**.',
    '',
    '![Recording page](/assets/web/record.png)',
    '',
    '### Input Sources',
    '',
    'ArtNet and sACN.',
    '',
    '#### Deep detail',
    'Stays in the H3 chunk.',
    '',
    '## Stop, Blackout and Output Off',
    'Text.',
  ].join('\n');

  const { headings, chunks } = chunkPage({ slug: 'dmx-core-100/playback/recording', title: 'Recording', body, resolveImage });

  assert.deepEqual(
    chunks.map((c) => [c.id, c.depth]),
    [
      ['dmx-core-100/playback/recording', 1],
      ['dmx-core-100/playback/recording#recording-in-the-web-ui', 2],
      ['dmx-core-100/playback/recording#input-sources', 3],
      ['dmx-core-100/playback/recording#stop-blackout-and-output-off', 2],
    ],
  );
  assert.deepEqual(chunks[2].headingPath, ['Recording', 'Recording in the Web UI', 'Input Sources']);
  assert.equal(chunks[1].url, '/dmx-core-100/playback/recording/#recording-in-the-web-ui');
  assert.deepEqual(chunks[1].screenshots, ['record']);
  assert.match(chunks[1].text, /\[screenshot: record - Recording page\]/);
  assert.match(chunks[2].text, /#### Deep detail/);
  assert.equal(headings.find((h) => h.depth === 4).anchor, 'deep-detail');
});

test('duplicate headings get -1 suffixes and trailing dashes are dropped', () => {
  const body = '## Settings\na\n## Settings\nb\n## What is new?\nc';
  const { headings } = chunkPage({ slug: 'p', title: 'P', body });
  assert.deepEqual(headings.map((h) => h.anchor), ['settings', 'settings-1', 'what-is-new']);

  const trailing = chunkPage({ slug: 'p', title: 'P', body: '## Q-SYS & Symetrix –\nx' });
  assert.equal(trailing.headings[0].anchor.endsWith('-'), false);
});

test('headings and images inside code fences are ignored', () => {
  const body = ['```bash', '## not a heading', '![x](/assets/web/record.png)', '```', '## Real'].join('\n');
  const { chunks } = chunkPage({ slug: 'p', title: 'P', body, resolveImage });
  assert.deepEqual(chunks.map((c) => c.anchor), [null, 'real']);
  assert.deepEqual(chunks[0].screenshots, []);
  assert.deepEqual(findImages(body), []);
});

test('asides become bold labels and unresolved images keep their alt text', () => {
  const body = ':::tip[No external source handy?]\nUse demo data.\n:::\n\n![Box](https://example.com/x.png)';
  const { chunks } = chunkPage({ slug: 'p', title: 'P', body, resolveImage });
  assert.equal(chunks[0].text, '**Tip - No external source handy?:**\nUse demo data.\n\n[image: Box]');
});

test('oversized sections split on paragraph boundaries', () => {
  const paragraph = 'word '.repeat(200).trim();
  const body = `## Big\n\n${Array(5).fill(paragraph).join('\n\n')}`;
  const { chunks } = chunkPage({ slug: 'p', title: 'P', body, maxChars: 2500 });
  assert.ok(chunks.length > 1);
  assert.equal(chunks[0].id, 'p#big');
  assert.equal(chunks[1].id, 'p#big~2');
  assert.ok(chunks.every((c) => c.anchor === 'big' && c.text.length <= 2500));
});

test('a long list with no blank lines splits on line boundaries', () => {
  const list = Array.from({ length: 300 }, (_, i) => `- Release note item number ${i} with some words`).join('\n');
  const { chunks } = chunkPage({ slug: 'p', title: 'P', body: `## Notes\n${list}`, maxChars: 3000 });
  assert.ok(chunks.length >= 4);
  assert.ok(chunks.every((c) => c.text.length <= 3000));
  assert.ok(chunks.slice(1).every((c) => c.text.startsWith('- Release note item')));
});

test('a split table repeats its header row in every part', () => {
  const rows = Array.from({ length: 200 }, (_, i) => `| v2026.${i} | 9/${i}/2026 | Highlight number ${i} |`);
  const body = `Intro.\n\n| Version | Date | Highlights |\n|---------|------|------------|\n${rows.join('\n')}`;
  const { chunks } = chunkPage({ slug: 'dmx-core-100/release-notes', title: 'Release Notes', body, maxChars: 2000 });
  assert.ok(chunks.length >= 4);
  assert.ok(chunks[0].text.startsWith('Intro.\n\n| Version |'));
  assert.ok(chunks.slice(1).every((c) => c.text.startsWith('| Version | Date | Highlights |\n|---------|')));
  assert.ok(chunks.every((c) => c.text.length <= 2000));
  assert.equal(chunks.map((c) => c.text).join('\n').split('\n').filter((l) => l.startsWith('| v2026.')).length, 200);
});
