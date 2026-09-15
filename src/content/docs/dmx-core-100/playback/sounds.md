---
title: Sounds
description: Manage and play audio files
---

The DMX Core 100 supports audio playback synchronized with your lighting. Sounds can be played alongside cues, used in timelines, or triggered independently via schedules and external control.

## Audio Requirements

On the hardware unit, audio playback requires a USB sound card or the optional onboard audio board connected via the piggy-back connector; the [desktop software](/dmx-core-100/desktop-software) uses the computer's own audio output. Select the audio device and sample rate under **Device > System**. The system supports **WAV**, **MP3**, **FLAC**, **OGG**, and **AIFF** audio file formats.

## Managing Sounds

:::tip[Web UI only]
Sound management is available in the Web UI under **Lighting > Sounds**. The touchscreen can trigger sound playback (via cues, schedules, or custom menus) but does not provide a dedicated sound management interface.
:::

![Sounds list in the Web UI](/assets/web/sounds-list.png)

### Uploading Sounds

1. In the Web UI, go to **Lighting > Sounds**
2. Click **Import** and pick a WAV, MP3, FLAC, OGG, or AIFF file
3. The sound is added to the list, named after the file, and ready to use

Audio can also be placed with **File Explorer** instead — a file uploaded there is available for import as a sound.

### Sound Settings

Each sound's detail page has:

- **Name** — Display name
- **Code** — Unique identifier for API and external control
- **Volume** — Playback volume level

**Loop** and **Fade Duration** are not per-sound fields. They live on the Sounds list as **Default Settings** (**Lighting > Sounds**), the same pattern as [cues](/dmx-core-100/playback/cues#default-settings).

## Playback Controls

During sound playback, the Web UI dashboard shows:

- A **progress bar** with current position and total duration
- **Pause/Resume** controls
- **Scrub** — Drag the progress bar to jump to any position
- **Stop** button

## Aligning audio with lighting

There is no Audio Delay setting on a sound. To shift a cue's attached sound relative to the lighting, set that cue's **Sound Offset** (see [Attached Sound](/dmx-core-100/playback/cues#attached-sound)). To fire metronome-synced effects early to compensate for fixture lag, use **Output Latency** on the [Tempo](/dmx-core-100/lighting/tempo#output-latency) page (metronome only).

## Cloning Sounds

You can clone (duplicate) a sound in the Web UI to create a copy with different settings (e.g., different volume or loop count) while sharing the same audio file.
