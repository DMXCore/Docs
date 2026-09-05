---
title: WiZ Plugin
description: Drive WiZ (Signify) WiFi lights, including the WiZ-based Philips Smart LED range, over the local UDP protocol with the WiZ plugin for the DMX Core 100
---

The WiZ plugin drives **WiZ (Signify) WiFi lights** — full-color, tunable-white
and dimmable bulbs, strips, and lamps, including the WiZ-based Philips
"Smart LED" range — over the WiZ local UDP protocol. No cloud account or hub
is needed; the light only has to have been joined to the WiFi with the WiZ
app once.

The plugin is installed from the plugin registry — see
[Plugins](/dmx-core-100/integrations/plugins) for how to install, update,
and manage plugins.

## What It Adds

- A **WiZ** output type with color protocols (RGB, RGBW+CT, RGB + cool/warm
  white) and white protocols (Dimmer+CT in kelvin mode, Dimmer).
- A **Discover** button on the output that finds the lights and shows what
  each module can do.
- **WiZ — Color Bulb** and **WiZ — White Bulb** fixture profiles.

Updates are rate-limited to 10 per second per light. See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly-lifx-wiz-govee)
for setup.

## Firmware Behavior

WiZ firmware smooths every color change over a fraction of a second and
fades power on/off over about a second — fades and effects look smooth, but
hard snaps and blackouts land slightly late. That is the bulb, not the
plugin or the Core; the WiZ app behaves the same way.

## Source

The plugin's source is public at
[DMXCore/DMXCore100.Plugin.WiZ](https://github.com/DMXCore/DMXCore100.Plugin.WiZ)
under the MIT license. The package is
[DMXCore.Plugin.WiZ](https://www.nuget.org/packages/DMXCore.Plugin.WiZ)
on nuget.org.
