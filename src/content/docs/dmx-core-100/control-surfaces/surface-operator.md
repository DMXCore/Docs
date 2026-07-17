---
title: Surface Operator
description: Operate any control surface from the browser
---

The **Surface Operator** page (under **Operation** in the Web UI sidebar) renders any configured [control surface](/dmx-core-100/control-surfaces) as a live, interactive panel in the browser. Every pad, knob, and slider works exactly like the physical control it mirrors, with the same real-time feedback.

<!-- SCREENSHOT: Surface Operator view of a Stream Deck + showing button pads, knob sliders, and bank state (dark mode) -->

Pick a surface from the list and click **Operate**. The operator view shows each section of the surface — buttons as tappable pads with their configured colors and state, knobs and faders as sliders with live values — grouped and labeled just like the [surface configuration](/dmx-core-100/control-surfaces/configuring).

## Uses

- **Operate without hardware** — a surface doesn't have to be bound to a physical device at all. A *web-only* surface is a quick way to build a touch panel for an operator who works from a laptop or tablet.
- **Mirror a physical device** — the operator view of a connected device stays in sync with it: press a key on the Stream Deck and the browser pad lights up, and vice versa.
- **Test while building** — edit the layout in the configuration editor, then click **Operate** to try it immediately, before the hardware is on site.

:::tip
For simple end-user panels with per-item fades, confirmation prompts, and guest access, also consider [Custom Menus](/dmx-core-100/scheduling-automation/custom-menus) — they serve casual users, while control surfaces are built for hands-on operators.
:::
