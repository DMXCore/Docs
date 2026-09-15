---
title: Software Updates
description: How to upgrade the DMX Core 100 — which platforms have Utilities → Releases, how version numbers work, and what to do on an isolated network
---

How you upgrade the DMX Core 100 depends on the platform. The Web UI only shows **Utilities > Releases** when that install can pick a build in-app. Do not assume every unit has that sidebar item.

## Which upgrade path you have

| Platform | In-app Releases? | How upgrades actually happen |
|----------|------------------|------------------------------|
| Appliance (Linux / Balena) | Yes — Web UI **Utilities > Releases**. Touchscreen **Utilities > Device Operations > Releases** | In-app picker. The Appliance needs internet (or [Internet Passthrough](/dmx-core-100/integrations/internet-passthrough)) so it can download the cloud catalog |
| Windows (Velopack / ClickOnce) | Yes | **Utilities > Releases** |
| macOS | Yes | **Utilities > Releases** |
| Linux **Snap** | **No** — the sidebar item is hidden | snapd refreshes the app outside the UI. **Utilities > System** reports that updates are managed by the Snap Store |

If you installed from the Snap Store, do not look for **Utilities > Releases**. It is not there.

You can also keep devices current from the [cloud portal](/dmx-core-100/remote-management#software-updates) (release channels, pinning, automatic updates) when the unit has internet and a remote-access subscription.

## Read the version number, not the date next to the row

Version numbers are **year.month-day**, not “whatever date is printed next to a catalog row.”

- `2026.717` is **17 July 2026**
- `2026.4` is **4 April 2026** — older than `2026.717`, even if the row shows a later date such as 4/30/2026

The third component (`.2` in `2026.717.2`) is the patch for that day. A listed build whose version number is **lower** than the one already running is a downgrade, not an upgrade.

Check the running version on **Utilities > System** (or on the Releases page itself) before you pick a row.

:::caution[An older listed build is not “the upgrade”]
The picker caption **Select version above to upgrade** does not mean every listed build is newer. Compare version numbers. If the list looks wrong or only older builds appear, get the unit online so it can download the current catalog — do not pick the first row.
:::

## Appliance, Windows, and macOS

### Web UI

1. Note the running version on **Utilities > System**.
2. Open **Utilities > Releases**.
3. Compare each listed build to the running version. Install only a **higher** version number.
4. Wait for the update to apply. The application restarts when it finishes.

### Touchscreen (Appliance)

On an Appliance, open **Utilities > Device Operations > Releases**.

![Utilities on the touchscreen](/assets/device/uno-utilities.png)

Pick a listed release the same way: compare the version number to what the unit is already running.

### Switching to an older build

From **v2026.907.x**, switching to an older build asks for confirmation and warns you to take a [backup](/dmx-core-100/configuration/backup-and-restore). Leftover catalog entries that were never meant for that unit are not offered. Older Web UI builds did not warn — if you are below v2026.907.x, read the version number carefully before you tap a row.

Cancel the confirmation unless you **intentionally** need that older build.

## Linux Snap

A Snap install has no **Utilities > Releases** item. [snapd](https://snapcraft.io/docs/keeping-snaps-up-to-date) refreshes `dmxcore100` on its own schedule. **Utilities > System** states that updates are managed by the Snap Store.

To refresh immediately from a terminal:

```bash
sudo snap refresh dmxcore100
```

See [Linux desktop software](/dmx-core-100/desktop-software/linux) for install details.

## Isolated / no-internet units

The in-app picker needs a current cloud catalog. An Appliance on an isolated network will sit on an older build and may only show leftover or down-rev entries.

1. Get the unit online — plug it into a network with internet, or use [Internet Passthrough](/dmx-core-100/integrations/internet-passthrough) (DMX Core Connect on a laptop that already has internet).
2. Wait until **Internet access** and **Cloud connection** are green on **Utilities > System**.
3. Then pick a **current** build from **Utilities > Releases** in the Web UI, or **Utilities > Device Operations > Releases** on the Appliance touchscreen.
4. Deactivate passthrough when you are done.

Do not re-flash the boot image just to change software version. Re-flashing is for a unit that **will not boot** — see [Re-flash Instructions](/dmx-core-100/troubleshooting/re-flash-instructions).
