---
title: Cues
description: Record and play back DMX lighting shows
---

Cues are recorded DMX sequences (shows) that can be played back on demand, on a schedule, or triggered externally. They capture the exact DMX data from your lighting software so it can be replayed at any time.

:::tip[No cues yet?]
To get example cues without recording anything, use **Create Demo Data** under **Backup & Restore**. See [Demo Data](/dmx-core-100/configuration/backup-and-restore#demo-data).
:::

## Viewing and Playing Cues

On the **touchscreen**, navigate to **Main Menu > Cues** to see the list. Tap a cue to instantly start playback. Long-hold a cue to access its settings.

![Cues list](/assets/device/cues-list.png)

The top bar expands to show playback controls — tap the arrow to toggle it. Controls include global Fade Out, Stop, and adjustable Loop, Fade In, and Fade Out settings.

![Cues list with playback controls expanded](/assets/device/cues-list-controls.png)

In the **Web UI**, go to **Lighting > Cues**. The list shows duration and size, with play buttons and per-cue download. Click a cue name to open its detail page.

![Cues list in the Web UI](/assets/web/cues-list.png)

:::note[Interface differences]
- **Touchscreen**: Tap to play, long-hold for settings.
- **Web UI**: Click the play icon to play, the cue name to edit. The Web UI also provides a progress bar with pause, resume, and scrub controls during playback.
:::

## Cue Settings

Long-hold a cue on the touchscreen, or open it in the Web UI, to edit its settings:

![Cue settings — fields](/assets/device/cue-settings.png)

![Cue settings — actions](/assets/device/cue-settings-actions.png)

- **Code** — A unique identifier used in API trigger events and external control
- **Name / Description** — Display name and notes
- **Fade In / Fade Out** — Duration for smooth transitions when starting and stopping playback
- **Loop** — Number of times to repeat playback (0 = forever)
- **Bounce Playback** — Play forward then backward for seamless looping
- **In-point / Out-point** — Trim playback to a portion of the recording
- **Dimmer** — Overall brightness level for the cue output
- **Only Admin** — Hide the cue from non-admin users
- **Favorite** — Show the cue in [Favorites](/dmx-core-100/scheduling-automation/favorites)

### Attached Sound

A cue can have a **sound** attached so audio and lighting always start together. The attachment has its own loop count, **Restart Sound at Loop** option, volume adjustment, and a **sound offset** to align audio with the lighting timeline (see also the [audio delay setting](/dmx-core-100/playback/sounds#audio-delay)).

### Layers and Priority

- **Playback Layer** — cues on the same layer replace each other; cues on different layers play together (default 0)
- **Priority Override** — an optional sACN priority (1–200) replacing the cue's recorded priority

See [Layers & Priority](/dmx-core-100/playback/layers-and-priority) for how concurrent playback combines.

### Fade Mask

:::tip[Web UI only]
The **Cue Fade Masks** editor (under **Lighting Setup**) selects which DMX channels participate in fades. Channels excluded from the mask switch instantly instead of fading — useful for non-dimmable functions like gobos or color wheels.
:::

## Playback Controls

During playback, the **Web UI** shows a progress bar with **pause/resume**, **scrub** (drag to any position), and **stop**. On the **touchscreen**, the home screen shows the currently playing cue with a stop button.

## Duplicating Cues

In the **Web UI**, duplicate a cue to create a copy with the same DMX data but a new name and code — useful for variations with different fade, loop, or layer settings.

## Technical Details

Cues are stored as Wireshark PCAP files internally and can be either ArtNet or sACN. They are automatically converted during playback if the output protocol differs from the format used during recording.

The `code` field is used in API trigger events and external control protocols. Codes must be unique and cannot be empty. Non-admin users can rename and delete cues they created within 24 hours of creation.
