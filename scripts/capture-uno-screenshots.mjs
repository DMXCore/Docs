// Unattended touchscreen (Uno) screenshot capture for the DMX Core 100 docs.
//
// Requires the app to include the DeviceUiController + IDeviceUiAutomation navigation
// endpoint (see the app repo — Shared/Controllers/DeviceUiController.cs and App.xaml.cs).
// With that in place this needs no browser and no desktop control: it logs in, POSTs to
// /api/deviceui/navigate for each screen, and GETs /api/website/screenshot (a clean PNG
// of the current touchscreen), saving to public/assets/device/.
//
// Usage:
//   node scripts/capture-uno-screenshots.mjs [--base http://localhost:8080] [--pin 1111] [--only cues]
//
// If the device build predates the navigation endpoint, /api/deviceui/navigate returns
// 404 and the script explains what to add.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, '..');

const args = process.argv.slice(2);
const getArg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const BASE = getArg('base', 'http://localhost:8080').replace(/\/$/, '');
const PIN = getArg('pin', '1111');
const USER_ID = Number(getArg('user', '1'));
const ONLY = getArg('only', null);
const OUT = join(REPO, 'public', 'assets', 'device');

// screen key (understood by the navigation endpoint) → output filename
const SHOTS = [
  { screen: 'home', name: 'uno-home' },
  { screen: 'mainmenu', name: 'uno-main-menu' },
  { screen: 'cues', name: 'uno-cues' },
  { screen: 'presets', name: 'uno-presets' },
  { screen: 'sounds', name: 'uno-sounds' },
  { screen: 'timelines', name: 'uno-timelines' },
  { screen: 'fixturecontrol', name: 'uno-fixture-control' },
  { screen: 'settings', name: 'uno-settings' },
  { screen: 'utilities', name: 'uno-utilities' },
  { screen: 'about', name: 'uno-about' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function login() {
  const res = await fetch(`${BASE}/api/website/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: USER_ID, pin: PIN }),
  });
  const body = await res.json();
  const token = body?.data?.token;
  if (!token) throw new Error(`Login failed: ${JSON.stringify(body)}`);
  return token;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const token = await login();
  const auth = { Authorization: `Bearer ${token}` };

  // Fail fast with a clear message if the navigation endpoint isn't in this build.
  // A build without it doesn't 404 cleanly — the request falls through to the SPA
  // fallback, which serves HTML (GET) or 500s (POST). So we check for a JSON reply.
  {
    const probe = await fetch(`${BASE}/api/deviceui/screens`, { headers: auth });
    const ct = probe.headers.get('content-type') || '';
    if (!probe.ok || !ct.includes('application/json')) {
      console.error(
        '\nThe /api/deviceui navigation endpoint is not present in the running build.\n' +
          'Add it and rebuild the app, then re-run:\n' +
          '  • Shared/Interfaces/IDeviceUiAutomation.cs\n' +
          '  • Shared/Controllers/DeviceUiController.cs\n' +
          '  • App.xaml.cs: implement IDeviceUiAutomation + register it in DI\n',
      );
      process.exit(2);
    }
  }

  // The touchscreen session is separate from the Web UI login. Log the admin user
  // into the device session so admin-only screens/content are captured (not guest).
  const logon = await fetch(`${BASE}/api/deviceui/logon?userId=${USER_ID}`, {
    method: 'POST',
    headers: auth,
  });
  if (logon.ok) {
    console.log(`Logged user ${USER_ID} into the touchscreen session (admin).`);
    await sleep(800); // let the menus rebuild with admin content
  } else {
    console.warn(
      `  ! device logon returned HTTP ${logon.status} — capturing as the current ` +
        `device session (may be guest). Update the app to the latest deviceui endpoint.`,
    );
  }

  const shots = ONLY ? SHOTS.filter((s) => s.screen === ONLY) : SHOTS;
  let ok = 0;
  for (const shot of shots) {
    try {
      const nav = await fetch(
        `${BASE}/api/deviceui/navigate?screen=${encodeURIComponent(shot.screen)}`,
        { method: 'POST', headers: auth },
      );
      if (!nav.ok) {
        console.warn(`  ✗ ${shot.name}  — navigate ${shot.screen}: HTTP ${nav.status}`);
        continue;
      }

      await sleep(1200); // let the screen render/settle

      const shotRes = await fetch(`${BASE}/api/website/screenshot`, { headers: auth });
      if (!shotRes.ok) {
        console.warn(`  ✗ ${shot.name}  — screenshot: HTTP ${shotRes.status}`);
        continue;
      }
      const buf = Buffer.from(await shotRes.arrayBuffer());
      writeFileSync(join(OUT, `${shot.name}.png`), buf);
      console.log(`  ✓ ${shot.name}  ←  ${shot.screen}  (${buf.length} bytes)`);
      ok++;
    } catch (err) {
      console.warn(`  ✗ ${shot.name}  — ${err.message}`);
    }
  }

  console.log(`\nDone: ${ok}/${shots.length} touchscreen shots → public/assets/device/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
