// Picks the social image for a docs page and turns it into an absolute URL.
//
// Order:
//   1. og:image / twitter:image already set in frontmatter `head`
//   2. Starlight's hero image (the built-in frontmatter image field)
//   3. The page's first own raster image (a root-relative or same-site png/jpg/…)
//   4. The site-wide card at /og/dmx-core.png

import { readFileSync } from 'node:fs';
import path from 'node:path';

export const DEFAULT_SHARE_IMAGE = '/og/dmx-core.png';

const RASTER = /\.(png|jpe?g|gif|webp|avif)$/i;

/**
 * @param {string | URL} site
 * @param {string} [pageUrl]
 */
function siteHref(site, pageUrl) {
  if (pageUrl) return pageUrl;
  if (site instanceof URL) return site.href;
  return String(site);
}

/**
 * @param {string} src
 * @param {string | URL} base
 */
export function toAbsoluteUrl(src, base) {
  try {
    return new URL(src, base).href;
  } catch {
    return null;
  }
}

/**
 * @param {string} src
 * @param {string | URL} site
 */
function isOwnImage(src, site) {
  if (!src || src.startsWith('data:') || src.startsWith('//')) return false;
  if (src.startsWith('/')) return true;
  try {
    const url = new URL(src);
    const origin = new URL(siteHref(site)).origin;
    return url.origin === origin;
  } catch {
    // Relative to the page (./shot.png) — still this page's own file.
    return true;
  }
}

/**
 * @param {string | undefined} markdown
 * @param {string | URL} site
 * @returns {string | null}
 */
export function firstOwnImage(markdown, site) {
  if (!markdown) return null;
  const text = markdown.replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '');
  /** @type {{ index: number, src: string }[]} */
  const found = [];
  const markdownImage = /!\[[^\]]*]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;
  const htmlImage = /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
  for (const match of text.matchAll(markdownImage)) {
    found.push({ index: match.index ?? 0, src: match[1] });
  }
  for (const match of text.matchAll(htmlImage)) {
    found.push({ index: match.index ?? 0, src: match[1] || match[2] });
  }
  found.sort((a, b) => a.index - b.index);
  for (const image of found) {
    if (!isOwnImage(image.src, site)) continue;
    if (!RASTER.test(image.src.split(/[?#]/, 1)[0])) continue;
    return image.src;
  }
  return null;
}

/**
 * @param {unknown} image Starlight hero.image, or one of its file/light values
 * @returns {{ src: string, width: number | null, height: number | null } | null}
 */
function heroSource(image) {
  if (!image || typeof image !== 'object') return null;
  const record = /** @type {Record<string, unknown>} */ (image);
  if (typeof record.src === 'string') {
    return {
      src: record.src,
      width: numberOrNull(record.width),
      height: numberOrNull(record.height),
    };
  }
  if (record.file) return heroSource(record.file);
  // Crawlers do not switch on color scheme; the light asset is the share image.
  if (record.light) return heroSource(record.light);
  return null;
}

/**
 * @param {unknown} value
 */
function numberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * @param {Array<{ tag?: string, attrs?: Record<string, unknown> }> | undefined} head
 */
function explicitImage(head) {
  if (!head?.length) return null;
  const content = (predicate) => {
    const entry = head.find((item) => item.tag === 'meta' && predicate(item.attrs ?? {}));
    const value = entry?.attrs?.content;
    return typeof value === 'string' && value ? value : null;
  };
  const og = content((attrs) => attrs.property === 'og:image' || attrs.name === 'og:image');
  const twitter = content((attrs) => attrs.name === 'twitter:image' || attrs.property === 'twitter:image');
  if (!og && !twitter) return null;
  return {
    url: og || twitter,
    hasOg: Boolean(og),
    hasTwitter: Boolean(twitter),
    width: content((attrs) => attrs.property === 'og:image:width'),
    height: content((attrs) => attrs.property === 'og:image:height'),
  };
}

/**
 * @param {string} urlPath
 * @param {string} publicDir
 */
export function imageFileInPublic(urlPath, publicDir) {
  let pathname = urlPath.split(/[?#]/, 1)[0];
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (!pathname.startsWith('/') || pathname.includes('\0')) return null;
  const root = path.resolve(publicDir);
  const full = path.resolve(root, pathname.replace(/^\/+/, ''));
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  return full;
}

/**
 * @param {Buffer} buf
 * @returns {{ width: number, height: number } | null}
 */
export function imageSize(buf) {
  if (!buf || buf.length < 10) return null;
  if (buf[0] === 0x89 && buf.toString('ascii', 1, 4) === 'PNG' && buf.toString('ascii', 12, 16) === 'IHDR') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.toString('ascii', 0, 3) === 'GIF') {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) return jpegSize(buf);
  return null;
}

/**
 * @param {Buffer} buf
 */
function jpegSize(buf) {
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    // Standalone markers (no length): SOI, EOI, RSTn, TEM.
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    const length = buf.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > buf.length) return null;
    const sof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (sof) {
      return { width: buf.readUInt16BE(offset + 7), height: buf.readUInt16BE(offset + 5) };
    }
    // Start of scan: compressed data follows, and dimensions would already have been in a SOF.
    if (marker === 0xda) return null;
    offset += 2 + length;
  }
  return null;
}

/**
 * @param {string | null | undefined} absoluteUrl
 * @param {string | URL} site
 * @param {string} publicDir
 */
function sizeForUrl(absoluteUrl, site, publicDir) {
  if (!absoluteUrl) return null;
  let url;
  try {
    url = new URL(absoluteUrl);
  } catch {
    return null;
  }
  if (url.origin !== new URL(siteHref(site)).origin) return null;
  const file = imageFileInPublic(url.pathname, publicDir);
  if (!file) return null;
  try {
    return imageSize(readFileSync(file));
  } catch {
    return null;
  }
}

/**
 * @param {{
 *   data?: { head?: Array<{ tag?: string, attrs?: Record<string, unknown> }>, hero?: { image?: unknown } },
 *   body?: string,
 *   site: string | URL,
 *   publicDir: string,
 *   pageUrl?: string,
 * }} input
 */
export function resolveShareImage({ data = {}, body = '', site, publicDir, pageUrl }) {
  const base = siteHref(site, pageUrl);
  const explicit = explicitImage(data.head);
  const hero = explicit ? null : heroSource(data.hero?.image);
  const content = explicit || hero ? null : firstOwnImage(body, site);
  const raw = explicit?.url || hero?.src || content || DEFAULT_SHARE_IMAGE;
  const url = toAbsoluteUrl(raw, explicit || content ? base : siteHref(site)) ?? toAbsoluteUrl(DEFAULT_SHARE_IMAGE, siteHref(site));
  const fromFile = sizeForUrl(url, site, publicDir);
  const width = explicit?.width ? Number(explicit.width) : hero?.width ?? fromFile?.width ?? null;
  const height = explicit?.height ? Number(explicit.height) : hero?.height ?? fromFile?.height ?? null;
  const knownWidth = Number.isFinite(width) && width > 0 ? width : null;
  const knownHeight = Number.isFinite(height) && height > 0 ? height : null;
  return {
    url,
    width: knownWidth,
    height: knownHeight,
    emitOg: !explicit?.hasOg,
    emitTwitter: !explicit?.hasTwitter,
    emitWidth: knownWidth != null && !explicit?.width,
    emitHeight: knownHeight != null && !explicit?.height,
  };
}
