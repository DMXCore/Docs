---
title: Timelines
description: Sequence cues, presets, and sounds into timed shows
---

Timelines let you create complex, multi-step lighting sequences by arranging cues, presets, and sounds on a visual timeline. Each event in the timeline triggers at a specific time, allowing you to build precisely choreographed shows.

:::tip[Web UI only]
The timeline editor is a Web UI feature, available under **Lighting > Timelines**. Timelines can be played back from both the touchscreen (via schedules and custom menus) and the Web UI.
:::

<!-- SCREENSHOT: Web UI timeline editor showing events on the timeline -->

## Creating a Timeline

1. In the Web UI, go to **Lighting > Timelines**
2. Click **Add** to create a new timeline
3. Give the timeline a name and code
4. Use the visual editor to add and arrange events

## Timeline Events

Each event in a timeline specifies:

- **Type** — What to trigger: a cue, preset, or sound
- **Time** — When the event should fire (relative to the timeline start)
- **Item** — Which specific cue, preset, or sound to play

Events are displayed on a visual timeline where you can drag them to adjust timing.

## Timeline Settings

- **Name** — Display name for the timeline
- **Code** — Unique identifier for API and external control
- **Loop** — Number of times to repeat the entire timeline
- **Priority** — Controls how the timeline interacts with other active playback

## Playback Controls

During timeline playback, the Web UI provides:

- **Progress bar** showing current position in the timeline
- **Seek/Scrub** — Jump to any position by dragging the progress bar
- **Pause/Resume** — Temporarily halt and continue playback
- **Stop** — End playback immediately

## Triggering Timelines

Timelines can be triggered from:

- **Web UI** — Click the play button in the timeline list
- **Touchscreen** — Via [schedules](/dmx-core-100/scheduling-automation/schedules) or [custom menus](/dmx-core-100/scheduling-automation/custom-menus)
- **External control** — Via API, OSC, MQTT, or other [input triggers](/dmx-core-100/scheduling-automation/input-triggers)

## Cloning Timelines

You can clone a timeline in the Web UI to create a copy, which is useful for creating variations of an existing sequence.
