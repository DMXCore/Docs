---
title: Presets
description: Save and recall fixture states
---

Presets are saved snapshots of DMX fixture states — colors, dimmers, positions, and more. Activate a preset to instantly apply that state to your fixtures, with optional smooth fading.

## Viewing and Activating Presets

On the **touchscreen**, navigate to **Main Menu > Presets**. Tap a preset to activate it. If a cue is playing, it will be stopped when a preset is selected. Long-hold for settings.

![Presets list](https://github.com/DMXCore/DmxCore100/assets/407941/c91d7ffb-b6b1-46f3-bc31-5f83bbbf8867)

In the **Web UI**, go to **Lighting > Presets**. Click the play icon to activate, or click the preset name to open its detail page for editing.

<!-- SCREENSHOT: Web UI presets list with action buttons (dark mode) -->

:::note[Interface differences]
- **Touchscreen**: Tap to activate, long-hold for settings.
- **Web UI**: Click play icon to activate. Click name to edit. Provides additional capabilities: copy/paste, duplicate, effect assignment, and detailed editing.
:::

## Preset Types

- **Global** — Applies to all configured fixtures and universes
- **Zone** — Applies only to fixtures within a specific [zone](/dmx-core-100/lighting/zones)
- **Fixture** — Applies to a specific individual fixture

A preset with a single universe will be output to all configured universes when selected. A multi-universe preset will only output to the number of universes stored in the preset.

## Preset Settings

![Preset settings](https://github.com/DMXCore/DmxCore100/assets/407941/187bc4ff-33f9-4cd6-8a12-eebfc8ff1f56)

- **Code** — Unique identifier for API and external control
- **Name** — Display name
- **Fade Duration** — How long the transition takes when activating or deactivating the preset
- **Effect** — Optionally assign an [effect](/dmx-core-100/lighting/effects) that runs while the preset is active

## Editing Presets

:::tip[Web UI only]
The Web UI provides a full preset editor where you can modify individual fixture values (color, dimmer, etc.) directly. You can also **copy and paste** preset data between presets.
:::

## Stopping a Preset

An active preset can be stopped, which will fade out the preset output over the configured fade duration. In the Web UI, use the stop button. On the touchscreen, activating a different preset or using blackout/stop will deactivate the current preset.

See [Blackout and Stop](/dmx-core-100/basics/blackout-and-stop) for details about the difference between blackout and stop.

## Duplicating Presets

In the **Web UI**, you can duplicate a preset to create a copy with the same fixture states. This is useful for creating variations — for example, the same scene at different brightness levels.
