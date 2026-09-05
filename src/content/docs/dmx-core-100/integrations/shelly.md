---
title: Shelly Plugin
description: Drive Shelly Gen1 color devices (RGBW2 and similar) from DMX over MQTT with the Shelly plugin for the DMX Core 100
---

The Shelly plugin drives **Shelly Gen1 color devices** (RGBW2 and similar)
from DMX data over MQTT. Once installed, Shelly devices are patched and
controlled like any other fixture.

The plugin is installed from the plugin registry — see
[Plugins](/dmx-core-100/integrations/plugins) for how to install, update,
and manage plugins.

:::note[Requires MQTT]
The plugin talks to the Shelly devices through the device's
[MQTT connection](/dmx-core-100/integrations/mqtt). Configure an MQTT
broker first and point the Shelly devices at the same broker.
:::

## What It Adds

- A **SHELLY** output type on the
  [Outputs page](/dmx-core-100/configuration/output-config) with RGB, RGBW,
  and RGBW+intensity protocols.
- A **Discover** button on the output that finds Shelly devices on the
  network.
- A **Shelly** fixture profile so the device can be patched and controlled
  like any fixture.

See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly-lifx-wiz-govee)
for setup.

## Source

The plugin's source is public at
[DMXCore/DMXCore100.Plugin.Shelly](https://github.com/DMXCore/DMXCore100.Plugin.Shelly)
under the MIT license — it doubles as the reference example for building
output plugins. The package is
[DMXCore.Plugin.Shelly](https://www.nuget.org/packages/DMXCore.Plugin.Shelly)
on nuget.org.
