---
title: Desktop Software
description: Run the full DMX Core 100 software on your computer
---

The DMX Core 100 software is available as a desktop application for **Windows**, **macOS**, and **Linux**. This lets you run the same software that powers the DMX Core 100 hardware directly on your PC or Mac - no hardware required.

## Demo Mode

Without a license, the software runs in **demo mode**. In demo mode, all features are fully accessible so you can explore and test the software before purchasing. The only limitation is:

> **Every 16 minutes, DMX output is disabled for 1 minute.** For the same minute, [Custom Panels](/dmx-core-100/scheduling-automation/custom-panels) and [Custom Menus](/dmx-core-100/scheduling-automation/custom-menus) are paused: their buttons and sliders do nothing, and a notice says so. Schedules and input triggers keep running.

This makes demo mode suitable for evaluation, pre-programming, and learning the system, but not for live production use.

## Licenses

Purchasing a license removes the demo interruptions. A license is tied to the machine it is activated on. There are two:

| | Basic | Full |
|---|---|---|
| Universes sent | 8 | No limit |
| Cues, presets, sounds, schedules, effects, fixtures | Yes | Yes |
| Custom Menus, input triggers, output events, Integration API | Yes | Yes |
| Recording | No limit | No limit |
| [Timelines](/dmx-core-100/playback/timelines) | No | Yes |
| [Custom Panels](/dmx-core-100/scheduling-automation/custom-panels) | No | Yes |
| [Music Mode](/dmx-core-100/lighting/music-mode) (with Follow Music and audio-reactive effects) | No | Yes |
| [Stream routing](/dmx-core-100/lighting/stream-routing) | No | Yes |
| [Channel Rules](/dmx-core-100/playback/channel-rules) | No | Yes |
| [Audio Routing](/dmx-core-100/playback/sounds#multichannel-audio) | No | Yes |
| [Plugins](/dmx-core-100/integrations/plugins) | No | Yes |
| Main Unit for [Linked Units](/dmx-core-100/integrations/linked-units) | No | Yes |

### Basic License

The Basic license is for a smaller, fixed setup. What it leaves out is hidden in the Web UI and on the touchscreen, and is refused over the API, OSC and schedules too.

- **8 universes.** Any number of outputs can be set up, but only 8 universes are sent, counted by slot: one slot sent to several destinations or protocols counts once. The outputs created first come first. When more are set up, a **Universe limit** configuration notice says how many are not sent.
- **Your content stays.** Timelines, panels, rules and plugin settings from a Full unit or a backup are kept, just not used. Moving to a Full license brings them back.
- A Basic unit can be a [Satellite Unit](/dmx-core-100/integrations/linked-units); that needs no license of its own.

### Full License

The Full license has every feature and no limit on universes.

:::note
Purchase a license at [dmxprosales.com](https://dmxprosales.com/products/dmx-core-100-software-license).
:::

## Available Platforms

| Platform | Architecture | Distribution |
|----------|-------------|--------------|
| Windows 10/11 | x64 | Signed installer (.exe) |
| macOS | ARM64 (Apple Silicon, M1 or later) | Direct download |
| macOS | x64 (Intel) | Direct download |
| Linux | x64, ARM64 | Snap Store |

## Web Interface

The desktop software includes the same built-in Web UI as the hardware device. Once the software is running, you can access the Web UI from any browser on the same network. See [Connecting to the Web UI](/dmx-core-100/getting-started/connecting-to-the-web-ui) for details.

The default ports are **HTTP 8000** and **HTTPS 8001**.

See the platform-specific pages for installation instructions:

* [Windows](windows)
* [macOS](mac)
* [Linux](linux)
