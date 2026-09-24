// Chunks a Starlight markdown page by heading for the docs copilot index.
//
// One chunk per H2 and per H3 (plus the intro before the first H2). Each chunk
// keeps its heading path, the anchor Starlight renders for that heading, and
// the screenshot ids referenced inside it. Image refs are replaced in the text
// by `[screenshot: id - alt]` markers so the model sees which picture belongs
// to which paragraph.

import GithubSlugger from 'github-slugger';

const IMAGE_RE = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE_RE = /^\s*(`{3,}|~{3,})/;
const ASIDE_OPEN_RE = /^:::(\w+)(?:\[(.*)\])?\s*$/;
const ASIDE_CLOSE_RE = /^:::\s*$/;

export const DEFAULT_MAX_CHUNK_CHARS = 6000;

export function pageUrl(slug) {
  return `/${slug}/`;
}

/** Rendered text of a heading line, as Astro feeds it to the slugger. */
export function headingText(raw) {
  return raw
    .replace(IMAGE_RE, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(.+?)\1/g, '$2')
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1')
    .trim();
}

/** Calls `visit(line, inFence)` for every line, tracking fenced code blocks. */
function eachLine(body, visit) {
  let fence = null;
  for (const line of body.split('\n')) {
    const m = FENCE_RE.exec(line);
    if (fence) {
      const closes = m && m[1][0] === fence[0] && m[1].length >= fence.length && line.trim() === m[1];
      visit(line, true);
      if (closes) fence = null;
      continue;
    }
    if (m) {
      fence = m[1];
      visit(line, true);
      continue;
    }
    visit(line, false);
  }
}

/** Image references outside code fences: [{ url, alt }]. */
export function findImages(body) {
  const images = [];
  eachLine(body, (line, inFence) => {
    if (inFence) return;
    for (const m of line.matchAll(IMAGE_RE)) images.push({ alt: m[1].trim(), url: m[2] });
  });
  return images;
}

/**
 * @param {object} page
 * @param {string} page.slug
 * @param {string} page.title
 * @param {string} page.body   markdown without frontmatter
 * @param {(url: string) => string | null} [page.resolveImage]  image url → screenshot id
 * @param {number} [page.maxChars]
 * @returns {{ headings: {depth:number,text:string,anchor:string}[], chunks: object[] }}
 */
export function chunkPage({ slug, title, body, resolveImage = () => null, maxChars = DEFAULT_MAX_CHUNK_CHARS }) {
  const slugger = new GithubSlugger();
  const headings = [];
  const sections = [];
  let current = { depth: 1, heading: null, anchor: null, lines: [] };
  let lastH2 = null;

  eachLine(body, (line, inFence) => {
    const h = inFence ? null : HEADING_RE.exec(line);
    if (!h) {
      current.lines.push(inFence ? line : cleanLine(line, resolveImage));
      return;
    }

    const depth = h[1].length;
    const text = headingText(h[2]);
    let anchor = slugger.slug(text);
    if (anchor.endsWith('-')) anchor = anchor.slice(0, -1);
    headings.push({ depth, text, anchor });

    if (depth !== 2 && depth !== 3) {
      current.lines.push(cleanLine(line, resolveImage));
      return;
    }

    sections.push(current);
    if (depth === 2) lastH2 = text;
    const path = depth === 2 || !lastH2 ? [title, text] : [title, lastH2, text];
    current = { depth, heading: text, anchor, path, lines: [`${h[1]} ${text}`] };
  });
  sections.push(current);

  const chunks = [];
  for (const section of sections) {
    const text = tidy(section.lines.join('\n'));
    if (!text) continue;

    const baseId = section.anchor ? `${slug}#${section.anchor}` : slug;
    const url = pageUrl(slug) + (section.anchor ? `#${section.anchor}` : '');
    const parts = splitLong(text, maxChars);
    parts.forEach((part, i) => {
      chunks.push({
        id: i === 0 ? baseId : `${baseId}~${i + 1}`,
        slug,
        url,
        anchor: section.anchor,
        depth: section.depth,
        headingPath: section.path ?? [title],
        text: part,
        screenshots: screenshotIds(part),
      });
    });
  }

  return { headings, chunks };
}

function cleanLine(line, resolveImage) {
  const aside = ASIDE_OPEN_RE.exec(line);
  if (aside) {
    const kind = aside[1][0].toUpperCase() + aside[1].slice(1);
    return aside[2] ? `**${kind} - ${aside[2]}:**` : `**${kind}:**`;
  }
  if (ASIDE_CLOSE_RE.test(line)) return '';

  return line.replace(IMAGE_RE, (_, alt, url) => {
    const id = resolveImage(url);
    const label = alt.trim();
    if (!id) return label ? `[image: ${label}]` : '';
    return label ? `[screenshot: ${id} - ${label}]` : `[screenshot: ${id}]`;
  });
}

function tidy(text) {
  return text.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
}

function screenshotIds(text) {
  const ids = new Set();
  for (const m of text.matchAll(/\[screenshot: ([a-z0-9][a-z0-9-]*)/g)) ids.add(m[1]);
  return [...ids];
}

const TABLE_DIVIDER_RE = /^\s*\|?[\s:|-]+\|?\s*$/;

/**
 * Splits on blank lines so no part exceeds maxChars. A block with no blank
 * lines (a long list or table) falls back to line boundaries, and a split
 * table repeats its header row in every part. Only a single line longer than
 * maxChars is left whole.
 */
function splitLong(text, maxChars) {
  if (text.length <= maxChars) return [text];

  const pieces = [];
  for (const paragraph of text.split(/\n\n/)) {
    if (paragraph.length <= maxChars) {
      pieces.push({ text: paragraph, sep: '\n\n' });
      continue;
    }

    const lines = paragraph.split('\n');
    const isTable = lines.length > 2 && lines[0].trimStart().startsWith('|') && TABLE_DIVIDER_RE.test(lines[1]);
    if (isTable) {
      const header = `${lines[0]}\n${lines[1]}`;
      pieces.push({ text: header, sep: '\n\n', isHeader: true });
      for (const row of lines.slice(2)) pieces.push({ text: row, sep: '\n', header });
    } else {
      lines.forEach((line, i) => pieces.push({ text: line, sep: i === 0 ? '\n\n' : '\n' }));
    }
  }

  const parts = [];
  let buffer = '';
  let last = null;
  for (const piece of pieces) {
    if (buffer && buffer.length + piece.sep.length + piece.text.length > maxChars) {
      // Never leave a table header dangling at the end of a part.
      const flushed = last?.isHeader ? buffer.slice(0, -last.text.length).trimEnd() : buffer;
      if (flushed) parts.push(flushed);
      buffer = piece.header ? `${piece.header}\n${piece.text}` : piece.text;
    } else {
      buffer = buffer ? `${buffer}${piece.sep}${piece.text}` : piece.text;
    }
    last = piece;
  }
  if (buffer) parts.push(buffer);

  return parts;
}
