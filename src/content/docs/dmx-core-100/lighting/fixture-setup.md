---
title: Fixture Setup
description: Add and configure light fixtures with profiles
---

Before you can use fixture control, presets, or effects, you need to configure your light fixtures in the DMX Core 100. This involves importing a fixture profile and creating fixture instances that match your physical setup.

## Fixture Profiles

A fixture profile describes the capabilities of a specific light fixture model — its DMX channels, functions (color, dimmer, pan/tilt, etc.), and personalities (channel modes).

### Built-in Generic Profiles

The DMX Core 100 ships with built-in generic profiles for common **RGB and RGBW** fixtures — PAR washes and LED strips/pixels. For these simple fixtures you don't need to import anything; just select the matching generic profile when [adding a fixture](#adding-fixtures).

### Importing Profiles

The DMX Core 100 supports importing profiles from four popular fixture libraries. Start with Lightkey when you can — public catalog, one file per fixture, no account.

- [Lightkey](https://www.lightkeyapp.com/en/fixtures) — `.lightkeyfxt`
- [Daslight (SSL2)](https://store.daslight.com/en/ssl) — `.ssl2` (may require a free login)
- [GDTF Share](https://gdtf-share.com) — `.gdtf`
- [Avolites Personality Library](https://personalities.avolites.com/) — `.d4`; last resort, because the site ships the whole library as an archive. See [Avolites Fixture Profiles](/dmx-core-100/lighting/avolites-fixture-profiles) for how to extract a single file.

If none of these libraries has your fixture — common with unbranded fixtures — an AI assistant can build a profile from photos of the fixture's manual. See [AI-Generated Fixture Profiles](/dmx-core-100/lighting/ai-fixture-profiles).

To import while adding or editing a fixture:

1. On Fixture Details, click **Add profile…** next to the Profile dropdown
2. Open a library, download the file, then choose it in the dialog and click **Import**
3. The new profile is selected — save the fixture to apply it

To import several files, or to inspect and delete profiles, use **Lighting Setup > Profiles** and **Add profile…**.

On a wall-mounted unit you can instead copy the file to a USB stick and import it from **Utilities > File Explorer** on the touchscreen. **File Explorer > Transfer** in the Web UI still works as a bulk/alternate path.

The **Profile** dropdown on Fixture Details lists generic profiles, imported profiles, and any profiles provided by a loaded plugin.

![Profiles — import, inspect, and delete fixture profiles](/assets/web/fixture-profiles.png)

### Managing Profiles

**Lighting Setup > Profiles** lists every profile on the device: imported library profiles, the generic RGB/RGBW seeds, and read-only profiles from a loaded plugin.

- Open a row to see personalities and the 1-based channel map (the same numbering as the fixture manual)
- Hover the personalities summary to see each mode's channel count
- **Delete** is available for unused library profiles. Plugin profiles cannot be deleted. A profile that fixtures still use is blocked until those fixtures are reassigned or removed.

## Adding Fixtures

:::tip[Web UI only]
Fixture setup is managed in the Web UI under **Lighting Setup > Fixtures**.
:::

1. Go to **Lighting Setup > Fixtures** in the Web UI
2. Click **Add** to create a new fixture
3. Select the **Profile** — a built-in generic RGB/RGBW profile, or one you imported. If it isn't in the list, click **Add profile…** next to the dropdown
4. Select the **Personality** (channel mode) — this determines which DMX channels the fixture uses
5. Set the **DMX address** (start channel) and **universe**
6. Optionally assign the fixture to a [Zone](/dmx-core-100/lighting/zones)
7. Click **Save**

![Fixture setup — profile and personality selection](/assets/web/fixture-editor.png)

### Personality Selection

Most fixture profiles include multiple personalities (sometimes called "modes"). Each personality defines a different channel layout — for example, a 6-channel mode for basic control or a 16-channel mode with fine control. Choose the personality that matches your fixture's physical DIP switch or menu setting.

### Custom Options

Some fixtures support custom configuration options beyond the standard profile settings. These appear as additional fields in the fixture setup when available.

## Managing Fixtures

From the **Lighting Setup > Fixtures** page in the Web UI, you can:

- **Edit** a fixture — Click the fixture name to modify its settings
- **Enable/Disable** — Toggle a fixture on or off without deleting it
- **Delete** — Remove a fixture from the configuration

## Hiding Fixture Functions

If a fixture profile includes functions you don't use — for example, a strobe channel on a simple par can — you can hide individual functions to keep the Fixture Control view uncluttered.

In the Web UI, open the fixture's settings and use the **Hidden Functions** list to select which functions to hide. Hidden functions remain in the profile but are excluded from the Fixture Control display.

## Splitting and Combining Fixtures

:::tip
If all you need is to make one copy a little brighter or dimmer than the others, you don't have to split — set a per-copy [intensity trim](/dmx-core-100/lighting/fixture-control#copy-trims) on the Fixture Control page instead.
:::

If you have a fixture with multiple copies, you can **split** it into individual fixtures — each copy becomes its own entry with an automatically assigned code (e.g., `Front_Wash_1`, `Front_Wash_2`). This is useful when you need to assign copies to different zones or adjust settings independently.

To reverse a split, open any of the split fixtures and click **Combine**. This merges all matching split fixtures back into a single multi-copy fixture. The button shows the total count of fixtures that will be combined.

:::note
Split is available when a fixture has between 2 and 50 copies. Combine is available when the system detects matching split siblings (same profile, personality, and code pattern).
:::

## Fixture Warnings

When editing a fixture, the system checks whether the fixture's assigned slot has an enabled output configured. If not, a warning is displayed with a direct link to the [Output Config](/dmx-core-100/configuration/output-config) page so you can set one up. This helps catch configuration issues before they affect your show.

## Exporting Fixtures

You can export your fixture list from **Lighting Setup > Fixtures** in the Web UI in two formats:

- **Excel** — Full export with formatting, suitable for documentation
- **CSV** — Lightweight export for spreadsheet tools and data processing

The export includes fixture names, profiles, personalities, DMX addresses, and universe assignments — useful for documentation or handoff to a lighting programmer.

## Multi-Function Fixtures

Fixtures with multiple instances of the same function type (e.g., dual color wheels, multiple gobos) are fully supported. The system automatically detects and exposes all function instances for control.
