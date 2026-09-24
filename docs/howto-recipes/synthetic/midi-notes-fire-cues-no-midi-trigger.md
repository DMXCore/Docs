---
status: candidate
source: synthetic
invented: true
level: advanced
surface: none
date: 2026-09-15
title: Fire cues from MIDI notes (there is no MIDI input trigger)
slug: midi-notes-fire-cues-no-midi-trigger
anonymized: true
docs_slugs:
  - dmx-core-100/scheduling-automation/input-triggers
  - dmx-core-100/control-surfaces
  - dmx-core-100/control-surfaces/supported-devices
  - dmx-core-100/control-surfaces/configuring
  - dmx-core-100/integrations/osc-open-sound-control
verified: docs be6f663, core v2026.914.3
---

# Fire cues from MIDI notes (there is no MIDI input trigger)

## Original ask

> Running playback from a DAW on a Mac. I'd like MIDI notes on channel 10 (note 36, 37, 38…) to fire cues on the DMX Core over the network. I went through Input Triggers and I only see Art-Net/sACN/OSC/MQTT/HTTP/TCP/UDP. Where's MIDI? Do I need a script or a plugin to parse it?

## Goal

The user understands that MIDI is not an Input Trigger type. MIDI comes in through a **Control Surface** of type **MIDI Keypad**. Each note is a surface assignment with a MIDI binding and a Play Cue action, so no script or plugin is needed.

## Expected answer

- Confirms that Input Triggers has **no MIDI type**. The released types are Art-Net, sACN, DMX Serial, OSC, MQTT, HTTP, TCP, UDP, Digital Input, Control Value and Plugin.
- Says MIDI is handled by **Control Surfaces**. In the Web UI go to **Control & Integrations > Control Surfaces**, click **Add New** and pick **MIDI Keypad**. The type cannot be changed later.
- Names the network transports for a DAW on a Mac: **RTP-MIDI (Apple Network MIDI)**, or **Network MIDI 2**. **USB MIDI** is for a controller plugged straight into the unit, or into the computer running the desktop software.
- Explains the mapping. In the surface editor, click a control in a section to edit its assignment. Its MIDI binding sets the message type (Note, Control Change or Program Change), the channel (10) and the number (36). **Learn** can capture it from an incoming message. Set the **Action** to **Play Cue** with the cue as target.
- Mentions that **banks** multiply the addressable controls, and that **Operate** (Surface Operator) tests the layout from the browser without the DAW.
- May offer OSC as an alternative if the DAW or a bridge can send OSC. The built-in `/dmxcore/cue/<code>` plays a cue with no trigger or surface.
- Must not invent a MIDI Input Trigger type, a "MIDI Settings" page, or MIDI Show Control / MIDI timecode support for this purpose.
- Must not say a script or plugin is required to parse MIDI. Must not tell the user to use MCP or the Integration API.

## Gotchas

- Channels in the binding are entered as 1–16, the DAW convention. Note numbers are 0–127.
- An assignment without a MIDI binding is web-only. It only fires from the operator page.
- Hold to confirm is not available on MIDI Program Change assignments, because they have no release edge.
- For Flash (hold) presets, pads send press and release. A DAW note-off acts as the release.

## Eval checks

- States there is no MIDI type in `Control & Integrations > Input Triggers`
- Points to `Control & Integrations > Control Surfaces` → **Add New** → **MIDI Keypad**
- Mentions **RTP-MIDI (Apple Network MIDI)** or **Network MIDI 2** for a network connection from a Mac
- Mentions binding by note/channel (or Learn) and an assignment **Action** of **Play Cue**
- Does not claim a script, plugin or external bridge is required
- Does not invent a MIDI input trigger, MIDI Show Control or a "MIDI" settings page
- Does not tell them to use MCP or the Integration API

## Gaps

- supported-devices.md "MIDI Keypad" and configuring.md "Assignments" do not describe the MIDI binding row. The released editor has **MIDI Binding** with a message type dropdown (**Note**, **Control Change**, **Program Change**), **Ch:** (1–16), **Note:**/**CC:**/**Prog:** number (0–127), **Learn**, **Add MIDI Binding**, and "Web-only - no MIDI binding" when cleared. Source: `src/AdminSite/ClientApp/src/views/operation/ControlSurfaceDetails.vue` (v2026.914.3, Assignment editor); navigation `web/controlsurfaces/details` (Assignment editor fields **MIDI Binding**, **Ch**; action **Add MIDI Binding**).
- input-triggers.md does not say that MIDI is handled by Control Surfaces rather than triggers, which is the first thing a MIDI user looks for. The "Input Types" table also omits **Plugin** (navigation `web/inputtriggers/details` Type options).
- configuring.md "Assignments" omits **Audio Mute**, **Blackout**, **DMX Output** and **Stop** as listed in the dropdown (it uses Toggle Mute, Toggle Output, Stop Playback). Navigation `web/controlsurfaces/details` Action Type options.

## Verification

- No MIDI trigger type: input-triggers.md "Input Types" table (no MIDI). Navigation `web/inputtriggers/details` **Type** options (Art-Net, Control Value, DMX Serial, HTTP, MQTT, OSC, Plugin, sACN, TCP, UDP, Digital Input). `InputTriggerDetails.vue` at v2026.914.3.
- Control Surfaces path and Add New / type fixed: supported-devices.md intro. `_nav.js` Control & Integrations → Control Surfaces. Navigation `web/controlsurfaces` action **Add New**, `web/controlsurfaces/new` (`ControlSurfaceWizard.vue`, card title "MIDI Keypad").
- Transports: control-surfaces/index.md "Surface Types" and supported-devices.md "MIDI Keypad". `ControlSurfaceWizard.vue` transport names "USB MIDI", "RTP-MIDI (Apple Network MIDI)", "Network MIDI 2".
- Binding and Learn: `ControlSurfaceDetails.vue` MIDI binding row (Note/Control Change/Program Change, channel shown 1–16 stored 0–15, number 0–127, Learn).
- Play Cue assignment, banks, Operate: configuring.md "Assignments", "Banks", "Testing Your Layout". Navigation `web/controlsurfaces/details` Action Type **Play Cue**, actions **Operate**, **Add Bank**.
- Hold to confirm on Program Change: configuring.md "Hold to confirm" (disabled for MIDI Program Change).
- OSC alternative: osc-open-sound-control.md "Built-in Address Reference" (`/dmxcore/cue/<code>`).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
