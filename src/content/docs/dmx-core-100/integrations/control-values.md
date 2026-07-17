---
title: Control Values
description: Bridge Q-SYS and Symetrix DSP controls to faders, menus, triggers, and scripts
---

Control Values connect named controls on a **QSC Q-SYS** or **Symetrix** DSP core — audio levels, source selectors, mutes — to the DMX Core 100's own control points. Once defined, a Control Value can be driven from a [control surface](/dmx-core-100/control-surfaces) knob, a [custom menu](/dmx-core-100/scheduling-automation/custom-menus) slider, an [input trigger](/dmx-core-100/scheduling-automation/input-triggers), a [timeline](/dmx-core-100/playback/timelines) track, or a [script](/dmx-core-100/scheduling-automation/scripting-api#control-values) — with the current DSP state reflected back everywhere.

A typical install: a wall fader (via input trigger), a Stream Deck knob, and a custom menu slider all bound to the same `VOL1` Control Value, which maps to a Symetrix volume controller. Move any of them — or change the volume from the DSP side — and every surface updates.

:::tip[Web UI]
Control Values are managed under **Control & Integrations > Control Values**. The DSP connection itself is configured under **Control & Integrations > Plugins** — see [Q-SYS & Symetrix](/dmx-core-100/external-control).
:::

<!-- SCREENSHOT: Control Values list showing code, kind, mapping, and live value columns (dark mode) -->

## Kinds

| Kind | Holds | Example |
|------|-------|---------|
| **Level** | A continuous 0–100% value | Room volume |
| **Selector** | One choice from a list | Source select (Input A / Input B / …) |
| **Toggle** | On or off | Mute |

## Settings

Each Control Value has:

- **Code / Short Name** — the identifier used in menus, triggers, timelines, and scripts (e.g. `VOL1`)
- **Kind** — Level, Selector, or Toggle
- **Plugin** — Symetrix or Q-SYS
- **Controller Number** — the controller number assigned in SymNet Composer (or the named control in Q-SYS Designer)
- **Status Controller** *(optional)* — read state from a different controller than the one written to. Use when a trigger writes one control but the real state is reported by another (e.g. a relay or wall panel)
- **Step Size** — how far Up/Down operations move a Level (default 5%)
- **Linked Mute Controller** *(optional)* — a mute controller linked to this level, with an optional **Unmute On Level Change** behavior

## Operations

Anything that targets a Control Value can perform:

- **Set value** — a level percentage, a selector choice, or on/off
- **Up / Down** — step a Level by its step size, or move a Selector through its choices
- **Toggle** — flip a Toggle kind (or a linked mute)

Value-mode [input triggers](/dmx-core-100/scheduling-automation/input-triggers) feed their numeric payload straight into a Level — optionally shaped by a [transform script](/dmx-core-100/scheduling-automation/scripting#transform-scripts) for response curves and dead zones. Timed ramps fade a level smoothly to its target instead of jumping.

## Live State Everywhere

The current value is shown in the Control Values list and is pushed to every bound surface: LED colors on keypads, knob displays on a Stream Deck, OSC feedback to TouchOSC layouts, highlight states on custom menu items, and `dmx.controlValue.get()`/`status()` in scripts.
