---
title: Layers & Priority
description: How concurrent playback combines — playback layers, merge mode, and sACN priority
---

When more than one thing wants to control the same universe — two cues, a cue and the fixture engine, or the DMX Core 100 and an external console — these rules decide what wins.

## Playback Layers

Every cue has a **Playback Layer** number (default 0):

- Cues on the **same layer replace each other** — starting a cue stops whatever else is playing on its layer. This is the classic one-show-at-a-time behavior.
- Cues on **different layers play together** — for example, a background wash loop on layer 0 while short accent cues fire on layer 1.

Set the layer on each cue's detail page. See [Cues](/dmx-core-100/playback/cues).

## Merge Mode

When two sources are active on the same universe with equal priority, the global **Merge Mode** decides how they combine:

- **Blend** — channels are mixed together
- **HTP** — highest takes precedence, per channel

Merge Mode is set under **Lighting Setup > Protocol** in the Web UI.

## Priorities

Priorities decide which source owns a universe when they overlap. Higher priority wins outright; equal priorities merge using the Merge Mode above.

- **Cue priority** — cues normally replay with the sACN priority they were recorded with. A cue's **Priority Override** (1–200) replaces that, letting you pin a specific cue above or below other playback.
- **Fixture Control Priority** — the priority used by the fixture engine (fixture control, presets, effects), set under **Lighting Setup > Protocol** (default 100).
- **Outputs** — each sACN output also has a per-output **Send Priority** ([Output Config](/dmx-core-100/configuration/output-config)), which is what downstream sACN receivers use when merging the DMX Core 100 against *other* consoles on the network.

:::tip[Letting a console take over]
The classic house-of-worship setup: give the DMX Core 100's output a low sACN send priority so the main lighting console always wins when it's active, and the DMX Core 100's schedule takes back over when the console goes quiet.
:::

## End of Data

When playback stops and nothing else is active, the **End of Data** setting (**Lighting Setup > Protocol**) controls what the outputs do:

| Option | Behavior |
|--------|----------|
| **Repeat last** | Keep sending the last frame |
| **Blackout** | Send 0% on all channels, keep the stream alive |
| **Stop output** | Stop the stream (receivers may time out) |
| **Blackout and stop** | Send 0%, then stop the stream |

If an [ambient preset](/dmx-core-100/playback/presets#ambient-presets) is configured, it takes over instead — the venue never goes unexpectedly dark. See also [Blackout and Stop](/dmx-core-100/basics/blackout-and-stop) for the touchscreen controls.
