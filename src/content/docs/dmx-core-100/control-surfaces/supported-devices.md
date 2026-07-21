---
title: Supported Devices
description: Stream Deck, MIDI controllers, Key Digital keypads, and OSC surfaces
---

This page covers the device-specific details for each [control surface](/dmx-core-100/control-surfaces) type. To add a device, go to **Control & Integrations > Control Surfaces**, click **Add New**, and pick the surface type — the type cannot be changed later.

![New Control Surface — choosing a surface type and transport](/assets/web/control-surface-new.png)

## Stream Deck

Elgato Stream Deck devices are detected automatically, connected either directly over **USB** or over the network via the **Stream Deck Network Dock**. Supported models include the **Stream Deck MK.2**, **XL**, **Mini**, and **Stream Deck +**.

- **LCD keys** — Every key shows its assignment's label, icon, and active/inactive background color
- **Knobs (Stream Deck +)** — The four knobs bind to levels such as [Control Values](/dmx-core-100/integrations/control-values), master dimmer, or zone intensities; knob presses are separately assignable
- **LCD strip (Stream Deck +)** — Shows the current bank label; swipe the strip to switch banks
- **Brightness and sleep** — Display brightness and auto-sleep timeout are configurable

## MIDI Keypad

Generic MIDI controllers — pads, keys, and knobs on devices like the Akai LPD8 — can be used as control surfaces. Three transports are supported:

- **USB MIDI** — plugged directly into the DMX Core 100 (or the computer running the desktop software)
- **RTP-MIDI** (Apple Network MIDI) — MIDI over the network
- **Network MIDI 2** — the newer network MIDI standard

Pads trigger button assignments; knobs and faders drive level assignments. Controllers with LED pads receive color feedback where the device supports it.

## Key Digital KD-WP8

The Key Digital KD-WP8 is an 8-button wall keypad that connects over the network (TCP).

- **8 programmable buttons**, each with a normal/toggle/flash press mode
- **Three-state LEDs** — off, blue, and red, mapped from each assignment's active/inactive colors
- **No banks** — the KD-WP8 always shows its 8 physical buttons

## OSC

An OSC surface turns any OSC-capable controller — TouchOSC on a tablet, a lighting console, custom software — into a control surface with two-way feedback.

OSC surfaces don't connect to a physical device directly; instead they bind to a named **OSC client** configured under **Control & Integrations > OSC Clients** (source IP and feedback port). Incoming OSC messages from that client operate the surface, and state changes are sent back to the client's feedback port so the controller's own buttons and faders stay in sync.

Sliders support **Absolute** and **Relative** input modes, and Up/Down button assignments auto-repeat while held — useful for volume ramps from momentary buttons.

See [OSC – Open Sound Control](/dmx-core-100/integrations/osc-open-sound-control) for the OSC integration in general.
