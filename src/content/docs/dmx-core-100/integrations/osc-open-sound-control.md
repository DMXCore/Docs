---
title: OSC – Open Sound Control
description: Trigger playback and build two-way control panels over OSC
---

The DMX Core 100 speaks OSC (Open Sound Control), so applications like [TouchOSC](https://hexler.net/touchosc), QLab, lighting consoles, and media servers can trigger playback and control levels over the network — with live status fed back to the controller.

## Server Settings

The OSC server listens on UDP port **8000** by default. The port is configurable under **Device > System > OSC Port** in the Web UI (requires a restart). No other setup is needed — the built-in addresses below work as soon as the device is on the network.

## Three Ways to Use Incoming OSC

- **Built-in addresses** — a fixed set of `/dmxcore/...` addresses that play cues, apply presets, start effects, and set levels by *code*. Nothing to configure: send `/dmxcore/cue/ACT1` and the cue with code `ACT1` plays. See the [reference](#built-in-address-reference) below. This is the right fit for a show controller or playback software that just needs to fire saved cues.
- **Input triggers** — for your own address space, or for actions the built-in set doesn't cover (timelines, sounds, scripts, output events, stepping a Control Value, toggling output), define an [input trigger](/dmx-core-100/scheduling-automation/input-triggers) of type OSC with the address of your choice. A Value-mode trigger feeds a fader's value straight into a level.
- **OSC control surfaces** — bind a whole OSC layout (TouchOSC, a console's OSC page) to a [control surface](/dmx-core-100/control-surfaces) for structured, bank-switchable panels with full two-way feedback, including Absolute/Relative slider modes and press-and-hold auto-repeat. The surface binds to a named [OSC client](#osc-clients-and-feedback), so it is the right fit for a dedicated operator panel rather than one-off cue triggers.

Built-in addresses and input triggers work at the same time: a message that matches an input trigger *and* a built-in address does both. A control surface, on the other hand, *owns* its sender: once an OSC client with a specific source IP is bound to an enabled surface, every message from that IP goes to the surface and neither the built-in addresses nor input triggers see it. A surface bound to an *any*-source client only claims the addresses it has assignments for and lets everything else through.

## Playing a Cue

The most common use is firing saved cues from a show controller. The address is the cue's **Code / Short Name** as entered on the cue's details page:

```
/dmxcore/cue/ACT1
```

Send it with no arguments to play the cue normally. Codes must match exactly as entered, including upper/lower case. To stop playback:

```
/dmxcore/cuecontrol/stop
```

:::tip[Which address did the device hear?]
**Control & Integrations > Input Triggers** shows the most recently received OSC messages, with their address and payload — the quickest way to confirm your controller's messages are arriving and spelled the way you expect.
:::

## Built-in Address Reference

Keywords in the address (`cue`, `dimmer`, `master`, …) are matched case-insensitively. A `<code>` is the entity's code from the Web UI and must match exactly.

Arguments are optional unless noted. A single float, integer, or numeric string is accepted; levels are `0.0`–`1.0`.

### Playback

| Address | Argument | Action |
|---------|----------|--------|
| `/dmxcore/cue/<code>` | *(optional)* loop count | Play the cue. Omit the argument to use the default loop count from the Cues page; send an integer to loop that many times. |
| `/dmxcore/cuecontrol/stop` | — | Stop cue playback. |
| `/dmxcore/preset/<code>` | *(optional)* fade time in ms | Fade to the preset. Omit the argument to use the default fade duration. |
| `/dmxcore/effect/<code>` | *(optional)* `1` | Start the stored [effect](/dmx-core-100/lighting/effects) as the global effect, with its saved parameters and colors. Fires with no argument or with `1`. |
| `/dmxcore/effect/none` | — | Clear the global effect. |

### Levels

| Address | Argument | Action |
|---------|----------|--------|
| `/dmxcore/dimmer/master` | level | Set the master dimmer. |
| `/dmxcore/dimmer/master/fadeto` | level, fade time in ms | Fade the master dimmer to a level over the given time (two arguments). |
| `/dmxcore/dimmer/zone/<code>` | level | Set a zone's intensity. |
| `/dmxcore/control/<code>` | level | Set a Level-kind [Control Value](/dmx-core-100/integrations/control-values) — an external DSP level — with no trigger or control surface configured. |
| `/dmxcore/fixture/red` `/dmxcore/fixture/green` `/dmxcore/fixture/blue` | level | Set the global fixture-control color channels. |
| `/dmxcore/fixture/<code>/dimmer` `/dmxcore/fixture/<code>/red` `/dmxcore/fixture/<code>/green` `/dmxcore/fixture/<code>/blue` `/dmxcore/fixture/<code>/white` | level | Adjust a single fixture's live modifier. |
| `/dmxcore/config/fadeduration` | ms | Set the default fade duration used when a preset is applied without an explicit time. |

### Device

| Address | Argument | Action |
|---------|----------|--------|
| `/dmxcore/status` | — | Re-send the full status feedback set to connected clients. |
| `/dmxcore/blink` | `1` / `0` | Turn the identify blink on or off. |
| `/ping` | — | Keep-alive. Registers the sender for feedback without doing anything else; not logged. |

## OSC Clients and Feedback

Register the controllers you want two-way communication with under **Control & Integrations > OSC Clients** — each client has a name, a source IP (or *any*), and a **feedback port** (default 9000). Status messages — what's playing, current levels, active states — are sent back to each client's feedback port, so your TouchOSC layout's buttons and faders track reality.

![OSC Clients list with source IP and feedback port](/assets/web/osc-clients-list.png)

### Feedback Address Reference

| Address | Value | Sent when |
|---------|-------|-----------|
| `/dmxcore/status/text` | string | Playback state changes — e.g. `Playing 'ACT1'`, `Stopped`, `Recording`, `Previewing`. |
| `/dmxcore/status/cue` | string | Playback state changes — the code of the playing cue, or empty when none. |
| `/dmxcore/dimmer/master` | level | The master dimmer changes. |
| `/dmxcore/fixture/red` `/dmxcore/fixture/green` `/dmxcore/fixture/blue` | level | The global fixture-control color changes. |
| `/dmxcore/control/<code>` | level | A Level-kind Control Value changes (the code is sent in lower case). |

A client that sets a level over OSC is treated as the *master* for that address for one second and does not receive its own value echoed back, so a fader being dragged doesn't fight the feedback.

[Control surfaces](/dmx-core-100/control-surfaces) bound to an OSC client additionally send state for each assigned address, using the binding's own address path.

## Sending OSC from the Device

The DMX Core 100 can also *send* OSC: as an [output event](/dmx-core-100/scheduling-automation/output-events) when something happens, as an **OSC direct message** item in a [custom menu](/dmx-core-100/scheduling-automation/custom-menus), or from a script via `dmx.osc.send()`.

#### Reference

[OSC Specification](https://opensoundcontrol.stanford.edu/spec-1_0.html)
