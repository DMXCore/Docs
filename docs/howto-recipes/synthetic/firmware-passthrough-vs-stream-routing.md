---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: none
date: 2026-09-15
title: Why Blackout does not darken the passthrough port
slug: firmware-passthrough-vs-stream-routing
anonymized: true
docs_slugs:
  - dmx-core-100/lighting/passthrough
  - dmx-core-100/lighting/stream-routing
  - dmx-core-100/basics/blackout-and-stop
verified: docs be6f663, core v2026.914.3
---

# Why Blackout does not darken the passthrough port

## Original ask

> We've got the 2 port DMX board. Church console goes into port A, the lights are on port B, passthru is on "From A to B". When the console is plugged in, hitting Blackout on the DMX Core does nothing to the lights, and the presets I fire on the DMX Core don't mix with the console either. Is the passthru broken, or am I using the wrong feature?

## Goal

The user understands that firmware passthrough is port-to-port in the board and outside the DMX Core's merge and stop states, and that Stream Routing is the feature that merges and obeys Blackout.

## Expected answer

- Nothing is broken. **Passthru Function** is done in the 2-port board's firmware: DMX in on one port goes straight out the other (rate limited to 50 Hz). It does **not** merge with the DMX Core's own cues, presets or fixture control.
- **Stop, Blackout and Output Off do not affect** the firmware passthrough. While the console is connected, Blackout darkens every other output but port B keeps showing the console.
- When the console is unplugged, after about a 3-second timeout, port B sends the DMX Core's own data (presets, fixture control, cues). Their presets only show once the console is gone.
- To merge the console with DMX Core playback and have Blackout apply, use **Stream Routing** instead. On **Lighting Setup › Inputs**, add a **DMX Serial** row where universe 1 = port A, map it to the slot the port B output uses, turn on **Route input to outputs**, and turn **Passthru Function** off. Routed input then merges by priority and Blackout masks it.
- The passthrough's destination port is left out of stream routing while passthrough is on, so both features cannot drive port B at the same time. Passthrough must be off for routing to reach port B.
- The setting lives under **Lighting Setup › Protocol** in the Web UI (only shown when the board is present), with options **From A to B**, **From B to A** or off.
- Must not claim Blackout, Stop or Output Off can darken the firmware passthrough, or that there is a merge or priority setting for the passthrough.
- Must not tell them to use MCP, the Integration API or a script as a workaround.

## Gotchas

- Passthrough is still useful for "console live, DMX Core records the stream" setups. Recording works while passthrough is on.
- After switching to routing, the console's priority competes with DMX Core playback. DMX Serial has no wire priority, so it merges at **Input Priority** on **Lighting Setup › Protocol**.
- A DMX Serial output on the same port as a DMX Serial input would loop; routing skips it.

## Eval checks

- Says passthrough is done in the board firmware, port to port, and does not merge
- Says Stop / Blackout / Output Off do not apply to the firmware passthrough
- Recommends Stream Routing (`Lighting Setup > Inputs`, **Route input to outputs**) to merge and obey Blackout
- Mentions a **DMX Serial** row with port A = universe 1
- Mentions turning **Passthru Function** off, or that its destination port is excluded from routing
- Mentions the 3-second hand-back when the input is disconnected
- Does not invent a merge or priority option for passthrough
- Does not tell them to use MCP or the Integration API

## Gaps

- passthrough.md says the touchscreen item is under **Settings › Output**. At v2026.914.3 it is **Main Menu > Settings > System Settings**, under the **Protocol** header, labelled **Passthru function** (lower-case f) (`src/UnoHost/Services/MenuManager.cs`; navigation `uno/settings/system settings`).
- passthrough.md says "The two options are…" but the released option list has three: **None**, **From A to B**, **From B to A** (`src/BusinessObject/OutputConfig.cs` `SerialPassthruFunctions`). The docs do not name the option labels.
- Neither passthrough.md nor stream-routing.md gives the step-by-step for moving from passthrough to routing on the same port pair (turn passthrough off, DMX Serial row, output on port B at the same slot).
- No screenshot in the catalog shows the Passthru Function setting (it only appears when the board is present).

## Verification

- Firmware, port to port, 50 Hz, 3-second timeout, no merge, stop states do not apply: passthrough.md (single section). blackout-and-stop.md "Routed input and the hardware passthrough". Navigation `web/settings/protocol` Passthru Function help ("Port to port only, no merge with playback").
- Web location and visibility: passthrough.md. Navigation `web/settings/protocol` (visibleWhen "DMX board with firmware passthrough present"). `WebsiteController.Settings.cs` "Passthru Function".
- Options: `OutputConfig.SerialPassthruFunctions` (None, "From A to B", "From B to A").
- DMX Serial row, port 1 = A, destination port excluded from routing: stream-routing.md "Setting it up" and "Loops and conflicts". Navigation `web/inputs/details` Start Universe Id help (1 = port A, 2 = port B).
- Route input to outputs, Blackout masks routed input: stream-routing.md "Stop, Blackout and Output Off". `Inputs.vue` routing tooltip.
- Input Priority for DMX Serial: stream-routing.md "Settings". Navigation `web/settings/protocol` Input Priority help.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
