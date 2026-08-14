---
title: Plugins
description: Manage the plugins that extend the DMX Core 100 with external integrations
---

Plugins extend the DMX Core 100 with integrations that run on the device
itself. Four plugins ship out of the box with every install — **Symetrix
DSP**, **QSys DSP**, **[Home Assistant](/dmx-core-100/integrations/home-assistant)**,
and **Shelly** — and additional plugins can be added per device.

:::tip[Web UI]
Plugins are managed under **Control & Integrations > Plugins**.
:::

![Plugins page with the Symetrix DSP settings open](/assets/web/plugins-settings.png)

## The Plugins Page

Each installed plugin is listed with its version, state, and — for plugins
that maintain a connection to external equipment — a live connection
indicator: a green link icon when the plugin is connected to its device (for
example a DSP core), a red broken-link icon when it isn't.

- **Enabled** — turn a plugin off without uninstalling it. Takes effect
  immediately: disabling stops a running plugin, enabling starts it.
- **Settings** — each plugin declares its own settings (server addresses,
  ports, options), edited right on the page. Settings changes apply
  **immediately**, no restart needed — for the DSP plugins, saving a new
  address reconnects on the spot.
- **Reload** — restart just that plugin, without restarting the device.
  Useful if an integration is stuck or after changing something on the
  external system's side.
- **Upload** — install or update a plugin from a `.dmxplugin` package.
  The uploaded version starts running immediately.
- **Delete** — remove an uploaded plugin, effective immediately. The
  bundled plugins are part of the product install and can be disabled but
  not deleted.

## The DSP Plugins

The two bundled DSP plugins implement the [Q-SYS & Symetrix](/dmx-core-100/external-control)
integrations. Their settings are simply the DSP core's address (and port, if
changed from the platform default). Once connected, define
[Control Values](/dmx-core-100/integrations/control-values) to bridge the
DSP's controls into faders, menus, and triggers.

## The Shelly Plugin

The bundled Shelly plugin drives **Shelly Gen1 color devices** (RGBW2 and
similar) from DMX data over MQTT. It adds a **SHELLY** output type on the
[Outputs page](/dmx-core-100/configuration/output-config) with RGB, RGBW, and
RGBW+intensity protocols, a **Discover** button that finds Shelly devices on
the network, and a **Shelly** fixture profile so the device can be patched
and controlled like any fixture. See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly)
for setup.

The plugin's source is public at
[DMXCore/DMXCore100.ShellyPlugin](https://github.com/DMXCore/DMXCore100.ShellyPlugin) —
it doubles as the reference example for building output plugins.

## Developing Plugins

Plugins are .NET class libraries built against the
[DMXCore.PluginSdk](https://www.nuget.org/packages/DMXCore.PluginSdk) NuGet
package and packaged as a `.dmxplugin` archive. Two public repositories show
the way:

- [DMXCore100.ExamplePlugin](https://github.com/DMXCore/DMXCore100.ExamplePlugin) —
  minimal starting point covering the plugin lifecycle, settings, and triggers
- [DMXCore100.ShellyPlugin](https://github.com/DMXCore/DMXCore100.ShellyPlugin) —
  a complete real-world plugin: output protocols, device discovery, and
  plugin-provided fixture profiles

## Updates

Bundled plugins update together with the device firmware. Uploaded plugins
are updated by uploading a newer `.dmxplugin` — the new version takes over
immediately, and the plugin's settings are kept.
