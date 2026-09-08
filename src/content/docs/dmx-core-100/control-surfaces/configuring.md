---
title: Configuring a Surface
description: Banks, sections, assignments, hold to confirm, and appearance in the control surface editor
---

Open a surface from **Control & Integrations > Control Surfaces** to edit it. The editor shows the live device connection status at the top, and is organized around three concepts: **banks**, **sections**, and **assignments**.

![Control surface editor with banks, sections, and the assignment grid](/assets/web/control-surface-editor.png)

## Sections

A section is a physical region of the device — a pad grid, a row of knobs, a fader strip. A Stream Deck +, for example, has three sections out of the box: **Buttons** (8 pads), **Knobs** (4 controls), and **Knob Presses** (4 pads).

Each section has:

- **Label** — a name for the region
- **Widget type** — **Pad** (buttons) or **Slider** (levels)
- **Columns** — the grid layout, plus a **Reversed** option for devices numbered the other way
- **Bank-scoped** — whether the section participates in banks (see below)

## Banks

Banks multiply the addressable controls on a small device: each bank holds its own set of assignments for every bank-scoped section, and switching banks swaps them all at once. A 8-pad device with 4 banks gives you 32 buttons.

- Each bank has a **name** and **active/inactive colors**, used for bank indicator feedback (and shown on the Stream Deck + LCD strip)
- Sections marked **pinned** (not bank-scoped) keep the same assignments in every bank — ideal for a master volume knob or a global stop button
- Bank switching is itself an assignable action (**Next Bank** / **Switch Bank**), and on the Stream Deck + you can also swipe the LCD strip

## Assignments

Click a control in the section grid to edit its assignment:

- **Label** — the text shown on LCD keys and in the operator view
- **Action** — what the control does. Available action types: Apply Ambient Preset, Apply Preset, [Control Value](/dmx-core-100/integrations/control-values) (set / up / down), Fade Out, Fire Output Event, Next Bank / Switch Bank, Play Cue, Play Sound, Play Timeline, [Run Script](/dmx-core-100/scheduling-automation/scripting), [Step Effect](/dmx-core-100/lighting/effects#sync-modes), Stop Playback, Tap Tempo, Toggle Mute, [Toggle Output](/dmx-core-100/configuration/output-config#toggling-all-output), and Toggle Schedule
- **Press mode** — Normal, Toggle on/off, Flash (hold), or — for Play Timeline actions — Momentary (release continues past a [Hold milestone](/dmx-core-100/playback/hold-milestones))
- **Hold to confirm** — the operator must keep the button pressed before the action fires (see below)

## Hold to confirm

Turn this on for actions that would be costly to hit by accident — [Blackout](/dmx-core-100/basics/blackout-and-stop), [Toggle Output](/dmx-core-100/configuration/output-config#toggling-all-output), Stop Playback, and similar. The operator keeps the button down for the duration set under **Device > System → Control surface hold to confirm (ms)** (default 1.5 seconds, 250–10000). Releasing early cancels; the action never fires.

While the button is held:

- **Stream Deck** — a ring sweeps around the key and the face darkens until the hold completes
- **Key Digital KD-WP8** — the LED blinks red / off
- **Akai LPD8 mk2** — the pad blinks
- **[Surface Operator](/dmx-core-100/control-surfaces/surface-operator)** in the browser — a Yes/No dialog instead of a hold, the same prompt custom menus use for **Require confirmation**

The option is disabled (with a reason) when the assignment already uses a hold gesture or has no release edge: Flash, Momentary, Control Value Up/Down, MIDI Program Change, OSC Toggle, and Stream Deck+ encoder-press buttons. Custom-menu **Require confirmation** is separate and unchanged.

## Appearance and LED feedback

Each assignment also controls how the button looks and how its LED behaves:

- **Icon** — an icon name (e.g. `play`, `stop`); leave empty for text-only buttons
- **Font size** — negative values render bold; set to 0 with an icon for icon-only keys
- **Background — Active** — shown while the action is engaged (preset playing, schedule on, mute on) or briefly during a tap-flash
- **Background — Inactive** — shown while the action is at rest

Colors accept names (`Blue`, `Red`, `Green`, …) or hex codes (`#FF0000`). On devices with simple LEDs (like the KD-WP8), the active/inactive colors map to the nearest LED state.

## Testing Your Layout

You don't need the physical device in hand to build a layout — click **Operate** at any time to drive the surface from the browser. See [Surface Operator](/dmx-core-100/control-surfaces/surface-operator).
