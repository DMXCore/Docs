---
title: Cues
description: Record and play back DMX lighting shows
---

Cues are recorded DMX sequences (shows) that can be played back on demand, on a schedule, or triggered externally. They capture the exact DMX data from your lighting software so it can be replayed at any time.

## Viewing and Playing Cues

On the **touchscreen**, navigate to **Main Menu > Cues** to see the list. Tap a cue to instantly start playback. Long-hold a cue to access its settings.

![Cues list](https://github.com/DMXCore/DmxCore100/assets/407941/301c68c9-e8e3-4e28-ad8e-aa1bfa84f8cb)

In the **Web UI**, go to **Lighting > Cues**. The list view shows additional details including duration and file size. Click a cue name to open its detail page, or use the play button to start playback directly from the list.

<!-- SCREENSHOT: Web UI cue list showing columns and play button (dark mode) -->

:::note[Interface differences]
- **Touchscreen**: Tap to play, long-hold for settings.
- **Web UI**: Click the play icon to play. Click the cue name to open the detail/edit page. The Web UI also provides a progress bar with pause, resume, and scrub controls during playback.
:::

## Cue Settings

![Cue settings](https://github.com/DMXCore/DmxCore100/assets/407941/894bb4c4-7262-40f5-a259-ce9d88f1e65d)

Each cue has the following settings:

- **Code** — A unique identifier used in API trigger events and external control
- **Name** — Display name for the cue
- **Fade In / Fade Out** — Duration for smooth transitions when starting and stopping playback
- **Loop** — Number of times to repeat playback (or infinite loop)
- **Dimmer** — Overall brightness level for the cue output

### Fade Mask

:::tip[Web UI only]
The Web UI provides a **Fade Mask Editor** (under **Settings > Cue Fade Masks**) that lets you select which DMX channels should participate in fades. Channels excluded from the mask will switch instantly instead of fading. This is useful for channels that control non-dimmable functions like gobos or color wheels.
:::

## Playback Controls

During playback, the **Web UI** dashboard shows:

- A **progress bar** indicating the current position in the cue
- **Pause/Resume** controls
- **Scrub** capability — drag the progress bar to jump to any position
- **Stop** button

On the **touchscreen**, the home screen shows the currently playing cue with a stop button.

## Cloning Cues

In the **Web UI**, you can clone (duplicate) a cue to create a copy with the same DMX data but a new name and code. This is useful for creating variations with different fade or loop settings.

## Technical Details

Cues are stored as Wireshark PCAP files internally and can be either ArtNet or sACN. They are automatically converted during playback if the output protocol differs from the format used during recording.

The `code` field is used in API trigger events and external control protocols. Codes must be unique and cannot be empty.
