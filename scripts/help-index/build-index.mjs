// Builds the docs copilot corpus index from the Starlight content.
//
// Output (help-index.json) is published with the site, so the chat API always
// answers from the docs that are live on docs.dmxcore.com — never from UI that
// is not on the site yet.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { splitFrontmatter } from './frontmatter.mjs';
import { chunkPage, findImages, pageUrl } from './markdown.mjs';
import { loadNavigation } from './navigation.mjs';
import { buildCatalog, parseUnoShots, parseWebShots } from './screenshots.mjs';

export const INDEX_FORMAT = 'dmxcore-help-index';
export const INDEX_VERSION = 1;

/** Product sections of src/content/docs that the copilot answers from. */
export const DEFAULT_SECTIONS = ['dmx-core-100'];

function walk(dir, predicate) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(entry.name)) out.push(full);
  }
  return out.sort();
}

function toSlug(contentRoot, file) {
  const rel = relative(contentRoot, file).split(sep).join('/');
  return rel.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '').toLowerCase();
}

function gitCommit(repoRoot) {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function publishedImages(publicRoot) {
  const assets = join(publicRoot, 'assets');
  if (!existsSync(assets)) return [];

  return walk(assets, (name) => /\.(png|jpe?g|webp|gif)$/i.test(name)).map((full) => {
    const rel = relative(publicRoot, full).split(sep).join('/');
    const parts = rel.split('/'); // assets/<folder…>/<file>
    return {
      url: `/${rel}`,
      folder: parts.length > 2 ? parts.slice(1, -1).join('/') : '',
      fileName: parts.at(-1),
    };
  });
}

export function buildIndex({ repoRoot, site = 'https://docs.dmxcore.com', sections = DEFAULT_SECTIONS }) {
  const contentRoot = join(repoRoot, 'src', 'content', 'docs');
  const warnings = [];

  const sources = [];
  for (const section of sections) {
    for (const file of walk(join(contentRoot, section), (name) => /\.mdx?$/.test(name))) {
      const { data, body } = splitFrontmatter(readFileSync(file, 'utf8'));
      const slug = toSlug(contentRoot, file);
      if (!data.title) warnings.push(`${slug}: frontmatter has no title`);
      sources.push({ slug, title: data.title ?? slug, description: data.description ?? null, body });
    }
  }

  const seen = new Set();
  for (const source of sources) {
    if (seen.has(source.slug)) throw new Error(`Duplicate docs slug: ${source.slug}`);
    seen.add(source.slug);
  }

  const refs = sources.flatMap((s) => findImages(s.body).map((img) => ({ ...img, slug: s.slug })));
  const readScript = (name) => {
    const path = join(repoRoot, 'scripts', name);
    return existsSync(path) ? readFileSync(path, 'utf8') : '';
  };
  const webShots = parseWebShots(readScript('capture-web-screenshots.mjs'));
  const unoShots = parseUnoShots(readScript('capture-uno-screenshots.mjs'));
  if (webShots.length === 0) warnings.push('No SHOTS parsed from scripts/capture-web-screenshots.mjs');
  if (unoShots.length === 0) warnings.push('No SHOTS parsed from scripts/capture-uno-screenshots.mjs');

  const catalog = buildCatalog({ files: publishedImages(join(repoRoot, 'public')), refs, webShots, unoShots });
  warnings.push(...catalog.warnings);

  const pages = [];
  const chunks = [];
  for (const source of sources) {
    const { headings, chunks: pageChunks } = chunkPage({
      slug: source.slug,
      title: source.title,
      body: source.body,
      resolveImage: catalog.resolve,
    });
    pages.push({
      slug: source.slug,
      url: pageUrl(source.slug),
      title: source.title,
      description: source.description,
      headings,
      chunkIds: pageChunks.map((c) => c.id),
    });
    chunks.push(...pageChunks);
  }

  // Optional in version 1: help APIs that predate it ignore the field.
  const navigation = loadNavigation(repoRoot, warnings);

  return {
    index: {
      format: INDEX_FORMAT,
      version: INDEX_VERSION,
      site,
      builtAt: new Date().toISOString(),
      commit: gitCommit(repoRoot),
      pages,
      chunks,
      screenshots: catalog.screenshots,
      navigation,
    },
    warnings,
  };
}
