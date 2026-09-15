// Writes the docs copilot corpus index (chunks + screenshot catalog).
//
// Runs after `astro build` so the file ships with the site:
//   node scripts/build-help-index.mjs [--out dist/help-index.json] [--site https://docs.dmxcore.com]
//
// The help API loads it from https://docs.dmxcore.com/help-index.json (or a
// local path in development). See scripts/README.md.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildIndex } from './help-index/build-index.mjs';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};

const out = resolve(REPO, getArg('out', 'dist/help-index.json'));
const site = getArg('site', 'https://docs.dmxcore.com');

const { index, warnings } = buildIndex({ repoRoot: REPO, site });

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(index));

for (const warning of warnings) console.warn(`  ! ${warning}`);
console.log(
  `Help index: ${index.pages.length} pages, ${index.chunks.length} chunks, ` +
    `${index.screenshots.length} screenshots → ${out}`,
);
