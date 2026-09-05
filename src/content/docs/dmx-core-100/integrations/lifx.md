---
title: LIFX Plugin
description: Drive LIFX WiFi bulbs and SuperColour / pixel fixtures over the LIFX LAN protocol with the LIFX plugin for the DMX Core 100
---

The LIFX plugin drives **LIFX WiFi bulbs and SuperColour / pixel fixtures**
(Tube, Beam, strips, tiles) over the LIFX LAN protocol — no cloud account
needed, the lights only have to be on the same network.

The plugin is installed from the plugin registry — see
[Plugins](/dmx-core-100/integrations/plugins) for how to install, update,
and manage plugins.

## What It Adds

- A **LIFX** output type with single-zone color protocols (RGB, RGB+CT,
  RGBW, RGBW+CT, each in 8- or 16-bit) and a **Pixel** protocol that drives
  every zone of a multizone device individually, in the same eight layouts
  via the mapping's **Color mode** field.
- A **Discover** button on the output that finds the lights (and their zone
  counts).
- A **LIFX — Color Bulb** fixture profile whose personalities match the
  protocols.

Updates stream at up to 20 per second per light with a short device-side
fade so effects look smooth. See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly-lifx-wiz-govee)
for setup.

## Source

The plugin's source is public at
[DMXCore/DMXCore100.Plugin.LIFX](https://github.com/DMXCore/DMXCore100.Plugin.LIFX)
under the MIT license. The package is
[DMXCore.Plugin.LIFX](https://www.nuget.org/packages/DMXCore.Plugin.LIFX)
on nuget.org.
