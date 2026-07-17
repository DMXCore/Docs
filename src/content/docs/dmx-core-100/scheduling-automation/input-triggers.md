---
title: Input Triggers
description: Trigger actions and drive levels from external signals
---

Input triggers make the DMX Core 100 react to the outside world — a DMX channel crossing a threshold, an OSC or MQTT message, an HTTP request, a contact closure. A trigger either **runs an action** (play a cue, apply a preset, run a script) or **drives a level** directly from the signal's value.

:::tip[Web UI only]
Input triggers are configured under **Control & Integrations > Input Triggers**.
:::

<!-- SCREENSHOT: Web UI input triggers list (dark mode) -->

## Input Types

| Type | Description |
|------|-------------|
| **Art-Net / sACN** | A DMX channel in an incoming network stream reaching a threshold |
| **DMX Serial** | A DMX channel on the optional DMX-512 board's input |
| **OSC** | An OSC message on the configured address |
| **MQTT** | A message published to an MQTT topic (requires the [MQTT integration](/dmx-core-100/integrations/mqtt)) |
| **HTTP** | An HTTP request to a path you define (e.g. `/hooks/party-mode`) |
| **TCP / UDP** | Raw data arriving on a TCP or UDP port |
| **Digital Input** | A physical contact closure / GPIO input |

## Two Modes

- **On/Off — run an action.** The trigger fires its action when the signal arrives (or crosses the threshold).
- **Value — set a level from the payload.** The numeric payload drives a target level continuously — a [Control Value](/dmx-core-100/integrations/control-values) (e.g. a Symetrix volume), the master dimmer, or a zone intensity. A wall fader sending OSC or DMX becomes a live level control.

Value-mode triggers can name a **[Transform Script](/dmx-core-100/scheduling-automation/scripting#transform-scripts)** that reshapes the normalized 0–1 value before it lands — response curves, dead zones, thresholds.

## Actions

An On/Off trigger can: Apply Ambient Preset, Apply Preset, set/step a [Control Value](/dmx-core-100/integrations/control-values), Fade Out, Fire Output Event, Play Cue, Play Sound, Play Timeline, [Run Script](/dmx-core-100/scheduling-automation/scripting), Stop Playback, Tap Tempo, Toggle Mute, or Toggle Schedule.

For complex logic — conditions, sequencing, payload parsing — use **Run Script**: the raw payload arrives in the script as `ctx.payload`.

## Trigger Settings

- **Code** — unique identifier (checked for duplicates)
- **Name** — display name
- **Enabled** — turn the trigger on or off without deleting it
- **Address** — the OSC address, HTTP path, MQTT topic, port, or channel to match

## Recording Triggers

Starting a [recording](/dmx-core-100/playback/recording) from an external signal is configured on the Record page itself, as part of the recorder configuration.
