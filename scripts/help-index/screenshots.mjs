// Screenshot catalog for the docs copilot: id → published PNG, alt text, and
// the docs pages that show it.
//
// Ids follow howto-recipes/AGENTS.md: the capture-script `SHOTS` name, which
// is also the file basename. When two folders publish the same basename
// (public/assets/web/presets-list.png and public/assets/device/presets-list.png)
// the Web UI capture keeps the bare id and the other becomes
// `<folder>-<basename>`.

const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif)$/i;

/** `SHOTS` from capture-web-screenshots.mjs → [{ name, route }]. */
export function parseWebShots(source) {
  return [...source.matchAll(/name:\s*'([^']+)',\s*path:\s*'([^']*)'/g)].map((m) => ({
    name: m[1],
    route: `/op${m[2]}`,
  }));
}

/** `SHOTS` from capture-uno-screenshots.mjs → [{ name, screen }]. */
export function parseUnoShots(source) {
  return [...source.matchAll(/screen:\s*'([^']*)',\s*name:\s*'([^']+)'/g)].map((m) => ({
    name: m[2],
    screen: m[1],
  }));
}

export function normalizeId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function humanize(base) {
  const words = base.replace(/[-_]+/g, ' ').trim();
  return words ? words[0].toUpperCase() + words.slice(1) : base;
}

/**
 * @param {object} input
 * @param {{ url: string, folder: string, fileName: string }[]} input.files  published images, url like /assets/web/x.png
 * @param {{ url: string, alt: string, slug: string }[]} input.refs          markdown image refs in the indexed pages
 * @param {{ name: string, route: string }[]} input.webShots
 * @param {{ name: string, screen: string }[]} input.unoShots
 */
export function buildCatalog({ files, refs, webShots, unoShots }) {
  const warnings = [];
  const fileByUrl = new Map(files.map((f) => [f.url, f]));
  const referenced = new Set(refs.map((r) => r.url));

  for (const ref of refs) {
    if (ref.url.startsWith('/assets/') && !fileByUrl.has(ref.url)) {
      warnings.push(`${ref.slug}: image ${ref.url} does not exist under public/`);
    }
  }

  // Capture folders are always catalogued; other published images (Pico pin-outs,
  // install photos) only when an indexed page shows them.
  const candidates = files.filter((f) => f.folder === 'web' || f.folder === 'device' || referenced.has(f.url));

  const byBase = new Map();
  for (const file of candidates) {
    const base = normalizeId(file.fileName.replace(IMAGE_EXT_RE, ''));
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(file);
  }

  const idByUrl = new Map();
  for (const [base, group] of byBase) {
    const owner = group.length === 1 ? group[0] : group.find((f) => f.folder === 'web');
    for (const file of group) {
      const id = file === owner ? base : normalizeId(`${file.folder}-${base}`);
      idByUrl.set(file.url, id);
    }
    if (group.length > 1) {
      warnings.push(`screenshot basename "${base}" is published more than once: ${group.map((f) => f.url).join(', ')}`);
    }
  }

  const webShotByName = new Map(webShots.map((s) => [s.name, s]));
  const unoShotByName = new Map(unoShots.map((s) => [s.name, s]));
  const uncapturedWeb = webShots.filter((s) => !fileByUrl.has(`/assets/web/${s.name}.png`)).map((s) => s.name);
  if (uncapturedWeb.length) warnings.push(`web SHOTS without public/assets/web/<name>.png: ${uncapturedWeb.join(', ')}`);
  const uncapturedUno = unoShots.filter((s) => !fileByUrl.has(`/assets/device/${s.name}.png`)).map((s) => s.name);
  if (uncapturedUno.length) warnings.push(`uno SHOTS without public/assets/device/<name>.png: ${uncapturedUno.join(', ')}`);

  const screenshots = [];
  for (const file of candidates) {
    const id = idByUrl.get(file.url);
    const fileRefs = refs.filter((r) => r.url === file.url);
    const alts = [...new Set(fileRefs.map((r) => r.alt).filter(Boolean))];
    const pages = [...new Set(fileRefs.map((r) => r.slug))];
    const base = file.fileName.replace(IMAGE_EXT_RE, '');

    let capture = null;
    if (file.folder === 'web' && webShotByName.has(base)) capture = { tool: 'web', route: webShotByName.get(base).route };
    if (file.folder === 'device' && unoShotByName.has(base)) capture = { tool: 'touchscreen', screen: unoShotByName.get(base).screen };

    screenshots.push({
      id,
      url: file.url,
      folder: file.folder,
      alt: alts[0] ?? humanize(base),
      altVariants: alts.slice(1),
      pages,
      capture,
    });
  }
  screenshots.sort((a, b) => a.id.localeCompare(b.id));

  return {
    screenshots,
    resolve: (url) => idByUrl.get(url) ?? null,
    warnings,
  };
}
