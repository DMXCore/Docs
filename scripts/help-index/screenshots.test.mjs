import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildCatalog, parseUnoShots, parseWebShots } from './screenshots.mjs';

test('parses SHOTS entries, including ones with comments and hooks', () => {
  const source = `const SHOTS = [
    { name: 'dashboard', path: '' },
    {
      // comment
      name: 'timeline-timecode-chase',
      path: '/timelines/editor/2',
      before: async (page) => {},
    },
  ];`;
  assert.deepEqual(parseWebShots(source), [
    { name: 'dashboard', route: '/op' },
    { name: 'timeline-timecode-chase', route: '/op/timelines/editor/2' },
  ]);
  assert.deepEqual(parseUnoShots(`{ screen: 'settings/inputs', name: 'uno-inputs' }`), [
    { name: 'uno-inputs', screen: 'settings/inputs' },
  ]);
});

test('the real capture scripts still parse (guards the SHOTS regex)', () => {
  const web = parseWebShots(readFileSync(new URL('../capture-web-screenshots.mjs', import.meta.url), 'utf8'));
  const uno = parseUnoShots(readFileSync(new URL('../capture-uno-screenshots.mjs', import.meta.url), 'utf8'));
  assert.ok(web.length >= 40, `web SHOTS parsed: ${web.length}`);
  assert.ok(uno.length >= 10, `uno SHOTS parsed: ${uno.length}`);
  assert.ok(web.some((s) => s.name === 'add-fixture-profile' && s.route === '/op/fixturesettings/0'));
});

test('catalog ids, collisions, capture info, alt text and warnings', () => {
  const files = [
    { url: '/assets/web/presets-list.png', folder: 'web', fileName: 'presets-list.png' },
    { url: '/assets/device/presets-list.png', folder: 'device', fileName: 'presets-list.png' },
    { url: '/assets/device/uno-inputs.png', folder: 'device', fileName: 'uno-inputs.png' },
    { url: '/assets/web/add-fixture-profile.png', folder: 'web', fileName: 'add-fixture-profile.png' },
    { url: '/assets/IMG_3118.JPEG', folder: '', fileName: 'IMG_3118.JPEG' },
    { url: '/assets/Unused.png', folder: '', fileName: 'Unused.png' },
  ];
  const refs = [
    { url: '/assets/device/presets-list.png', alt: 'Presets list', slug: 'dmx-core-100/playback/presets' },
    { url: '/assets/device/uno-inputs.png', alt: 'Inputs on the touchscreen', slug: 'dmx-core-100/lighting/stream-routing' },
    { url: '/assets/IMG_3118.JPEG', alt: 'Box', slug: 'dmx-core-100/getting-started/installation' },
    { url: '/assets/web/missing.png', alt: 'Missing', slug: 'dmx-core-100/x' },
  ];
  const webShots = [
    { name: 'presets-list', route: '/op/presets' },
    { name: 'add-fixture-profile', route: '/op/fixturesettings/0' },
    { name: 'never-captured', route: '/op/nope' },
  ];
  const unoShots = [{ name: 'uno-inputs', screen: 'settings/inputs' }];

  const catalog = buildCatalog({ files, refs, webShots, unoShots });
  const byId = Object.fromEntries(catalog.screenshots.map((s) => [s.id, s]));

  assert.deepEqual(Object.keys(byId).sort(), ['add-fixture-profile', 'device-presets-list', 'img-3118', 'presets-list', 'uno-inputs']);
  assert.equal(catalog.resolve('/assets/device/presets-list.png'), 'device-presets-list');
  assert.equal(catalog.resolve('/assets/web/presets-list.png'), 'presets-list');
  assert.deepEqual(byId['presets-list'].capture, { tool: 'web', route: '/op/presets' });
  assert.deepEqual(byId['uno-inputs'].capture, { tool: 'touchscreen', screen: 'settings/inputs' });
  assert.equal(byId['add-fixture-profile'].alt, 'Add fixture profile');
  assert.deepEqual(byId['uno-inputs'].pages, ['dmx-core-100/lighting/stream-routing']);
  assert.ok(catalog.warnings.some((w) => w.includes('/assets/web/missing.png')));
  assert.ok(catalog.warnings.some((w) => w.includes('never-captured')));
  assert.ok(catalog.warnings.some((w) => w.includes('"presets-list" is published more than once')));
});
