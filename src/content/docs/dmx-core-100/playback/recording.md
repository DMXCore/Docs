---
title: Recording
description: Capture DMX data as cues or presets
---

The DMX Core 100 can record DMX data from external sources (lighting software, consoles, etc.) and save it as cues or presets for later playback.

:::tip[No external source handy?]
You don't need external lighting software to get started. Use **Create Demo Data** under **Backup & Restore** to load ready-made [demo cues, presets, sounds, and effects](/dmx-core-100/configuration/backup-and-restore#demo-data).
:::

## Recording on the Touchscreen

Navigate to **Main Menu > Utilities > Record**.

![Record Cue screen](/assets/device/record-cue.png)

1. Press **Preview** to start listening for ArtNet or sACN packets (depending on output configuration). The universe IDs are taken from the output configuration. Any active playback will be stopped.

2. You'll see a graphical representation of all the DMX channels per universe during preview:

![Record Cue — previewing with DMX channel monitor](/assets/device/record-cue-preview.png)

3. While previewing, capture what you need:
   - Press **Save Cue** to record a full show (dynamic sequence) until you stop recording
   - Press **Save Snapshot** to capture a single moment of the current DMX state as a preset

4. You can rename the recording later from the [Cues](/dmx-core-100/playback/cues) or [Presets](/dmx-core-100/playback/presets) list.

Use the **Stop** button to stop preview without capturing anything.

## Recording in the Web UI

In the **Web UI**, go to **Utilities > Record**. The Web UI recording interface provides additional features:

![Recording page with the input mapping](/assets/web/record.png)

- **Input mapping configuration** — Configure which input source (ArtNet, sACN, DMX-512, KiNet) to listen to and how incoming universes map to slots
- **Trigger** — Start recording manually, or automatically from an external signal (DMX threshold, HTTP, TCP, UDP, or OSC)
- **Real-time monitoring** — View incoming DMX data as it arrives, with the recorded size and remaining recording space shown while recording
- **Audio association** — Link an audio file to a cue during recording

## Input Sources

The DMX Core 100 can record from the following input sources:

| Source | Description |
|--------|-------------|
| ArtNet | Network DMX protocol (UDP) |
| sACN (E1.31) | Network DMX protocol (multicast/unicast) |
| DMX-512 | Direct DMX input via optional 2-port DMX board |
| KiNet | Color Kinetics network protocol |

## Timing Accuracy

Every incoming packet is timestamped when it arrives, so the recording preserves the original timing of the source. On the DMX Core 100 hardware unit this is always wire-accurate. When recording with the desktop software on Windows, wire-accurate timestamps require a one-time network adapter setting — see [Wire-Accurate Recording Timestamps](/dmx-core-100/desktop-software/windows#wire-accurate-recording-timestamps). Without it, recording still works with slightly less precise application-level timestamps.

## Triggered Recording

The recorder's **Trigger** setting starts recording automatically when a specific event occurs — for example, when a DMX channel exceeds a threshold value, or when an HTTP, TCP, UDP, or OSC message arrives. This is configured on the Record page as part of the recorder configuration.
