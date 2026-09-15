---
status: candidate
source: ticket
date: 2026-09-07
title: Pick a current software release, not an older listed build
slug: choose-software-release
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/settings
  - dmx-core-100/configuration/utilities
  - dmx-core-100/release-notes
---

# Pick a current software release, not an older listed build

## Original ask

> Getting another new unit configured. I looked at the upgrade page and I’m a
> bit confused. I’m currently running 2026.717.2. Select version above to
> upgrade. But the upgrade is 4/30/2026? Should I be upgrading?

Then, after picking that listed build:

> I think I messed up by upgrading. Now it shows [a down-rev] from where I
> was. You said I’m not on the current revision.

## Goal

The device stays on (or moves to) a build that is actually newer than what it
is running. An older entry in the Releases list is not installed.

## Walkthrough

```json
{
  "id": "choose-software-release",
  "title": "Pick a current software release, not an older listed build",
  "steps": [
    {
      "id": "read-current",
      "label": "Note the running version on Utilities → System (or the Releases page). Version numbers are year then month-day: 2026.717 is 17 July 2026, which is newer than 2026.4 (April)",
      "docsUrl": "/dmx-core-100/configuration/utilities/",
      "screenshotId": null
    },
    {
      "id": "open-releases",
      "label": "On a wall unit or Windows/macOS desktop install, open Utilities → Releases (Web UI) or Main Menu → Settings (touchscreen) and compare each listed build to the running version. Snap Linux has no Releases item — snapd updates the app outside the UI",
      "docsUrl": "/dmx-core-100/configuration/settings/",
      "screenshotId": "uno-settings"
    },
    {
      "id": "skip-older",
      "label": "Do not select a listed build whose version number is lower than the one already running. If the picker offers only older builds, the unit likely cannot see the current catalog (no internet) — use Internet Passthrough first",
      "docsUrl": "/dmx-core-100/integrations/internet-passthrough/",
      "screenshotId": null
    },
    {
      "id": "confirm-downgrade",
      "label": "On current software, switching to an older build asks for confirmation and warns to take a backup. Cancel unless you intentionally need that older build",
      "docsUrl": "/dmx-core-100/release-notes/",
      "screenshotId": null
    }
  ]
}
```

## Gotchas

- **Utilities → Releases is not on every platform.** The Web UI only shows
  that sidebar item when the install can be upgraded in-app (`HasReleasesPage`):
  wall-mounted Balena units, Windows (Velopack/ClickOnce), and macOS. A **Snap**
  Linux install hides it — snapd refreshes the app on its own schedule, and
  Utilities → System says updates are managed by the Snap Store.
- A date shown next to a release (for example 4/30/2026) can be a leftover or
  older catalog entry, not “the upgrade.” Compare the **version number**.
- `2026.4` is a **downgrade** from `2026.717.2`.
- From v2026.907.x the device asks for confirmation before switching to an
  older build and no longer offers leftover builds that were never meant for
  that unit. Older Web UI builds did not warn.
- If the list looks wrong, get the unit online (or use Internet Passthrough)
  so it can download the current catalog — don’t pick the first “upgrade”
  row.

## Eval checks

- Explains year.month-day version numbering with `2026.717` vs `2026.4`
- For a wall unit / Windows / macOS: menu path includes `Utilities > Releases`
  and/or touchscreen `Main Menu > Settings`
- Does not tell a Snap Linux user to open Utilities > Releases
- Tells them not to install a lower version number
- Mentions the downgrade confirmation added in v2026.907.x
- Does not tell them to re-flash for this situation

## Gaps

- No screenshot of **Utilities > Releases** (not in the capture-script
  `SHOTS` list)
- Published docs list **Utilities > Releases** in the sidebar as if it is
  always there; Snap (and any install with `HasReleasesPage: false`) hides
  it. There is no “how to upgrade” page covering platform differences.
- Touchscreen screenshot `uno-settings` shows Settings, not the Web UI
  Releases picker

## Source notes

Email ticket, 2026-09-07 UTC. Same thread as OSC cue playback. Unit was on
2026.717.2; the Releases list offered 2026.4 dated 4/30/2026. Customer
installed it and went down-rev; support moved the device back. Same-day
release notes (v2026.907.x) added the downgrade confirmation.
