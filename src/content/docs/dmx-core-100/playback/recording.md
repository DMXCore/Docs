---
title: Recording
description: Capture DMX data as cues or presets
---

The DMX Core 100 can record DMX data from external sources (lighting software, consoles, etc.) and save it as cues or presets for later playback.

## Recording on the Touchscreen

Navigate to **Main Menu > Utilities > Record**.

![Record Cue screen](/assets/device/record-cue.png)

1. Press **Preview** to start listening for ArtNet or sACN packets (depending on output configuration). The universe IDs are taken from the output configuration. Any active playback will be stopped.

2. You'll see a graphical representation of all the DMX channels per universe during preview:

![Record Cue — previewing with DMX channel monitor](/assets/device/record-cue-preview.png)

3. While previewing, choose what to record:
   - **Preset** — Captures a single snapshot of the current DMX state
   - **Cue** — Records a full show (dynamic sequence) until you stop recording

4. Press **Save** to save the recording. You can rename it later from the [Cues](/dmx-core-100/playback/cues) or [Presets](/dmx-core-100/playback/presets) list.

Use the **Stop** button to stop preview without capturing anything.

## Recording in the Web UI

In the **Web UI**, go to **Utilities > Record**. The Web UI recording interface provides additional features:

<!-- SCREENSHOT: Web UI recording page with preview and input mapping (dark mode) -->

- **Input mapping configuration** — Configure which input sources (ArtNet, sACN, DMX-512, KiNet) to listen to and which universes to capture
- **Real-time monitoring** — View incoming DMX data as it arrives
- **Audio association** — Link an audio file to a cue during recording

## Input Sources

The DMX Core 100 can record from the following input sources:

| Source | Description |
|--------|-------------|
| ArtNet | Network DMX protocol (UDP) |
| sACN (E1.31) | Network DMX protocol (multicast/unicast) |
| DMX-512 | Direct DMX input via optional 2-port DMX board |
| KiNet | Color Kinetics network protocol |

## Input Triggers for Recording

You can also configure [input triggers](/dmx-core-100/scheduling-automation/input-triggers) to start recording automatically when a specific event occurs — for example, when a DMX channel exceeds a threshold value, or when an OSC message is received.
