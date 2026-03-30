---
title: Effects
description: Apply dynamic lighting effects to fixtures and zones
---

The effects engine lets you apply dynamic, animated lighting effects to your fixtures. Effects run continuously, creating patterns like breathing, fire, pulsing, and more — without needing to record cues.

:::tip[Web UI only]
Effects are managed in the Web UI under **Lighting > Effects**. Effects can be previewed and assigned to presets for use from both the touchscreen and the Web UI.
:::

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

## Creating an Effect

1. Go to **Lighting > Effects** in the Web UI
2. Click **Add** to create a new effect
3. Select an **Effect Generator** from the list
4. Configure the effect parameters (speed, intensity, etc.)
5. Click **Save**

<!-- SCREENSHOT: Web UI effect editor with generator selection and parameters (dark mode) -->

## Previewing Effects

You can preview an effect before applying it to your fixtures. Click the **Preview** button on the effect detail page to see the effect in action on the selected fixtures.

## Applying Effects

Effects can be applied at different levels:

- **Global** — Apply an effect to all fixtures
- **Zone** — Apply an effect to all fixtures within a specific [zone](/dmx-core-100/lighting/zones)
- **Fixture** — Apply an effect to an individual fixture

### Effect Assignment via Presets

The most common way to use effects is by assigning them to a [preset](/dmx-core-100/playback/presets). When the preset is activated, the effect starts running. When the preset is stopped, the effect stops.

## Effect Dimmer

Each effect has a dimmer level that controls the overall intensity of the effect. You can set the dimmer at the global, zone, or fixture level, giving you fine-grained control over how strongly the effect is applied.

## Fade Duration

Effects support configurable fade durations that control how quickly the effect starts and stops. You can set a default fade duration for all effects, or override it per effect.
