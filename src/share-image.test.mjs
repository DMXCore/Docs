import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { resolveShareImage } from './share-image.mjs';

const site = 'https://docs.dmxcore.com';
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

test('scene panel uses its own screenshot', () => {
  const raw = readFileSync(
    new URL('./content/docs/dmx-core-100/lighting/scene-panel.md', import.meta.url),
    'utf8',
  );
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const share = resolveShareImage({ body, site, publicDir });
  assert.equal(share.url, 'https://docs.dmxcore.com/assets/web/scene-panel.png');
  assert.equal(share.width, 2880);
  assert.equal(share.height, 1800);
  assert.equal(share.emitOg, true);
  assert.equal(share.emitTwitter, true);
  assert.ok(share.width > 0 && share.height > 0);
});

test('a page with no image uses the site card', () => {
  const raw = readFileSync(
    new URL('./content/docs/dmx-core-100/basics/navigation.md', import.meta.url),
    'utf8',
  );
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const share = resolveShareImage({ body, site, publicDir });
  assert.equal(share.url, 'https://docs.dmxcore.com/og/dmx-core.png');
  assert.equal(share.width, 1200);
  assert.equal(share.height, 630);
});

test('jpeg page images report their pixel size', () => {
  const share = resolveShareImage({
    body: '![enclosure](/assets/dmx-core-poe-control/enclosure.jpg)',
    site,
    publicDir,
  });
  assert.equal(share.url, 'https://docs.dmxcore.com/assets/dmx-core-poe-control/enclosure.jpg');
  assert.equal(share.width, 1600);
  assert.equal(share.height, 888);
  assert.ok(share.width > 0 && share.height > 0);
});

test('hero image overrides the first picture in the page', () => {
  const share = resolveShareImage({
    data: { hero: { image: { file: { src: '/_astro/cover.png', width: 1200, height: 630 } } } },
    body: '![Scenes](/assets/web/scene-panel.png)',
    site,
    publicDir,
  });
  assert.equal(share.url, 'https://docs.dmxcore.com/_astro/cover.png');
  assert.equal(share.width, 1200);
  assert.equal(share.height, 630);
});

test('frontmatter head image is kept and mirrored to twitter', () => {
  const share = resolveShareImage({
    data: {
      head: [{ tag: 'meta', attrs: { property: 'og:image', content: '/assets/web/dashboard.png' } }],
      hero: { image: { file: { src: '/_astro/cover.png', width: 10, height: 10 } } },
    },
    body: '![Scenes](/assets/web/scene-panel.png)',
    site,
    publicDir,
  });
  assert.equal(share.url, 'https://docs.dmxcore.com/assets/web/dashboard.png');
  assert.equal(share.emitOg, false);
  assert.equal(share.emitTwitter, true);
  assert.equal(share.emitWidth, true);
  assert.ok(share.width > 0 && share.height > 0);
});

test('an external badge is not the share image', () => {
  const share = resolveShareImage({
    body: '[![Snap](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/dmxcore100)\n',
    site,
    publicDir,
  });
  assert.equal(share.url, 'https://docs.dmxcore.com/og/dmx-core.png');
});

test('images inside code fences are ignored', () => {
  const share = resolveShareImage({
    body: '```\n![nope](/assets/web/login.png)\n```\n\nNo picture after that.\n',
    site,
    publicDir,
  });
  assert.equal(share.url, 'https://docs.dmxcore.com/og/dmx-core.png');
});

test('a path that climbs out of public/ does not supply dimensions', () => {
  const share = resolveShareImage({
    body: '![x](/assets/../../package.json.png)',
    site,
    publicDir,
  });
  assert.equal(share.url, 'https://docs.dmxcore.com/package.json.png');
  assert.equal(share.width, null);
  assert.equal(share.height, null);
});
