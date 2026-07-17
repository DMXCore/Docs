---
title: Configuring a Surface
description: Banks, sections, assignments, and appearance in the control surface editor
---

Open a surface from **Control & Integrations > Control Surfaces** to edit it. The editor shows the live device connection status at the top, and is organized around three concepts: **banks**, **sections**, and **assignments**.

<!-- SCREENSHOT: Control surface editor showing banks, sections tabs, and the assignment grid (dark mode) -->

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
- **Action** — what the control does. Available action types: Apply Ambient Preset, Apply Preset, [Control Value](/dmx-core-100/integrations/control-values) (set / up / down), Fade Out, Fire Output Event, Next Bank / Switch Bank, Play Cue, Play Sound, Play Timeline, [Run Script](/dmx-core-100/scheduling-automation/scripting), Stop Playback, Tap Tempo, Toggle Mute, and Toggle Schedule
- **Press mode** — Normal, Toggle on/off, or Flash (hold)

### Appearance and LED feedback

Each assignment also controls how the button looks and how its LED behaves:

- **Icon** — an icon name (e.g. `play`, `stop`); leave empty for text-only buttons
- **Font size** — negative values render bold; set to 0 with an icon for icon-only keys
- **Background — Active** — shown while the action is engaged (preset playing, schedule on, mute on) or briefly during a tap-flash
- **Background — Inactive** — shown while the action is at rest

Colors accept names (`Blue`, `Red`, `Green`, …) or hex codes (`#FF0000`). On devices with simple LEDs (like the KD-WP8), the active/inactive colors map to the nearest LED state.

## Testing Your Layout

You don't need the physical device in hand to build a layout — click **Operate** at any time to drive the surface from the browser. See [Surface Operator](/dmx-core-100/control-surfaces/surface-operator).
