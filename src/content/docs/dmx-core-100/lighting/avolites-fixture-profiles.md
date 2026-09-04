---
title: Avolites Fixture Profiles
description: Find and import fixture profiles from the Avolites Personality Library (.d4 files)
---

The [Avolites Personality Library](https://personalities.avolites.com/) is one of the largest fixture libraries in the industry, with over 20,000 fixtures — including many budget and unbranded fixtures that don't appear in other libraries. The DMX Core 100 imports Avolites Titan personality files (`.d4`) directly.

## Finding Your Fixture

Browse or search the library at [personalities.avolites.com](https://personalities.avolites.com/):

1. Use the **Manufacturer** filter or the **Search** box to find your fixture
2. Click the fixture name to see its personality files
3. Look for a row with **Titan** or **Diamond 4** in the Desk column — that's the `.d4` file the DMX Core 100 can import
4. Click the file name to view the fixture's channel layout and verify it matches your fixture's manual

:::note
The website doesn't offer individual file downloads — the `.d4` files are distributed in the full library package described below.
:::

## Getting the .d4 Files

Avolites distributes the complete library as a single download:

1. On [personalities.avolites.com](https://personalities.avolites.com/), go to the **Download** page
2. Download the latest **Titan Fixture Library** (about 1 GB, named like `TitanFixtureLibraryV19.exe`)
3. The installer only runs on Avolites console software, but the files inside can be extracted with [7-Zip](https://www.7-zip.org/) on any Windows, Mac, or Linux computer:
   - **Windows**: Right-click the file and choose **7-Zip > Extract to ...**, or run `7z x TitanFixtureLibraryV19.exe`
   - **Mac/Linux**: `7z x TitanFixtureLibraryV19.exe` (install `p7zip` first)
4. The extracted folders contain the individual `.d4` files, named `<Manufacturer>_<Fixture Name>.d4`

## Importing

Import a `.d4` file the same way as other fixture profiles:

1. On Fixture Details, click **Add profile…** next to the Profile dropdown, choose the `.d4` file, and click **Import**. You can also import from **Lighting Setup > Profiles**.
2. Select the imported profile and the personality (channel mode) matching your fixture's setting, then save.

See [Fixture Setup](/dmx-core-100/lighting/fixture-setup) for details.

## What Gets Imported

- Every mode in the personality file becomes a personality (channel mode) on the profile, including multi-cell layouts (LED battens, pixel bars)
- Dimmer, color (RGB/RGBW/etc.), color temperature, pan/tilt, zoom, focus, and shutter/strobe channels map to the DMX Core 100's native functions, with 16-bit (fine) channels preserved
- Other controls (gobos, macros, control channels, CMY color mixing) are imported as named custom functions, selectable per fixture

A few things don't carry over: color/gobo wheel behavior that depends on the state of another channel is imported in its default state only, and physical data beyond pan/tilt range and beam angle is ignored.
