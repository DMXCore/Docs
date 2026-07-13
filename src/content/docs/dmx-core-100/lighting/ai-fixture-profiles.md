---
title: AI-Generated Fixture Profiles
description: Create a fixture profile from photos of the fixture's manual using an AI assistant
---

Many light fixtures — especially unbranded ones — have no ready-made profile in the [Lightkey](https://www.lightkeyapp.com/en/fixtures), [Daslight](https://store.daslight.com/en/ssl), or [GDTF Share](https://gdtf-share.com) libraries. Often the only documentation is a printed manual with a DMX channel table. The DMX Core 100 supports a JSON profile format designed so that an AI assistant (Claude, ChatGPT, Gemini, etc.) can create the profile for you directly from photos of that manual.

## How It Works

1. **Photograph the manual.** Take clear photos of the "Channel description" / "DMX channels" pages. Any orientation is fine — the AI handles rotated pages. Make sure every table row is readable.
2. **Ask the AI to build the profile.** Start a chat with an AI assistant that accepts images, attach the photos, and paste the prompt below.
3. **Save the result.** The AI outputs a JSON file (for example `Unknown-RGBW-Bar.dmxprofile.json`). Save it to your computer.
4. **Upload and import.** In the Web UI, go to **File Explorer**, select the **Transfer** folder, upload the file, then choose **Import** on it. (Or copy it to a USB stick and use **Utilities > File Explorer** on the touchscreen.)
5. **Use the profile.** Add your fixture under **Settings > Fixtures** and select the new profile and the personality (channel mode) matching your fixture's setting.

If the import reports problems, see [Fixing Validation Errors](#fixing-validation-errors) below.

## The Prompt

Paste this prompt into the AI chat together with your photos:

````text
You are creating a DMX fixture profile file for the DMX Core 100 lighting
controller from photos of a fixture's user manual. Read the "channel
description" tables in the attached photos (rotate mentally if needed) and
produce ONE JSON file following these rules exactly.

Top level: {"format":"dmxcore-fixture-profile","version":1,"manufacturer":...,
"name":...,"comments":...,"warnings":[...],"modes":[...]}
Use "Unknown" for manufacturer if the manual doesn't name one. Put a short
descriptive model name in "name".

One entry in "modes" per channel mode in the manual (e.g. 4ch, 6ch, 12ch).
Each mode: {"name":"6ch","channelCount":6,"channels":[...]} where
channelCount MUST equal the number of channel entries and channel numbers are
1-based EXACTLY as printed in the manual, each appearing exactly once.

A channel that does one thing across 0-255:
  {"channel":1,"name":"Red","function":"Red"}
A 16-bit fine channel: same function plus "fine":true.
A single-function channel that works as a slider (e.g. a dedicated strobe
channel, slow to fast) adds "continuous":true.
A channel with multiple value ranges:
  {"channel":2,"name":"Strobe","ranges":[
    {"from":0,"to":5,"name":"No strobe","default":true},
    {"from":6,"to":255,"function":"Strobe","name":"Strobe slow to fast","continuous":true}]}
Copy from/to DMX values exactly as printed (0-255). If the manual prints
overlapping boundaries (0-5 then 5-255), move the second range's start up by
one and note it in "warnings". Ranges on one channel must not overlap. Mark
"default":true on the manual's default/safe row (at most one per channel).
Set "continuous":true when the value within a range works as a slider
(speed, sensitivity).

"function" must be one of exactly: Intensity, Red, Green, Blue, White,
WarmWhite, CoolWhite, Amber, Lime, UltraViolet, ColorTemperature, ColorWheel,
Strobe, PulseStrobe, RandomStrobe, RampUpStrobe, RampDownStrobe,
LightningStrobe, ShutterOpen, ShutterClosed, Pan, Tilt, Zoom, Focus, Fog,
Speed, LampOn, LampOff, Switch, Command, Custom.
Mapping: "total dimming"/"master"/"brightness" = Intensity. R/G/B/W dimming =
Red/Green/Blue/White (per-pixel channels R1,R2,... too). Strobe slow-to-fast =
Strobe with continuous:true. A channel selecting fixed colors = ColorWheel
with one named range per color. Effect/program/sound-mode selection rows =
ranges with NO "function" field, one range per manual row, named after the
row. Speed/sensitivity channels = Speed with continuous:true. Anything else =
Custom with a descriptive name. Never invent function names.

If the manual abbreviates repeating rows with "..." (e.g. effect 2 ... effect
87), work out the pattern, enumerate every row, and record in "warnings" that
you interpolated. If a cell is unreadable, make the safest assumption and
record it in "warnings" — never silently guess. If entire tables are
unreadable, ask me for a better photo instead of guessing.

For pixel/point-control modes with many repeated channels (e.g. 144 channels
of R1,G1,B1...), enumerate every channel explicitly.

Output ONLY the JSON file content, no commentary. Name it
<manufacturer>-<model>.dmxprofile.json.
````

:::tip
You don't have to include every channel mode from the manual. If you only ever use the fixture in its basic mode, tell the AI which modes you want — smaller files are easier to review.
:::

## Example

A minimal profile for a generic fixture with a 4-channel mode and a 6-channel mode:

```json
{
  "format": "dmxcore-fixture-profile",
  "version": 1,
  "manufacturer": "Unknown",
  "name": "RGBW PAR",
  "warnings": [],
  "modes": [
    {
      "name": "4ch",
      "channelCount": 4,
      "channels": [
        { "channel": 1, "name": "Red", "function": "Red" },
        { "channel": 2, "name": "Green", "function": "Green" },
        { "channel": 3, "name": "Blue", "function": "Blue" },
        { "channel": 4, "name": "White", "function": "White" }
      ]
    },
    {
      "name": "6ch",
      "channelCount": 6,
      "channels": [
        { "channel": 1, "name": "Dimmer", "function": "Intensity" },
        { "channel": 2, "name": "Strobe", "function": "Strobe", "continuous": true },
        { "channel": 3, "name": "Red", "function": "Red" },
        { "channel": 4, "name": "Green", "function": "Green" },
        { "channel": 5, "name": "Blue", "function": "Blue" },
        { "channel": 6, "name": "White", "function": "White" }
      ]
    }
  ]
}
```

## File Format Reference

### Top level

| Field | Required | Description |
|-------|----------|-------------|
| `format` | yes | Always `"dmxcore-fixture-profile"` — this is how the device recognizes the file |
| `version` | yes | Always `1` |
| `manufacturer` | yes | Manufacturer name, or `"Unknown"` |
| `name` | yes | Short model description |
| `comments` | no | Free-text notes |
| `warnings` | no | Notes the AI records about unreadable cells or interpolated rows; shown in the profile's comments after import |
| `externalId` | no | Stable identity for re-imports; if omitted, one is derived from the file content. Re-importing a file with the same `externalId` updates the existing profile instead of creating a duplicate |
| `modes` | yes | One entry per channel mode |

### Mode

| Field | Required | Description |
|-------|----------|-------------|
| `name` | yes | Unique mode name, e.g. `"6ch"` — this becomes the personality name |
| `channelCount` | yes | Must equal the number of entries in `channels` (used as a cross-check) |
| `comments` | no | Free-text notes, e.g. the manual's subtitle for the mode |
| `channels` | yes | One entry per DMX channel, numbered `1..channelCount` exactly as printed in the manual |

### Channel

Either a single function across the whole 0–255 value span:

```json
{ "channel": 1, "name": "Red", "function": "Red" }
```

optionally with `"fine": true` (16-bit fine channel) or `"continuous": true` (slider-style channel) — or a list of value ranges:

```json
{ "channel": 2, "name": "Program", "ranges": [
  { "from": 0, "to": 9, "name": "No function", "default": true },
  { "from": 10, "to": 19, "name": "Program 1" },
  { "from": 20, "to": 255, "function": "Speed", "name": "Program speed", "continuous": true }
] }
```

Range rules: `from`/`to` are DMX values 0–255 as printed in the manual, ranges must not overlap (gaps are fine), each range needs a `name`, at most one range per channel can have `"default": true`, and `function` is optional (omitted means a custom option row).

### Functions

`Intensity`, `Red`, `Green`, `Blue`, `White`, `WarmWhite`, `CoolWhite`, `Amber`, `Lime`, `UltraViolet`, `ColorTemperature`, `ColorWheel`, `Strobe`, `PulseStrobe`, `RandomStrobe`, `RampUpStrobe`, `RampDownStrobe`, `LightningStrobe`, `ShutterOpen`, `ShutterClosed`, `Pan`, `Tilt`, `Zoom`, `Focus`, `Fog`, `Speed`, `LampOn`, `LampOff`, `Switch`, `Command`, `Custom`

## Fixing Validation Errors

The import checks the file thoroughly — channel numbering, range overlaps, function names, and more — and reports **all** problems at once. If the import fails:

1. Click **Copy error report** under the error message in the File Explorer
2. Paste the report back into your AI chat and ask it to fix the file
3. Upload the corrected file and import again

One round trip is usually enough.

:::note
Re-importing a corrected file may create a second profile if the AI didn't set an `externalId`, since the identity is otherwise derived from the file content. Just delete the failed/old profile — profiles that are in use by a fixture cannot be deleted accidentally.
:::

## Tips for Good Results

- **Sharp, complete photos.** Every row of the channel table must be legible. Retake blurry photos rather than letting the AI guess.
- **Check the warnings.** After import, open the profile and read the comments — the AI records anything it interpolated or assumed there. Spot-check those channels against the manual.
- **Test with the real fixture.** Add a fixture with the new profile, open [Fixture Control](/dmx-core-100/lighting/fixture-control), and verify colors and dimmer respond correctly. If red and green are swapped, the manual (or the AI) got the channel order wrong — ask the AI to fix it and re-import.
- **Mind the fixture's mode setting.** The personality you select in DMX Core must match the channel mode configured on the fixture itself.
