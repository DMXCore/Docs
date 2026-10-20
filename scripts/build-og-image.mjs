// Builds the default social card at public/og/dmx-core.png (1200×630).
//
// Artwork is the official horizontal lockup, src/assets/og/logo-horizontal-transparent.png
// (mark plus "DMX Core"). The companion mark is src/assets/og/original-logo-transparent.svg.
// The wordmark ink is #2F2E2E, so the card field is light enough to read it. The file is
// composited as-is: no recoloring, which is what painted white into the previous card.
// Run: node scripts/build-og-image.mjs

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public/og/dmx-core.png');

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
// Light field. The official wordmark is #2F2E2E, which disappears on the site's charcoal.
const BACKGROUND = '#f4f5f6';

const logo = await sharp(join(root, 'src/assets/og/logo-horizontal-transparent.png'))
  .resize({ width: 960, height: 420, fit: 'inside' })
  .png()
  .toBuffer();

const background = Buffer.from(
  `<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${BACKGROUND}"/></svg>`,
);

mkdirSync(dirname(out), { recursive: true });
await sharp(background)
  .composite([{ input: logo, gravity: 'center' }])
  .flatten({ background: BACKGROUND })
  .removeAlpha()
  .png()
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`Wrote ${out} (${meta.width}x${meta.height})`);
