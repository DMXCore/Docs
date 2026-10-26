// Unattended Web UI screenshot capture for the DMX Core 100 documentation.
//
// Drives the locally-installed Chrome (headless) via puppeteer-core - no browser
// download, no control of the desktop. Logs in through the device API, forces the
// dark theme, then visits each documented page and writes a PNG to
// public/assets/web/.
//
// Usage:
//   node scripts/capture-web-screenshots.mjs [--base http://localhost:8080] [--api http://localhost:8000] [--pin 1111] [--light]
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
const API = getArg('api', BASE).replace(/\/$/, '');
const PIN = getArg('pin', '1111');
const USER_ID = Number(getArg('user', '1'));
const THEME = args.includes('--light') ? 'light' : 'dark';
const ONLY = getArg('only', null); // comma-separated shot names
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
// Each shot: { name, path, waitFor?, before?, fullPage?, selector? }
//  - path is appended to `${BASE}/op`
//  - waitFor: extra CSS selector/text to wait for before the shot
//  - before: async (page) => {}  runs after nav, before the screenshot
//    (e.g. click a row, open the editor). Keep these resilient.
//  - selector: screenshot that element instead of the full viewport
const SHOTS = [
  // Dashboard & navigation
  { name: 'dashboard', path: '' },
  // Lighting
  { name: 'presets-list', path: '/presets' },
  { name: 'preset-editor', path: '/presets/7' },
  { name: 'effects-list', path: '/effects' },
  { name: 'cues-list', path: '/cues' },
  { name: 'cue-editor', path: '/cues/2', fullPage: true },
  {
    // The Compress confirmation with its requirements notice; needs a cue that is
    // stored plain (the button reads Decompress otherwise).
    name: 'cue-compress-dialog',
    path: '/cues/3',
    waitFor: 'button',
    before: async (page) => {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(
          (b) => b.textContent.trim() === 'Compress',
        );
        btn?.click();
      });
      await page.waitForSelector('.modal.show, .modal.d-block, .modal', { timeout: 5000 });
      await sleep(400);
    },
    selector: '.modal-dialog',
  },
  { name: 'sounds-list', path: '/sounds' },
  { name: 'timelines-list', path: '/timelines' },
  {
    // Fixture Control with the Bar zone checked (zone All), so the pane drives the
    // whole selection and shows Mixed where the fixtures differ
    name: 'fixture-control',
    path: '/fixturecontrol',
    waitFor: '.zone-header',
    before: async (page) => {
      await page.evaluate(() => {
        const header = [...document.querySelectorAll('.zone-header')].find(
          (h) => h.textContent.includes('Bar'),
        );
        header?.querySelector('.zone-sel-btn')?.click();
      });
      await sleep(400);
      await page.evaluate(() => {
        const header = [...document.querySelectorAll('.zone-header')].find(
          (h) => h.textContent.includes('Bar'),
        );
        header?.scrollIntoView({ block: 'start' });
      });
      await sleep(600);
    },
  },
  {
    // Scenes page (sidebar version of the Scene Panel) with a scene applied so the
    // dock shows the wheel and dimmer. The tile tap goes to the device; the scene
    // stays active afterwards.
    name: 'scene-panel',
    path: '/scenepanel',
    waitFor: '.scene-tile, .adjust-dock',
    before: async (page) => {
      await page.evaluate(() => {
        const tile = [...document.querySelectorAll('.scene-grid button, [class*=scene-tile]')].find((t) =>
          /^Pink$|^Blue$|Bar Blue/i.test(t.textContent.trim()),
        ) || document.querySelector('.scene-grid button, [class*=scene-tile]');
        tile?.click();
      });
      await new Promise((r) => setTimeout(r, 2200));
    },
  },
  {
    name: 'visualizer',
    path: '/visualizer',
    waitFor: 'canvas',
    // Shoot the royalty-free demo view (Pexels 11923047): venue photos from
    // customer sites may not be redistributable. Falls back to the default
    // view if the tab is missing.
    before: async (page) => {
      await page.evaluate(() => {
        const tab = [...document.querySelectorAll('button')].find(
          (b) => b.textContent.trim() === 'Booths',
        );
        tab?.click();
      });
      await new Promise((r) => setTimeout(r, 800));
    },
  },
  { name: 'timeline-editor', path: '/timelines/editor/1', waitFor: 'canvas, svg, .timeline' },
  {
    // Chase knobs are per-timeline. The before-hook picks Timecode only on
    // Chuckies (id 2) for the shot without saving, so any timeline works.
    name: 'timeline-timecode-chase',
    path: '/timelines/editor/2',
    waitFor: '.timecode-sync',
    before: async (page) => {
      await page.evaluate(() => {
        const expand = document.querySelector('button.settings-more:not(.settings-more-open)');
        expand?.click();
      });
      await sleep(400);
      await page.evaluate(() => {
        const mode = [...document.querySelectorAll('.timecode-sync-mode')].find((b) => b.textContent.trim() === 'Timecode only');
        if (mode && !mode.classList.contains('active')) mode.click();
      });
      await sleep(400);
    },
    selector: '.section-header',
  },
  // Operation
  { name: 'surface-operator-list', path: '/surface-operator' },
  { name: 'surface-operator', path: '/controlsurfaces/1/operator' },
  { name: 'tempo', path: '/tempo' },
  { name: 'ambient-presets', path: '/ambient' },
  { name: 'favorites', path: '/favorites' },
  { name: 'custom-menu-operate', path: '/custommenu' },
  // A Faders page custom menu item: menu id 4, item 0 in the sample data (menu "Lounge", item "Bar Faders")
  { name: 'custom-menu-faders', path: '/custommenu/faders?menuId=4&path=0', waitFor: '.page-fader-strip' },
  // Lighting setup
  { name: 'outputs-list', path: '/outputs' },
  // Stream routing (needs routing on and a console sending on a mapped universe).
  { name: 'inputs', path: '/inputs', waitFor: 'table' },
  { name: 'outputs-routing-conflict', path: '/outputs' },
  { name: 'output-editor', path: '/outputs/1' },
  { name: 'fixtures-list', path: '/fixturesettings' },
  {
    // Three rows ticked so the batch action bar shows; nothing is changed
    name: 'fixtures-batch-actions',
    path: '/fixturesettings',
    waitFor: '.select-row',
    before: async (page) => {
      const boxes = await page.$$('.select-row');
      for (const box of boxes.slice(1, 4)) await box.click();
      await page.waitForSelector('.batch-action-bar', { timeout: 5000 });
      await sleep(300);
    },
  },
  { name: 'fixture-editor', path: '/fixturesettings/1' },
  {
    name: 'add-fixture-profile',
    path: '/fixturesettings/0',
    waitFor: 'button',
    before: async (page) => {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(
          (b) => b.textContent.trim() === 'Add profile…',
        );
        btn?.click();
      });
      await page.waitForSelector('.modal.show, .modal.d-block, .modal', { timeout: 5000 });
      await sleep(400);
    },
  },
  {
    // Import dialog with a third-party style sheet (exact, suggested and
    // "like a patched fixture" matches); preview only, nothing is imported
    name: 'fixture-patch-import',
    path: '/fixturesettings',
    waitFor: 'button',
    before: async (page) => {
      const buttons = await page.$$('button');
      for (const b of buttons) {
        // The CIcon adds text, so match with includes; skip the dialog's own button
        if (await b.evaluate((el) => el.textContent.includes('Import') && !el.closest('.modal'))) {
          await b.click();
          break;
        }
      }
      const input = await page.waitForSelector('.modal input[type="file"]', { timeout: 5000 });
      await input.uploadFile(join(__dirname, 'samples', 'fixture-patch-sample.csv'));
      await page.waitForFunction(() => /Fixture types/.test(document.querySelector('.modal')?.innerText || ''), { timeout: 8000 });
      await sleep(1500); // second preview after the suggestions are taken
    },
  },
  { name: 'fixture-profiles', path: '/fixtureprofiles' },
  {
    // Profile editor on a pixel bar (a profile named "Pixel Bar (8 pixels)", built with the
    // New profile pixel bar template), the second pixel's red channel selected so the beam
    // picture shows
    name: 'fixture-profile-editor',
    path: '/fixtureprofiles',
    fullPage: true,
    before: async (page) => {
      const id = await page.evaluate(async () => {
        const response = await fetch('/api/website/fixtureprofile/library', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const list = (await response.json()).data || [];
        return list.find((p) => p.name === 'Pixel Bar (8 pixels)')?.fixtureProfileId;
      });
      if (!id)
        throw new Error('No "Pixel Bar (8 pixels)" profile on the device');
      await page.goto(`${BASE}/op/fixtureprofiles/${id}/edit`, { waitUntil: 'networkidle2', timeout: 20000 });
      await page.waitForSelector('.channel-row', { timeout: 8000 });
      // Physical opens by itself when a beam angle is set; fold it so the channel pane fits
      const physical = await page.$('.collapsible-row');
      await physical?.click();
      await sleep(200);
      const rows = await page.$$('.channel-row');
      await rows[3].click();
      await sleep(900); // the server's validate call fills in the function ids
    },
  },
  {
    // New-profile assistant with a bar's beam count showing
    name: 'fixture-profile-new',
    path: '/fixtureprofiles/new',
    waitFor: '.modal.show',
    before: async (page) => {
      const inputs = await page.$$('.modal input');
      await inputs[0].type('Generic');
      await inputs[1].type('LED Bar 12');
      const selects = await page.$$('.modal select');
      await selects[0].select('BAR');
      await sleep(300);
      const beams = await page.$('.modal input[type="number"]');
      await beams.click();
      await page.keyboard.down('Control');
      await page.keyboard.press('a');
      await page.keyboard.up('Control');
      await beams.type('12');
      await sleep(300);
      const templates = await page.$$('.modal select');
      await templates[1].select('PIXEL_BAR');
      await sleep(400);
    },
  },
  { name: 'zones-list', path: '/zones' },
  { name: 'protocol', path: '/settings/PROTOCOL' },
  {
    name: 'effect-editor',
    path: '/effects/19',
    waitFor: 'select, .form-select',
  },
  {
    name: 'cloud-tunnel',
    path: '/settings/SYSTEM',
    before: async (page) => {
      await page.evaluate(() => {
        const label = [...document.querySelectorAll('label, .key-text')].find((el) =>
          /Enable Remote Access/i.test(el.textContent),
        );
        label?.closest('.row, .mb-3, .form-group')?.scrollIntoView({ block: 'center' });
        label?.scrollIntoView({ block: 'center' });
      });
      await sleep(400);
    },
  },
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
  { name: 'file-explorer', path: '/fileexplorer' },
  // Utilities
  { name: 'audit-log', path: '/utilities/auditlog' },
  { name: 'device-monitor', path: '/device-monitor' },
  {
    name: 'output-monitor', path: '/utilities/outputmonitor',
    before: async (page) => {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(
          (b) => b.textContent.trim() === 'Start Monitor',
        );
        btn?.click();
      });
      await sleep(900);
      await page.evaluate(() => {
        document.querySelector('.grid-cell')?.click();
      });
      await sleep(600);
    },
  },
  {
    // Channel Tester with a slot picked and a few channels held, so the faders,
    // the readback ghosts and the command line hint all show.
    name: 'channel-tester', path: '/utilities/channeltester',
    before: async (page) => {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(
          (b) => b.textContent.trim() === 'Start Tester',
        );
        btn?.click();
      });
      await sleep(900);
      await page.evaluate(() => {
        const select = document.querySelector('select[aria-label="Slot"]');
        if (select && select.options.length > 1) {
          select.value = select.options[1].value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await sleep(900);
      await page.evaluate(() => {
        const faders = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Faders');
        faders?.click();
      });
      await page.type('input[aria-label="Channel command"]', '1 thru 8 @ full');
      await page.keyboard.press('Enter');
      await sleep(400);
      await page.type('input[aria-label="Channel command"]', '12 + 14 @ 50');
      await page.keyboard.press('Enter');
      await sleep(400);
      await page.type('input[aria-label="Channel command"]', '17 thru 24 @ 25');
      await sleep(700);
    },
  },
  { name: 'record', path: '/utilities/record' },
  { name: 'releases', path: '/utilities/releases' },
  { name: 'input-mapping-details', path: '/utilities/record/recordconfig/1' },
  { name: 'roles-list', path: '/roles' },
  { name: 'role-editor', path: '/roles/2', fullPage: true },
  {
    name: 'recover-pin', path: '/recover-pin', root: true, waitFor: 'h1',
    before: async (page) => {
      await page.waitForFunction(
        () => /Reset admin PIN/i.test(document.body?.innerText || ''),
        { timeout: 8000 },
      ).catch(() => {});
      await page.evaluate(() => {
        const redact = (labelText, replacement) => {
          const label = [...document.querySelectorAll('.text-medium-emphasis')].find(
            (el) => el.textContent.trim() === labelText,
          );
          const value = label?.parentElement?.querySelector('.font-monospace');
          if (value) value.textContent = replacement;
        };
        redact('Device serial', '[device]');
        redact('Machine name', '[device]');
        redact('Balena ID', '[device]');
        redact('Challenge code', '483 291 507');
        document.querySelector('img[alt*="QR"]')?.remove();
      });
    },
  },
  {
    name: 'cue-defaults', path: '/cues',
    before: async (page) => {
      await page.evaluate(() => {
        const h = [...document.querySelectorAll('h6')].find(
          (el) => el.textContent.trim() === 'Default Settings',
        );
        h?.scrollIntoView({ block: 'center' });
      });
      await sleep(300);
    },
  },
  { name: 'channel-rules', path: '/channelrules' },
  { name: 'control-value-level', path: '/controlvalues/1' },
  // The Drives section on a Level Control Value (VOL1 drives F1 on the dev box)
  { name: 'control-value-drives', path: '/controlvalues/1', fullPage: true },
  {
    // The Faders page in its Controls view (needs a Level Control Value)
    name: 'faders-controls',
    path: '/faders',
    waitFor: '.view-chip',
    before: async (page) => {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('.view-chip')].find(
          (b) => b.textContent.trim() === 'Controls',
        );
        btn?.click();
      });
      await page.waitForSelector('.fader-strip--control', { timeout: 5000 });
      await sleep(400);
    },
  },
  {
    // The Faders page in Build Preset mode: a checkbox on each strip, prefilled with
    // the fixtures controlled directly from the page
    name: 'faders-build-preset',
    path: '/faders',
    waitFor: '.fader-strip',
    before: async (page) => {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(
          (b) => b.textContent.trim() === 'Build Preset',
        );
        btn?.click();
      });
      await page.waitForSelector('.build-preset-bar', { timeout: 5000 });
      await sleep(400);
    },
  },
  // Backup / users
  { name: 'backup-restore', path: '/backuprestore' },
  { name: 'users-list', path: '/users' },
  { name: 'schedules-list', path: '/schedules' },
  { name: 'schedule-editor', path: '/schedules/1' },
];

// ---- helpers --------------------------------------------------------------
async function login() {
  const res = await fetch(`${API}/api/website/login`, {
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
  console.log(`Logged in as ${auth.user?.name} - capturing ${THEME} theme`);

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

  const onlySet = ONLY
    ? new Set(ONLY.split(',').map((s) => s.trim()).filter(Boolean))
    : null;
  const shots = onlySet ? SHOTS.filter((s) => onlySet.has(s.name)) : SHOTS;
  let ok = 0;
  for (const shot of shots) {
    const url = shot.root ? `${BASE}${shot.path}` : `${BASE}/op${shot.path}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      // Ensure the theme attribute is applied even if the SPA re-derived it.
      await page.evaluate((theme) => {
        document.documentElement.setAttribute('data-coreui-theme', theme);
      }, THEME);
      // Guard against the SPA's 404 page - a wrong route must never save a shot.
      const notFound = await page.evaluate(() =>
        /Oops! You're lost/i.test(document.body?.innerText || ''),
      );
      if (notFound) {
        console.warn(`  ✗ ${shot.name}  (${url})  - 404 page (route not found)`);
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
      if (shot.selector) {
        const el = await page.$(shot.selector);
        if (!el) {
          console.warn(`  ✗ ${shot.name}  (${url})  - selector ${shot.selector} not found`);
          continue;
        }
        await el.screenshot({ path: file });
      } else {
        await page.screenshot({ path: file, fullPage: !!shot.fullPage });
      }
      console.log(`  ✓ ${shot.name}  ←  ${shot.path || '/'}`);
      ok++;
    } catch (err) {
      console.warn(`  ✗ ${shot.name}  (${url})  - ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone: ${ok}/${shots.length} shots → public/assets/web/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
