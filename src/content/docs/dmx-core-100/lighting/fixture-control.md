---
title: Fixture Control
description: Interactively control fixture colors, dimmers, and more
---

The Fixture Control page provides real-time interactive control over your configured fixtures. You can adjust colors, dimmers, pan/tilt, and other fixture functions directly from the Web UI.

:::tip[Web UI only]
Fixture Control is available in the Web UI under **Lighting > Fixture Control**. The touchscreen provides a basic fixture list under **Main Menu > Utilities**, but interactive control is a Web UI feature.
:::

<!-- SCREENSHOT: Web UI Fixture Control page showing color picker and fixture list -->

## Controlling Fixtures

The Fixture Control page displays all configured fixtures with their current state. Select one or more fixtures to control them:

- **Color** — Use the color picker to set RGB/RGBA values for fixtures that support color mixing
- **Dimmer** — Adjust the intensity/brightness level
- **Pan/Tilt** — Position moving fixtures
- **Other functions** — Additional controls appear based on the fixture's profile capabilities

Changes are applied in real-time — you'll see the lights respond immediately.

## Multi-Function Support

Fixtures with multiple instances of the same function type (e.g., multiple color wheels or gobos) are fully supported. The Fixture Control page displays separate controls for each function instance.

## Modifiers

When you adjust a fixture's properties through Fixture Control, these are applied as **modifiers** — runtime adjustments that layer on top of the fixture's base state. A badge indicator shows when a fixture has active modifiers.

:::note
Modifiers are temporary adjustments. To save a fixture state permanently, create a [Preset](/dmx-core-100/playback/presets).
:::

## Fade Speed

You can configure the fade speed for fixture control changes in **Settings > Preferences** in the Web UI. This controls how quickly fixtures transition when you adjust their values.
