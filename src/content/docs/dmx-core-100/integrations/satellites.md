---
title: Satellites
description: Key Digital WP8 keypads and Stream Deck integration
---

Satellites are external control devices that connect to the DMX Core 100 for physical button-based control. They provide dedicated hardware buttons for triggering lighting actions without needing the touchscreen or Web UI.

:::tip[Web UI only]
Satellite configuration is available in the Web UI under **Settings > Satellites**.
:::

<!-- SCREENSHOT: Web UI satellite configuration -->

## Supported Devices

### Key Digital WP8 Keypad

The Key Digital WP8 is an 8-button wall-mounted keypad designed for AV control.

- **8 programmable buttons** — Each can be assigned to play a cue, preset, sound, or timeline
- **LED indicators** — Button LEDs show the current state (active/inactive)
- **Display sleep timeout** — Configurable timeout for the keypad display
- **Two-way status** — LED states update in real-time as playback changes

### Stream Deck MK2

The Elgato Stream Deck MK2 provides 15 LCD buttons for flexible control.

- **Configurable actions** — Assign each button to trigger cues, presets, sounds, or timelines
- **Toggle mode** — Buttons can act as toggles (press to start, press again to stop)
- **Custom labels** — Set button text labels
- **Brightness control** — Adjust the Stream Deck display brightness
- **Sleep timeout** — Configurable auto-sleep
- **Pan and mute** — Special button functions for pan control and mute

## Configuring a Satellite

1. Go to **Settings > Satellites** in the Web UI
2. Click **Add** to register a new satellite device
3. Select the device type (Key Digital WP8 or Stream Deck MK2)
4. Configure the connection settings
5. Assign actions to each button
6. Click **Save**

## Button Actions

Each button on a satellite device can be configured to:

- **Play** a cue, preset, sound, or timeline
- **Stop** playback
- **Toggle** — Start on first press, stop on second press
