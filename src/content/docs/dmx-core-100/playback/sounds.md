---
title: Sounds
description: Manage and play audio files
---

The DMX Core 100 supports audio playback synchronized with your lighting. Sounds can be played alongside cues, used in timelines, or triggered independently via schedules and external control.

## Audio Requirements

Audio playback requires a USB sound card or the optional onboard audio board connected via the piggy-back connector. The system supports **WAV** and **FLAC** audio file formats.

## Managing Sounds

:::tip[Web UI only]
Sound management is available in the Web UI under **Lighting > Sounds**. The touchscreen can trigger sound playback (via cues, schedules, or custom menus) but does not provide a dedicated sound management interface.
:::

<!-- SCREENSHOT: Web UI sounds list page (dark mode) -->

### Uploading Sounds

1. In the Web UI, go to **File Explorer**
2. Upload your audio file (WAV or FLAC format)
3. The file will be available for import as a sound

### Sound Settings

Each sound has the following configurable properties:

- **Name** — Display name
- **Code** — Unique identifier for API and external control
- **Volume** — Playback volume level
- **Loop** — Number of times to repeat, or infinite loop
- **Fade Duration** — Fade in/out time when starting and stopping playback

## Playback Controls

During sound playback, the Web UI dashboard shows:

- A **progress bar** with current position and total duration
- **Pause/Resume** controls
- **Scrub** — Drag the progress bar to jump to any position
- **Stop** button

## Audio Delay

The audio delay setting lets you offset the audio playback timing relative to DMX output. This is useful when there is a noticeable delay between the audio system and lighting fixtures, allowing you to synchronize them precisely.

## Cloning Sounds

You can clone (duplicate) a sound in the Web UI to create a copy with different settings (e.g., different volume or loop count) while sharing the same audio file.
