---
title: Plugins
description: Manage the plugins that extend the DMX Core 100 with external integrations
---

Plugins extend the DMX Core 100 with integrations that run on the device
itself. The DSP integrations ship as plugins out of the box — **Symetrix
DSP** and **QSys DSP** are included with every install — and additional
plugins can be added per device.

:::tip[Web UI]
Plugins are managed under **Control & Integrations > Plugins**.
:::

![Plugins page with the Symetrix DSP settings open](/assets/web/plugins-settings.png)

## The Plugins Page

Each installed plugin is listed with its version, state, and — for plugins
that maintain a connection to external equipment — a live connection
indicator: a green link icon when the plugin is connected to its device (for
example a DSP core), a red broken-link icon when it isn't.

- **Enabled** — turn a plugin off without uninstalling it. Enabling or
  disabling takes effect at the next restart.
- **Settings** — each plugin declares its own settings (server addresses,
  ports, options), edited right on the page. Settings changes apply
  **immediately**, no restart needed — for the DSP plugins, saving a new
  address reconnects on the spot.
- **Upload** — install or update a plugin from a `.dmxplugin` package.
  Uploaded plugins are staged and applied at the next restart.
- **Delete** — remove an uploaded plugin. The bundled plugins are part of
  the product install and can be disabled but not deleted.

## The DSP Plugins

The two bundled plugins implement the [Q-SYS & Symetrix](/dmx-core-100/external-control)
integrations. Their settings are simply the DSP core's address (and port, if
changed from the platform default). Once connected, define
[Control Values](/dmx-core-100/integrations/control-values) to bridge the
DSP's controls into faders, menus, and triggers.

## Updates

Bundled plugins update together with the device firmware. Uploaded plugins
are updated by uploading a newer `.dmxplugin` — the version is applied at
the next restart, and the plugin's settings are kept.
