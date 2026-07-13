---
title: Quick Start
description: Set up the DMX Core 100 and run your first show
---

This walkthrough takes you from a fresh DMX Core 100 to controlling a light and playing back a show. It assumes you've completed [Installation](/dmx-core-100/getting-started/installation) (or installed the [desktop software](/dmx-core-100/desktop-software)) and powered the unit on.

There are two common workflows. You can follow either — or both — and they share the same first two steps:

- **Control fixtures directly** — Set up a fixture in the DMX Core 100 and save a look as a preset. Start with [Path A](#path-a--control-a-fixture-and-save-a-preset).
- **Record & play back** — Capture a show from external lighting software and replay it on demand. Start with [Path B](#path-b--record-and-play-back-a-show).

## Step 1 — Connect to the Web UI

Most setup happens in the browser-based Web UI.

1. Find the device IP address under **Main Menu > About** on the touchscreen (desktop software users: use `http://localhost:8000`).
2. Open `http://<device-ip>:8000` (or `https://<device-ip>:8001`) in a browser on the same network.
3. Log in with your PIN — the default admin PIN is `1111`.

See [Connecting to the Web UI](/dmx-core-100/getting-started/connecting-to-the-web-ui) for full details.

## Step 2 — Check Your Output

An output tells the DMX Core 100 where to send DMX data — which protocol and universe. A new install already includes a default **sACN** output on **universe 1**, so for a simple single-universe setup you may not need to change anything here.

1. In the Web UI, go to **Settings > Outputs** to review the configured outputs.
2. If you need a different protocol or more universes, edit the default output or click **Add**: choose a **Protocol** (Art-Net or sACN are the most common for network setups), set the **Universe**, and save.

See [Output Config](/dmx-core-100/configuration/output-config) for all options.

:::tip[Using an Advatek controller?]
If you're driving an Advatek PixLite pixel controller, you can skip the manual entry above. Go to **Settings > Device Status**, let the DMX Core 100 discover the controller, and click **Create Output** directly on the port you want to drive — the protocol and start universe are filled in from the device. See the [Advatek Lighting](/dmx-core-100/integrations/advatek-lighting) guide.
:::

## Path A — Control a Fixture and Save a Preset

### Add a fixture

The DMX Core 100 ships with built-in generic profiles for common **RGB and RGBW** fixtures — PAR washes and LED strips/pixels. For a simple RGB light you don't need to find or import a profile; just pick one of the built-ins when adding the fixture.

1. *(Other fixtures only)* If your light isn't a generic RGB/RGBW type, import its profile first: download one from [Lightkey](https://www.lightkeyapp.com/en/fixtures), [Daslight (SSL2)](https://store.daslight.com/en/ssl), or [GDTF Share](https://gdtf-share.com), then upload it in the Web UI under **File Explorer**.
2. Go to **Settings > Fixtures** and click **Add**.
3. Select the **Profile** — a built-in generic RGB/RGBW profile, or one you imported — and the **Personality** (channel mode), then set the **DMX address** and **universe** to match your physical fixture.
4. Click **Save**.

Full details are in [Fixture Setup](/dmx-core-100/lighting/fixture-setup).

### Control it and save a preset

1. Go to **Lighting > Fixture Control**.
2. Select your fixture and adjust its **color** and **dimmer** — the light responds in real time.
3. Once you have a look you like, go to **Lighting > Presets** and save the current state as a new preset.
4. Activate the preset any time by clicking its play icon to instantly recall that look.

See [Fixture Control](/dmx-core-100/lighting/fixture-control) and [Presets](/dmx-core-100/playback/presets) to go further with zones, effects, and fading.

## Path B — Record and Play Back a Show

:::tip[No lighting software handy?]
To try playback right away without an external source, load ready-made example content: go to **Settings > Backup & Restore**, click **Create Demo Data**, select a cue or two, and create them. Then skip straight to [Play it back](#play-it-back) below.
:::

### Record a cue

1. Set your external lighting software (or console) to output Art-Net or sACN to the DMX Core 100 on the universe(s) from your output configuration.
2. In the Web UI, go to **Utilities > Record**.
3. Press **Preview** to start listening — you'll see incoming DMX data on the channel monitor.
4. Run your show, then press **Save Cue** to capture the full dynamic sequence (or **Save Snapshot** to capture a single moment as a preset).

Full details are in [Recording](/dmx-core-100/playback/recording).

### Play it back

1. Go to **Lighting > Cues**.
2. Click the play icon next to your cue to start playback. Use the progress bar to pause, resume, or scrub.

See [Cues](/dmx-core-100/playback/cues) for fade, loop, and dimmer settings.

## Next Steps

- Group fixtures with [Zones](/dmx-core-100/lighting/zones) for per-area control
- Add animated looks with [Effects](/dmx-core-100/lighting/effects)
- Automate playback with [Schedules](/dmx-core-100/scheduling-automation/schedules) and [Input Triggers](/dmx-core-100/scheduling-automation/input-triggers)
- Trigger from external systems — see [Integrations](/dmx-core-100/integrations)
