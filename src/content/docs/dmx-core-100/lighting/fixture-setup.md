---
title: Fixture Setup
description: Add and configure light fixtures with profiles
---

Before you can use fixture control, presets, or effects, you need to configure your light fixtures in the DMX Core 100. This involves importing a fixture profile and creating fixture instances that match your physical setup.

## Fixture Profiles

A fixture profile describes the capabilities of a specific light fixture model - its DMX channels, functions (color, dimmer, pan/tilt, etc.), and personalities (channel modes).

### Built-in Generic Profiles

The DMX Core 100 ships with built-in generic profiles for common **RGB and RGBW** fixtures - PAR washes and LED strips/pixels. For these simple fixtures you don't need to import anything; just select the matching generic profile when [adding a fixture](#adding-fixtures).

### Importing Profiles

The DMX Core 100 supports importing profiles from four popular fixture libraries. Start with Lightkey when you can - public catalog, one file per fixture, no account.

- [Lightkey](https://www.lightkeyapp.com/en/fixtures) - `.lightkeyfxt`
- [Daslight (SSL2)](https://store.daslight.com/en/ssl) - `.ssl2` (may require a free login)
- [GDTF Share](https://gdtf-share.com) - `.gdtf`
- [Avolites Personality Library](https://personalities.avolites.com/) - `.d4`; last resort, because the site ships the whole library as an archive. See [Avolites Fixture Profiles](/dmx-core-100/lighting/avolites-fixture-profiles) for how to extract a single file.

If none of these libraries has your fixture - common with unbranded fixtures - an AI assistant can build a profile from photos of the fixture's manual. See [AI-Generated Fixture Profiles](/dmx-core-100/lighting/ai-fixture-profiles).

To import while adding or editing a fixture:

1. On Fixture Details, click **Add profile…** next to the Profile dropdown
2. Open a library, download the file, then choose it in the dialog and click **Import**
3. The new profile is selected - save the fixture to apply it

![Add fixture profile - download a library file and import it](/assets/web/add-fixture-profile.png)

To import several files, or to inspect and delete profiles, use **Lighting Setup > Profiles** and **Add profile…**.

On a wall-mounted unit you can instead copy the file to a USB stick and import it from **Utilities > File Explorer** on the touchscreen. **File Explorer > Transfer** in the Web UI still works as a bulk/alternate path.

![File Explorer on the touchscreen](/assets/device/uno-file-explorer.png)

The **Profile** dropdown on Fixture Details lists generic profiles, imported profiles, and any profiles provided by a loaded plugin.

### Managing Profiles

**Lighting Setup > Profiles** lists every profile on the device: imported library profiles, the generic RGB/RGBW seeds, and read-only profiles from a loaded plugin.

![Profiles - import, inspect, and delete fixture profiles](/assets/web/fixture-profiles.png)

- Open a row to see personalities and the 1-based channel map (the same numbering as the fixture manual)
- Hover the personalities summary to see each mode's channel count
- The details page also shows the profile's type and beams (pixels or cells), and per channel its beam, whether it runs inverted, its fallback value and the color of color wheel slots
- **Export** on a library profile's details page downloads it as a DMX Core JSON profile file (`<Manufacturer> - <Name>.json`), the same format **Import** accepts. Edit it and import it again to update the profile, or import it on another unit. Anything the format cannot hold is listed in the file's `warnings`
- **Delete** is available for unused library profiles. Plugin profiles cannot be deleted. A profile that fixtures still use is blocked until those fixtures are reassigned or removed.

## Adding Fixtures

Fixtures are managed under **Lighting Setup > Fixtures** in the Web UI, or **Main Menu > Settings > Fixtures** on the touchscreen. A touchscreen fixture also has a **Zone** field.

![Fixtures list in the Web UI](/assets/web/fixtures-list.png)

1. Go to **Lighting Setup > Fixtures** in the Web UI
2. Click **Add a fixture** or **Add New**
3. Select the **Profile** - a built-in generic RGB/RGBW profile, or one you imported. If it isn't in the list, click **Add profile…** next to the dropdown
4. Select the **Personality** (channel mode) - this determines which DMX channels the fixture uses
5. Set the **Start Channel** and **Slot/Universe Id**
6. Optionally assign the fixture to a [Zone](/dmx-core-100/lighting/zones) with the **Zone** field on this fixture (not in the zone editor)
7. Click **Save**

![Fixture setup - profile and personality selection](/assets/web/fixture-editor.png)

### Personality Selection

Most fixture profiles include multiple personalities (sometimes called "modes"). Each personality defines a different channel layout - for example, a 6-channel mode for basic control or a 16-channel mode with fine control. Choose the personality that matches your fixture's physical DIP switch or menu setting.

### Custom Options

Some fixtures support custom configuration options beyond the standard profile settings. These appear as additional fields in the fixture setup when available.

## Managing Fixtures

From the **Lighting Setup > Fixtures** page in the Web UI, you can:

- **Edit** a fixture - Click the fixture name to modify its settings
- **Enable/Disable** - Toggle a fixture on or off without deleting it
- **Delete** - Remove a fixture from the configuration

## Hiding Fixture Functions

If a fixture profile includes functions you don't use - for example, a strobe channel on a simple par can - you can hide individual functions to keep the Fixture Control view uncluttered.

In the Web UI, open the fixture's settings and use the **Hidden Functions** list to select which functions to hide. Hidden functions remain in the profile but are excluded from the Fixture Control display.

## Splitting and Combining Fixtures

:::tip
If all you need is to make one copy a little brighter or dimmer than the others, you don't have to split - set a per-copy [intensity trim](/dmx-core-100/lighting/fixture-control#copy-trims) on the Fixture Control page instead.
:::

If you have a fixture with multiple copies, you can **split** it into individual fixtures - each copy becomes its own entry with an automatically assigned code (e.g., `Front_Wash_1`, `Front_Wash_2`). This is useful when you need to assign copies to different zones or adjust settings independently.

To reverse a split, open any of the split fixtures and click **Combine**. This merges all matching split fixtures back into a single multi-copy fixture. The button shows the total count of fixtures that will be combined.

:::note
Split is available when a fixture has between 2 and 50 copies. Combine is available when the system detects matching split siblings (same profile, personality, and code pattern).
:::

## Fixture Warnings

When editing a fixture, the system checks whether the fixture's assigned slot has an enabled output configured. If not, a warning is displayed with a direct link to the [Output Config](/dmx-core-100/configuration/output-config) page so you can set one up. This helps catch configuration issues before they affect your show.

## Exporting Fixtures

You can export your fixture patch from **Lighting Setup > Fixtures** in the Web UI in two formats:

- **Excel** - Full export with formatting and totals, suitable for documentation
- **CSV** - For spreadsheet tools and data processing (UTF-8, opens correctly in Excel)

Each fixture is one row, sorted by address: code, name, enabled, slot and start channel, personality, copies, zone, manufacturer and profile, profile code, copy trims, hidden functions and custom options. The **End Slot**, **End Ch**, **Ch/Fixture** and **Warning** columns are worked out for you (where the fixture ends, and which fixtures share channels); they are only there to read and are ignored on import.

The export is complete, so it can be edited and [imported](#importing-fixtures) again, on the same unit or another one.

## Importing Fixtures

With a large rig, patching fixtures one at a time is slow. **Import** on **Lighting Setup > Fixtures** reads a whole patch from a CSV or Excel (`.xlsx`) sheet, one row per fixture. It needs the **Edit Fixtures** permission.

To start from a blank sheet, download a template from [DMXCore/DmxCore100-Tools](https://github.com/DMXCore/DmxCore100-Tools/tree/main/samples/Fixture%20Patch): [CSV](https://github.com/DMXCore/DmxCore100-Tools/raw/main/samples/Fixture%20Patch/fixture-patch-template.csv) or [Excel](https://github.com/DMXCore/DmxCore100-Tools/raw/main/samples/Fixture%20Patch/fixture-patch-template.xlsx). Its example rows use the built-in Generic profiles, so it imports on any unit as it is; replace them with your fixtures.

The quickest way to build the sheet is often from your own patch:

1. Import the fixture profiles you need (see [Importing Profiles](#importing-profiles))
2. Patch **one fixture of each type** the way you want it - personality, hidden functions, custom options
3. **Export** the patch as CSV or Excel
4. Add a row for every other fixture: copy a row of the same type, give it a name and an address, and clear its **Code** so a new code is assigned
5. Click **Import**, choose the file, check the preview, and click **Import** in the dialog

![Import fixture patch - preview with fixture type matching](/assets/web/fixture-patch-import.png)

### How rows are applied

- A row whose **Code** matches an existing fixture **updates** that fixture. Columns that are not in the sheet keep their current values, so a sheet with just **Code** and **Name** renames fixtures and changes nothing else
- Any other row **adds** a new fixture. Leave **Code** empty to get the next free code (`LIGHT12`, `LIGHT13`, ...)
- Fixtures that are not in the sheet are left alone; import never deletes fixtures
- **Zones** must already exist (see [Zones](/dmx-core-100/lighting/zones)); a zone name the device doesn't know is an error. An empty Zone cell removes the fixture from its zone
- Nothing is saved until you click **Import** in the dialog, and then everything is saved at once. If any row has an error, nothing is imported

### The preview

Choosing a file shows what the import will do before anything changes:

- A count of **new**, **update**, **unchanged** and **error** rows, and the rows themselves with what changes for each update (for example `Address 1.1 → 2.101`)
- **Errors** block the import: a missing address, slot 0, a channel outside 1-512, an unknown zone or profile, a code used twice in the file
- **Warnings** do not block it: fixtures sharing channels (with other rows or with fixtures already patched), a slot with no enabled output, a copy trimmed to 0%
- Columns the import doesn't use are listed, so a misspelled header is easy to spot

### Fixture types

Each fixture type in the sheet - the **Manufacturer**, **Profile** and **Personality** as written - is matched once for all its rows, in the **Fixture types** table:

- **Exact** - the names match a profile on the device
- **Suggested** - the closest match. If a fixture with that profile is already patched, the suggestion is to make the rows **like that fixture**, which also copies its hidden functions and custom options. This is why patching one fixture of each type first pays off
- **Your choice** - pick a patched fixture or any profile (and personality) from the list
- **Not matched** - nothing close was found, or you cleared the match; pick one before you can import

The browser remembers your choices by type, so importing a corrected version of the same sheet does not ask again.

A row can also name its type directly: **Profile Code** (written by the export) picks the exact profile, and a **Template** column with the code of a patched fixture makes the row like that fixture.

### Sheets from other programs

The import also reads patch sheets that were not made by DMX Core:

- CSV separated by commas, semicolons or tabs, and Excel `.xlsx` (the first sheet; title rows above the table are skipped). Old `.xls` files must be saved as `.xlsx` or CSV first
- Common column names work as they are: **Universe** for the slot, **Address** or **DMX** for the start channel, **Mode** for the personality, **Instrument Type** or **Fixture Type** for the profile, **Purpose** or **Label** for the name, **Count** or **Qty** for copies
- An address can be one cell: `2.101`, `2/101` or `2:101` (slot 2, channel 101), or an absolute address such as `613` (also slot 2, channel 101) when there is no slot column
- Slots start at 1. If a sheet numbers universes from 0, add 1 to them first

| Column | Accepted names | Notes |
|---|---|---|
| Code | Code | Matches an existing fixture to update it. Empty for a new fixture |
| Name | Name, Label, Purpose | Defaults to the profile name for a new fixture |
| Enabled | Enabled | Yes/No, true/false, 1/0. New fixtures are enabled by default |
| Slot | Slot ID, Universe | |
| Start channel | Start Ch, Address, DMX, Channel | `2.101` style also accepted |
| Copies | Copies, Count, Qty | 1-680 |
| Personality | Personality, Mode | Empty: a new fixture gets the profile's first personality |
| Manufacturer | Manufacturer, Make, Brand | |
| Profile | Profile, Fixture Type, Instrument Type, Model, Type | |
| Profile Code | Profile Code | Written by the export |
| Template | Template | Code of a patched fixture to copy |
| Zone | Zone, Group | Must exist |
| Copy Trims | Copy Trims | `100% 80% 100%`, one per copy |
| Hidden Functions | Hidden Functions | Separated by `;` |
| Custom Options | Custom Options | `Name=Value; Name=Value` |

:::tip
After an import, the dialog offers **the patch from before the import** as a CSV. Importing it again puts back every fixture the import changed; fixtures it added stay and can be deleted by hand. **Download the current patch** in the dialog saves the same thing beforehand.
:::

## Multi-Function Fixtures

Fixtures with multiple instances of the same function type (e.g., dual color wheels, multiple gobos) are fully supported. The system automatically detects and exposes all function instances for control.
