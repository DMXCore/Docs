---
title: Symetrix DSP Plugin
description: Two-way integration between the DMX Core 100 and Symetrix DSP cores — DSP controls on the touchscreen, and DSP-driven lighting — with the Symetrix DSP plugin
---

The Symetrix DSP plugin connects the DMX Core 100 to a **Symetrix** core
(Solus NX, Prism, Radius, and similar). It implements the
[Q-SYS & Symetrix](/dmx-core-100/external-control) integration: controller
numbers on the core become
[Control Values](/dmx-core-100/integrations/control-values) that can be
bound to touchscreen faders and buttons, control surfaces, input triggers,
timelines, and scripts — with two-way state sync against the DSP.

The plugin is installed from the plugin registry — see
[Plugins](/dmx-core-100/integrations/plugins) for how to install, update,
and manage plugins.

## Settings

- **Server address** — the address of the Symetrix core.
- **Port** — only needs changing if it differs from the Symetrix default
  (48631).

Settings apply immediately; saving a new address reconnects on the spot. The
link icon next to the plugin's state on the Plugins page, and in the
touchscreen status bar, shows whether the core is connected.

## Next Steps

Follow [Q-SYS & Symetrix](/dmx-core-100/external-control) for the
integration walkthrough, and define
[Control Values](/dmx-core-100/integrations/control-values) to bridge the
core's controller numbers into the system.

## Package

The plugin is published by DMX Core as
[DMXCore.Plugin.Symetrix](https://www.nuget.org/packages/DMXCore.Plugin.Symetrix)
on nuget.org. Its source is not public.
