# Documentation screenshot pipeline

Unattended screenshot capture for the DMX Core 100 docs. No desktop automation — the
scripts drive the app through its own HTTP API (and, for the Web UI, a headless Chrome).

## Prerequisites

- The DMX Core 100 app (or desktop software) running and reachable, default
  `http://localhost:8080`.
- The documentation **sample content** loaded (the "Grand Hall" dataset: demo data plus
  zoned fixtures, control values, a control surface, an ambient preset, a timeline, a
  sunset schedule, a custom menu, a script, triggers, and favorites).
- Node 18+ and Google Chrome installed (the Web UI script uses `puppeteer-core` to drive
  the installed Chrome — no browser download).

## Web UI screenshots

```bash
npm run screenshots          # dark theme (default) → public/assets/web/*.png
npm run screenshots:light    # light theme
# single page:
node scripts/capture-web-screenshots.mjs --only timeline-editor
```

Logs in via `POST /api/website/login`, seeds the auth token + `coreuiTheme` into
localStorage, then visits each page at 1440×900 (deviceScaleFactor 2) and writes a PNG.
Wrong routes are guarded against (the SPA 404 page never saves). Edit the `SHOTS` array to
add/rename pages.

## Touchscreen (Uno) screenshots

```bash
npm run screenshots:uno      # → public/assets/device/uno-*.png
```

Captures the on-device touchscreen with **no browser and no desktop control**: it POSTs to
`/api/deviceui/navigate?screen=…` then GETs `/api/website/screenshot` (a clean PNG of the
current screen).

**This requires a small navigation endpoint in the app** (the running build doesn't have it
yet — the script prints exactly what to add). The app-repo changes:

- `Shared/Interfaces/IDeviceUiAutomation.cs` — the interface.
- `Shared/Controllers/DeviceUiController.cs` — `GET /api/deviceui/screens`,
  `POST /api/deviceui/navigate`.
- `UnoHost/App.xaml.cs` — `App` implements `IDeviceUiAutomation` (navigates on the UI
  dispatcher, reusing the existing menu/navigator objects) and registers it in DI next to
  `IScreenshotProvider`.

Rebuild the app, then `npm run screenshots:uno`. Covered screens: home, main menu, cues,
sounds, timelines, presets, fixture control, settings, utilities, about. Deeper targets
(long-hold popups, numeric/keyboard input, specific settings dialogs) can be added to
`NavigateToCore` in `App.xaml.cs` — they're menu-data-driven rather than named routes.

> Touchscreen light/dark theme is a device setting (Settings → Display Theme), separate from
> the Web UI theme. Set it on the device before capturing if a specific theme is needed.
