---
title: Input Triggers
description: Trigger actions from external signals
---

Input triggers let you start playback, recording, or other actions in response to external signals. For example, you can trigger a cue when a DMX channel exceeds a threshold, when an OSC message is received, or when an MQTT topic publishes a value.

:::tip[Web UI only]
Input trigger configuration is available in the Web UI under **Settings > Input Triggers**.
:::

<!-- SCREENSHOT: Web UI input triggers list -->

## Creating an Input Trigger

1. In the Web UI, go to **Settings > Input Triggers**
2. Click **Add** to create a new trigger
3. Select the **Input Type** (see below)
4. Configure the trigger conditions
5. Set the **Action** — what should happen when the trigger fires
6. Click **Save**

## Input Types

| Type | Description |
|------|-------------|
| **DMX** | Triggers when a specific DMX channel reaches a threshold value. Configure the universe, channel, threshold level, and trigger mode (rising edge, falling edge, or both). |
| **OSC** | Triggers when a specific OSC message is received on the configured port. Specify the OSC address pattern to match. |
| **MQTT** | Triggers when a message is published to a specific MQTT topic. Requires [MQTT integration](/dmx-core-100/integrations/mqtt) to be configured. |
| **HTTP** | Triggers via HTTP request to a specific endpoint. |
| **TCP** | Triggers when data is received on a TCP port. |
| **UDP** | Triggers when data is received on a UDP port. |

## Trigger Actions

When a trigger fires, it can perform actions such as:

- Play a cue, preset, sound, or timeline
- Start recording
- Stop playback
- Toggle a schedule

## Trigger Settings

- **Name** — Display name for the trigger
- **Enabled** — Turn the trigger on or off without deleting it
- **Code** — Unique identifier

## Duplicate Code Detection

The system checks for empty and duplicate trigger codes to prevent conflicts. Each trigger must have a unique, non-empty code.
