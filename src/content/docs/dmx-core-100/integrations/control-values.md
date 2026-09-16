---
title: Control Values
description: Named values shared by knobs, faders, menus, triggers, scripts and DSPs — with or without a Q-SYS or Symetrix behind them
---

A Control Value is a named value — "bar volume", "main source", "house dimmer" — that every control in the system can share. Once defined, it can be driven from a [control surface](/dmx-core-100/control-surfaces) knob, a [custom menu](/dmx-core-100/scheduling-automation/custom-menus) slider, the [Faders](/dmx-core-100/lighting/faders#controls) page, an [input trigger](/dmx-core-100/scheduling-automation/input-triggers), a [timeline](/dmx-core-100/playback/timelines) track, or a [script](/dmx-core-100/scheduling-automation/scripting-api#control-values), and whichever of them moves it, every other one follows.

Two kinds of backend hold the value:

- A **QSC Q-SYS** or **Symetrix** DSP core, where the Control Value maps to an audio level, source selector or mute on the DSP. The DSP is the source of truth; changes made on the DSP side are reflected back everywhere.
- **Internal (no DSP)** — the DMX Core 100 keeps the value itself. Use it to give several controls one shared handle on something, typically a light: see [Driving a fixture, zone or master](#driving-a-fixture-zone-or-master).

A typical install: a wall fader (via input trigger), a Stream Deck knob, and a custom menu slider all bound to the same `VOL1` Control Value, which maps to a Symetrix volume controller. Move any of them — or change the volume from the DSP side — and every surface updates.

:::tip[Web UI]
Control Values are managed under **Control & Integrations > Control Values**. The DSP connection itself is configured in the DSP plugin's settings on the [Plugins page](/dmx-core-100/integrations/plugins) — see [Q-SYS & Symetrix](/dmx-core-100/external-control).
:::

![Control Values list with live Symetrix status](/assets/web/control-values-list.png)

![Control Value editor — Level (volume)](/assets/web/control-value-level.png)

![Control Value editor — Selector with Add Choice](/assets/web/control-value-editor.png)

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
- **Plugin** — which backend holds the value: **Internal (no DSP)**, or an installed DSP plugin that registers as a Control Value backend (Symetrix, Q-SYS, …). The dropdown lists only what is installed
- **Controller Number** — the controller number assigned in SymNet Composer (or the named control in Q-SYS Designer). Not shown for an internal Control Value
- **Status Controller** *(optional, DSP only)* — read state from a different controller than the one written to. Use when a trigger writes one control but the real state is reported by another (e.g. a relay or wall panel)
- **Step Size** — how far Up/Down operations move a Level (default 5%)
- **Linked Mute Controller** *(optional, DSP only)* — a mute controller linked to this level, with an optional **Unmute On Level Change** behavior
- **Drives** *(Level only)* — a target this Control Value continuously drives; see [below](#driving-a-fixture-zone-or-master)

For a **Selector**, define the choices on the same page:

- **Add Choice** — add a named choice
- **Prefill Values** — fill typical values
- **Wrap Around** — when on, Up past the last choice wraps to the first (and Down from the first wraps to the last); when off, Up/Down stops at the ends

## Operations

Anything that targets a Control Value can perform:

- **Set value** — a level percentage, a selector choice, or on/off
- **Up / Down** — step a Level by its step size, or move a Selector through its choices
- **Toggle** — flip a Toggle kind (or a linked mute)

Value-mode [input triggers](/dmx-core-100/scheduling-automation/input-triggers) feed their numeric payload straight into a Level — optionally shaped by a [transform script](/dmx-core-100/scheduling-automation/scripting#transform-scripts) for response curves and dead zones. Timed ramps fade a level smoothly to its target instead of jumping.

## Internal Control Values

Pick **Internal (no DSP)** as the plugin and the DMX Core 100 holds the value itself; no controller number is needed. An internal Control Value behaves exactly like a DSP-backed one everywhere it can be bound, it just has nothing on the far end — until you give it something to drive.

Its value survives a normal restart: internal levels are saved with the rest of the device state when the software shuts down cleanly (and whenever a cue, preset or sound is saved), and restored before anything can move them. After a power cut the value is whatever was last saved that way, the same rule the master dimmer follows.

## Driving a Fixture, Zone or Master

A **Level** Control Value can continuously **drive** one target: a fixture's intensity, a zone, the master dimmer, the audio volume, a fixture color channel, or another Control Value. Set it on the Control Value's page under **Drives** — the same target picker as a knob binding, with min/max scaling and invert.

![Control Value editor — Drives](/assets/web/control-value-drives.png)

Once set, the link works in both directions:

- Every control that writes the Control Value — a MIDI knob, a Stream Deck dial, a custom menu slider, a fader on the Faders page, a script, a timeline, a DSP wall panel — moves the target.
- When something else moves the target — a cue, a preset, a timeline, the fixture's own fader — the Control Value follows, so a knob or a DSP fader is never left stale and the next touch does not snap the light. A DSP-backed Control Value passes that on to the DSP, so a Symetrix wall knob follows a cue.

A Control Value that would drive itself is refused.

:::tip[Bind a knob directly, or go through a Control Value?]
For one control and one light, bind the knob straight to the fixture (a **Fixture Intensity** target on the surface or trigger). Go through a Control Value when several controls should share one light, when the value should be addressable by name from scripts, schedules and timelines, when a DSP is one of the controls, or when you want it as a named fader on the [Faders](/dmx-core-100/lighting/faders#controls) page.
:::

## Triggering From a Control Value

Control Values also work in the other direction: a **Control Value [input trigger](/dmx-core-100/scheduling-automation/input-triggers#control-value-triggers)** watches a Control Value and fires an action when it changes — a wall panel button plays a cue, a source selector landing on "Party" starts a timeline, a level crossing a threshold brings up the lights.

Any change counts, whoever made it: a DSP button, a custom menu slider, a schedule, a script or a fader on the Faders page. The one exception is the trigger's own action writing the same Control Value back, which never re-fires it. On startup the first reported value arms the trigger without firing.

## Live State Everywhere

The current value is shown in the Control Values list and is pushed to every bound surface: LED colors on keypads, knob displays on a Stream Deck, OSC feedback to TouchOSC layouts, highlight states on custom menu items, and `dmx.controlValue.get()`/`status()` in scripts.
