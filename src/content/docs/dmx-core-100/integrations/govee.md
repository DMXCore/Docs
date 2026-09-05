---
title: Govee Plugin
description: Drive Govee WiFi LED strips, neon ropes, panels, and lamps over the local LAN API with the Govee plugin for the DMX Core 100
---

The Govee plugin drives **Govee WiFi lights** — LED strips, neon ropes,
panels, and lamps that support Govee's local LAN API (the H618x/H619x strip
series and similar; the ordinary Govee A19 bulbs do not) — with no cloud
account needed at show time.

Each light must have **LAN Control** switched on once in its Govee Home app
settings, and only then answers on the network.

The plugin is installed from the plugin registry — see
[Plugins](/dmx-core-100/integrations/plugins) for how to install, update,
and manage plugins.

## What It Adds

- A **GOVEE** output type with an RGB color protocol and white protocols
  (Dimmer+CT in kelvin mode, Dimmer).
- A **Discover** button on the output that finds the lights and shows their
  model.
- **Govee — Color Light** and **Govee — White Light** fixture profiles.

Updates are rate-limited to 10 per second per light. See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly-lifx-wiz-govee)
for setup.

## Firmware Behavior

Govee firmware smooths every change — color, brightness, and power — over a
fixed fade the protocol cannot shorten: fades and gentle effects look great,
but strobes, fast chases, and hard blackouts smear together. The LAN API
also drives the whole device as a single zone, so per-segment (RGBIC)
control is not available. Both are the device, not the plugin or the Core.

## Realtime Protocols

For cue and effect playback use the **Realtime** protocols (on by
default): Realtime RGB (whole device, no firmware fade — strobes and
snaps work) and Realtime Pixel (per-segment RGBIC control), streamed over
the reverse-engineered mode Govee's own desktop app uses for music sync.
Not part of the documented LAN API — verified on the **H618A**, and the
format is shared across Govee's WiFi RGBIC line; if a model ignores it,
switch the **Realtime protocols** plugin setting off and use the standard
protocols.

## Source

The plugin's source is public at
[DMXCore/DMXCore100.Plugin.Govee](https://github.com/DMXCore/DMXCore100.Plugin.Govee)
under the MIT license. The package is
[DMXCore.Plugin.Govee](https://www.nuget.org/packages/DMXCore.Plugin.Govee)
on nuget.org.
