---
title: Timelines
description: Sequence cues, presets, sounds, levels, and scripts into timed shows
---

Timelines choreograph complete shows: cues, presets, effects, sounds, [Control Value](/dmx-core-100/integrations/control-values) moves, and [scripts](/dmx-core-100/scheduling-automation/scripting) arranged on a visual multi-track editor, all firing at exact times.

:::tip[Web UI only]
The timeline editor is a Web UI feature, under **Lighting > Timelines**. Timelines can be played back from anywhere — touchscreen, schedules, custom menus, control surfaces, and triggers.
:::

<!-- SCREENSHOT: Timeline editor with cue, sound, control value, and script events on tracks (dark mode) -->

## Timeline Settings

Each timeline has a **code** and **name**, plus:

- **Duration** — the total length of the timeline
- **Loop** — how many times to repeat (0 = forever)
- **Dimmer** — overall brightness for the timeline's playback
- **Fade-In / Fade-Out** — smooth start and end for the whole timeline
- **Description**, **Favorite**, and **Only Admin** flags

## The Editor

Open a timeline and click **Editor**. Drag events from the **Available Events** panel — cues, presets, sounds, effects, control values, and scripts — onto the tracks, then drag to position and resize them.

- **Cue tracks** — cue events show an **intensity profile** you can shape, ramping the cue's dimmer over its duration (fade a show in over ten seconds, dip it in the middle, out at the end)
- **Sound tracks** — audio events render their **waveform** on the track, making it easy to line lighting hits up with the music
- **Control Value tracks** — move levels (like a DSP volume) at exact points in the show
- **Other events** — script events run a [script](/dmx-core-100/scheduling-automation/scripting) at an exact timestamp

A playhead with **seek/scrub** lets you preview any point; **zoom** and snapping make fine alignment easy.

## Playback Controls

During playback, the Web UI provides a progress bar with **pause/resume**, **seek/scrub**, and **stop** — on the timeline page and on the dashboard.

## Triggering Timelines

Timelines can be started from:

- **Web UI** — the play button in the timeline list
- **Touchscreen** — via [schedules](/dmx-core-100/scheduling-automation/schedules) or [custom menus](/dmx-core-100/scheduling-automation/custom-menus)
- **Control surfaces** — a Play Timeline button assignment
- **External control** — API, OSC, MQTT, or other [input triggers](/dmx-core-100/scheduling-automation/input-triggers)
- **Scripts** — `dmx.playTimeline(code)`

## Duplicating Timelines

Duplicate a timeline from its detail page to create variations of an existing sequence.
