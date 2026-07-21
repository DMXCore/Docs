---
title: OSC – Open Sound Control
description: Trigger playback and build two-way control panels over OSC
---

The DMX Core 100 speaks OSC (Open Sound Control), so applications like [TouchOSC](https://hexler.net/touchosc), lighting consoles, and media servers can trigger playback and control levels over the network — with live status fed back to the controller.

## Server Settings

The OSC server listens on UDP port **8000** by default. The port is configurable under **Device > System > OSC Port** in the Web UI (requires a restart).

All incoming addresses are prefixed with `/dmxcore`. For example, to stop any playback:

```
/dmxcore/stop
```

Or to start the built-in rainbow test pattern on the output with code `OUT1` (omit the output code to use the first output):

```
/dmxcore/pattern/OUT1/rainbow
```

For everything else — cues, presets, scripts, levels — define an [input trigger](/dmx-core-100/scheduling-automation/input-triggers) with the OSC address of your choice; that way your address space is yours to design.

## OSC Clients and Feedback

Register the controllers you want two-way communication with under **Control & Integrations > OSC Clients** — each client has a name, a source IP (or *any*), and a **feedback port** (default 9000). Status messages — what's playing, current levels, active states — are sent back to each client's feedback port, so your TouchOSC layout's buttons and faders track reality.

![OSC Clients list with source IP and feedback port](/assets/web/osc-clients-list.png)

## Three Ways to Use OSC

- **Input triggers** — fire any action (play a cue, apply a preset, run a script, step a Control Value) when a specific OSC address arrives, or feed a fader's value straight into a level with a Value-mode trigger. See [Input Triggers](/dmx-core-100/scheduling-automation/input-triggers).
- **OSC control surfaces** — bind a whole OSC layout to a [control surface](/dmx-core-100/control-surfaces) for structured, bank-switchable panels with full two-way feedback, including Absolute/Relative slider modes and press-and-hold auto-repeat.
- **OSC output** — send OSC messages *from* the DMX Core 100: as an [output event](/dmx-core-100/scheduling-automation/output-events) when something happens, as an **OSC direct message** item in a [custom menu](/dmx-core-100/scheduling-automation/custom-menus), or from a script via `dmx.osc.send()`.

#### Reference

[OSC Specification](https://opensoundcontrol.stanford.edu/spec-1_0.html)
