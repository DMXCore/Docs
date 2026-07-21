// Unattended Web UI screenshot capture for the DMX Core 100 documentation.
//
// Drives the locally-installed Chrome (headless) via puppeteer-core — no browser
// download, no control of the desktop. Logs in through the device API, forces the
// dark theme, then visits each documented page and writes a PNG to
// public/assets/web/.
//
// Usage:
//   node scripts/capture-web-screenshots.mjs [--base http://localhost:8080] [--pin 1111] [--light]
//
// Prereqs: the DMX Core 100 app (or desktop software) running and reachable at
// --base, with the documentation sample content loaded.

import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');

// ---- args -----------------------------------------------------------------
const args = process.argv.slice(2);
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const BASE = getArg('base', 'http://localhost:8080').replace(/\/$/, '');
const PIN = getArg('pin', '1111');
const USER_ID = Number(getArg('user', '1'));
const THEME = args.includes('--light') ? 'light' : 'dark';
const ONLY = getArg('only', null); // capture a single shot by name
const OUT = join(REPO, 'public', 'assets', 'web');

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
];
const chromePath =
  process.env.CHROME_PATH || CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error('Could not find Chrome. Set CHROME_PATH to the executable.');
  process.exit(1);
}

// ---- shot list ------------------------------------------------------------
// Each shot: { name, path, waitFor?, before?, fullPage? }
//  - path is appended to `${BASE}/op`
//  - waitFor: extra CSS selector/text to wait for before the shot
//  - before: async (page) => {}  runs after nav, before the screenshot
//    (e.g. click a row, open the editor). Keep these resilient.
const SHOTS = [
  // Dashboard & navigation
  { name: 'dashboard', path: '' },
  // Lighting
  { name: 'presets-list', path: '/presets' },
  { name: 'preset-editor', path: '/presets/7' },
  { name: 'effects-list', path: '/effects' },
  { name: 'cues-list', path: '/cues' },
  { name: 'cue-editor', path: '/cues/2' },
  { name: 'sounds-list', path: '/sounds' },
  { name: 'timelines-list', path: '/timelines' },
  { name: 'fixture-control', path: '/fixturecontrol' },
  { name: 'timeline-editor', path: '/timelines/editor/1', waitFor: 'canvas, svg, .timeline' },
  // Operation
  { name: 'surface-operator-list', path: '/surface-operator' },
  { name: 'surface-operator', path: '/controlsurfaces/1/operator' },
  { name: 'tempo', path: '/tempo' },
  { name: 'ambient-presets', path: '/ambient' },
  { name: 'favorites', path: '/favorites' },
  { name: 'custom-menu-operate', path: '/custommenu' },
  // Lighting setup
  { name: 'outputs-list', path: '/outputs' },
  { name: 'output-editor', path: '/outputs/1' },
  { name: 'fixtures-list', path: '/fixturesettings' },
  { name: 'fixture-editor', path: '/fixturesettings/1' },
  { name: 'zones-list', path: '/zones' },
  { name: 'protocol', path: '/settings/PROTOCOL' },
  // Control & integrations
  { name: 'input-triggers-list', path: '/inputtriggers' },
  { name: 'input-trigger-editor', path: '/inputtriggers/1' },
  { name: 'output-events-list', path: '/outputevents' },
  { name: 'control-surfaces-list', path: '/controlsurfaces' },
  { name: 'control-surface-new', path: '/controlsurfaces/new' },
  { name: 'control-surface-editor', path: '/controlsurfaces/1' },
  { name: 'control-values-list', path: '/controlvalues' },
  { name: 'control-value-editor', path: '/controlvalues/3' },
  { name: 'osc-clients-list', path: '/oscclients' },
  { name: 'mqtt-settings', path: '/settings/MQTT' },
  { name: 'scripts-list', path: '/scripts' },
  { name: 'script-editor', path: '/scripts/1' },
  { name: 'custom-menu-editor', path: '/custommenus/1' },
  { name: 'plugins-settings', path: '/settings/PLUGINS' },
  // Device
  { name: 'system-settings', path: '/settings/SYSTEM' },
  { name: 'touchscreen-settings', path: '/settings/PREFERENCES' },
  { name: 'custom-menus-list', path: '/custommenus' },
  // Utilities
  { name: 'audit-log', path: '/utilities/auditlog' },
  { name: 'device-monitor', path: '/device-monitor' },
  { name: 'output-monitor', path: '/utilities/outputmonitor' },
  { name: 'record', path: '/utilities/record' },
  // Backup / users
  { name: 'backup-restore', path: '/backuprestore' },
  { name: 'users-list', path: '/users' },
  { name: 'schedules-list', path: '/schedules' },
  { name: 'schedule-editor', path: '/schedules/1' },
];

// ---- helpers --------------------------------------------------------------
async function login() {
  const res = await fetch(`${BASE}/api/website/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: USER_ID, pin: PIN }),
  });
  const body = await res.json();
  const d = body?.data;
  if (!d?.token) throw new Error(`Login failed: ${JSON.stringify(body)}`);
  return d;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  mkdirSync(OUT, { recursive: true });
  const auth = await login();
  console.log(`Logged in as ${auth.user?.name} — capturing ${THEME} theme`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--force-color-profile=srgb', '--hide-scrollbars'],
  });
  const page = await browser.newPage();

  // Seed auth + theme into localStorage on the app origin before the SPA boots.
  await page.goto(`${BASE}/op`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(
    (auth, theme) => {
      localStorage.setItem('userId', String(auth.user.userId));
      localStorage.setItem('userName', auth.user.name);
      localStorage.setItem('token', auth.token);
      localStorage.setItem('tokenExpires', auth.tokenExpires ?? '');
      localStorage.setItem('permissions', JSON.stringify(auth.permissions ?? []));
      localStorage.setItem('authMethod', auth.authMethod ?? 'PIN');
      localStorage.setItem('coreuiTheme', theme); // CoreUI persisted color mode
    },
    auth,
    THEME,
  );

  const shots = ONLY ? SHOTS.filter((s) => s.name === ONLY) : SHOTS;
  let ok = 0;
  for (const shot of shots) {
    const url = `${BASE}/op${shot.path}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      // Ensure the theme attribute is applied even if the SPA re-derived it.
      await page.evaluate((theme) => {
        document.documentElement.setAttribute('data-coreui-theme', theme);
      }, THEME);
      // Guard against the SPA's 404 page — a wrong route must never save a shot.
      const notFound = await page.evaluate(() =>
        /Oops! You're lost/i.test(document.body?.innerText || ''),
      );
      if (notFound) {
        console.warn(`  ✗ ${shot.name}  (${url})  — 404 page (route not found)`);
        continue;
      }
      if (shot.waitFor) {
        await page.waitForSelector(shot.waitFor, { timeout: 8000 }).catch(() => {});
      }
      if (shot.before) await shot.before(page);
      // Drop focus rings / hover highlights and park the cursor out of frame.
      await page.mouse.move(2, 2);
      await page.evaluate(() => {
        document.activeElement?.blur?.();
        document.querySelectorAll(':focus').forEach((el) => el.blur?.());
        window.getSelection?.()?.removeAllRanges?.();
      });
      await sleep(700); // let fades / charts settle
      const file = join(OUT, `${shot.name}.png`);
      await page.screenshot({ path: file });
      console.log(`  ✓ ${shot.name}  ←  ${shot.path || '/'}`);
      ok++;
    } catch (err) {
      console.warn(`  ✗ ${shot.name}  (${url})  — ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone: ${ok}/${shots.length} shots → public/assets/web/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
