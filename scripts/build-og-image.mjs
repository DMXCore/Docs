// Builds the default social card at public/og/dmx-core.png (1200×630).
//
// The mark and "DMX Core" wordmark come from src/assets/logo.png. That file is
// dark ink for a light page, so the ink is lifted to the site's light text
// color and placed on the charcoal background used by dmxcore.com
// (--charcoal-darkest / --text-primary). The cyan in the mark is left as-is.
// Run: node scripts/build-og-image.mjs

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public/og/dmx-core.png');

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const BACKGROUND = '#141313';
const INK = [0xf0, 0xf0, 0xf0];

const { data, info } = await sharp(join(root, 'src/assets/logo.png'))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = Buffer.from(data);
for (let i = 0; i < pixels.length; i += 4) {
  const red = pixels[i];
  const green = pixels[i + 1];
  const blue = pixels[i + 2];
  const alpha = pixels[i + 3];
  if (alpha === 0) continue;
  // Keep the cyan chevrons; the wordmark and dark faces of the mark become light ink.
  const cyan = blue > 80 && blue > red + 25 && green > red + 10;
  if (!cyan) {
    pixels[i] = INK[0];
    pixels[i + 1] = INK[1];
    pixels[i + 2] = INK[2];
  }
}

const logo = await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .resize({ width: 860, height: 420, fit: 'inside' })
  .png()
  .toBuffer();

const background = Buffer.from(
  `<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${BACKGROUND}"/></svg>`,
);

mkdirSync(dirname(out), { recursive: true });
await sharp(background)
  .composite([{ input: logo, gravity: 'center' }])
  .png()
  .toFile(out);

console.log(`Wrote ${out}`);
