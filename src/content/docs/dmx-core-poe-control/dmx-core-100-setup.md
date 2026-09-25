---
title: DMX Core 100 Setup
description: The Control Value a knob steps, and the input trigger a button fires
---

Five minutes in the Web UI. The knob uses the Core's built-in OSC addresses, so there are no input triggers to build unless you want the push switch or a button to do something.

## The OSC port

The OSC server listens on UDP **8000** by default, configurable under **Device > System > OSC Port** (needs a restart). The controller learns the port from mDNS, so a changed port needs nothing on the controller - only a Core reached by IP address needs `port =` set in `config.txt`.

Nothing has to be enabled. The OSC server is always on.

## The Control Value

**Control & Integrations > Control Values**, add one:

| Field | Value |
|---|---|
| Code / Short Name | `VOL` - or anything; this is what goes in `config.txt` |
| Kind | **Level** |
| Plugin | **Internal (no DSP)** - or a Symetrix or Q-SYS backend if the real value lives on a DSP |
| Step Size | **5%** to start |
| Drives | the target the knob should move |

**Drives** is the whole point of the design: pick the master dimmer, a zone intensity, a fixture's intensity or a colour channel, the audio volume, or another Control Value. Changing what the knob does later is a change to this one dropdown. The binding is bidirectional - if a cue moves the target, the Control Value follows, so the knob can never be out of phase.

On step size: the Rotary Encoder Kit's knob has 24 detents per revolution, so 5% means one revolution covers the full range in 20 clicks. Drop it to 2% if that feels too coarse - 50 clicks end to end, about two revolutions. Nothing on the controller sets the step; it only sends one step per click.

If the Control Value is backed by a DSP rather than Internal, leave **Drives** empty; the DSP holds the value and the knob steps it there.

That is the whole Core-side setup. Put the code into the `control` line of the knob's section in `config.txt` and it works.

## The push switch and buttons

Rotation uses built-in addresses, but the push switch and each button send an address of their own, so they need an **Input Trigger**. Under **Control & Integrations > Input Triggers**, add one with **Type: OSC**, **Mode: On/Off**, and the address from `config.txt` - the knob's `press` line or the button's `send` line, for example `/poecontrol/mute` - with Start and Stop Payload left empty.

It can run anything an On/Off trigger supports - Play Cue, Apply Preset, Blackout, Audio Mute, Toggle a Control Value, Run Script. A button set to `mode = momentary` sends `1` on press and `0` on release, so **Flash** and **Momentary** modes work too: a Flash preset stays up only while the button is held.

A button can also send one of the Core's built-in OSC addresses directly, such as `/dmxcore/cue/ACT1`, with no trigger at all. The [OSC integration page](/dmx-core-100/integrations/osc-open-sound-control/) lists them.

## Verify

**Control & Integrations > OSC Clients** has a **Recent OSC Senders** list at the bottom showing every IP that has sent OSC, with a message count and the last address received. It refreshes on its own. This is the fastest way to tell "the controller is not sending" from "the address is spelled wrong".

Before wiring anything, the same thing can be tested from a desktop machine with any OSC utility that can send to `<core-ip>:8000`:

```
/dmxcore/control/VOL/up     int 1
```

The Control Value should step by its Step Size, and the driven target should move with it.

## Several knobs

One knob steps one Control Value. Several knobs on one Core each need their own Control Value, each with its own **Drives** target. Two knobs in two rooms driving the same target can share one Control Value.

## Security

OSC is unauthenticated. Anything that can reach UDP 8000 can step the value. Keep the controller and the Core on a trusted network segment.
