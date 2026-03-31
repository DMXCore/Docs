---
title: Effects
description: Apply dynamic lighting effects to fixtures and zones
---

The effects engine lets you apply dynamic, animated lighting effects to your fixtures. Effects run continuously, creating patterns like breathing, fire, pulsing, and more — without needing to record cues.

Effects are accessed through **Fixture Control** — select a fixture or zone and apply an effect from there. If you have multiple zones configured, each zone has its own effects controls.

<!-- SCREENSHOT: Web UI Effects list page (dark mode) -->

## Built-in Effect Generators

The DMX Core 100 includes several built-in effect generators:

| Generator | Description |
|-----------|-------------|
| Breathing | Smooth fade up and down, like a breathing rhythm |
| Crackling | Random flickering similar to crackling embers |
| Fire | Simulates a flickering fire effect |
| Flickering | Random brightness variations |
| Full Sinus | Smooth sinusoidal wave pattern |
| Lightning | Dramatic random flashes |
| Pulse | Sharp on/off pulsing |

Each generator has configurable parameters that control speed, intensity, and behavior.

## Applying Effects

Open **Fixture Control** and select the fixture or zone you want to animate. The effects controls appear in the panel. Choose a generator, configure the parameters, and the effect starts immediately.

If you have multiple zones, effects can be applied per zone — navigate to a zone in the Fixture Control page to see its effects controls.

<!-- SCREENSHOT: Web UI effect editor with generator selection and parameters (dark mode) -->

### Effect Assignment via Presets

Effects can be saved as part of a [preset](/dmx-core-100/playback/presets). When the preset is activated, the effect starts running. When the preset is stopped, the effect stops. This is the main way to trigger effects from the touchscreen or via schedules and external control.

## Effect Dimmer

Each effect has a dimmer level that controls the overall intensity of the effect. You can set the dimmer at the global, zone, or fixture level, giving you fine-grained control over how strongly the effect is applied.

## Fade Duration

Effects support configurable fade durations that control how quickly the effect starts and stops. You can set a default fade duration for all effects, or override it per effect.
