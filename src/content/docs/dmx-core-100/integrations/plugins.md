---
title: Plugins
description: Install, update, and manage the plugins that extend the DMX Core 100 with external integrations
---

Plugins extend the DMX Core 100 with integrations that run on the device
itself — DSP control (**Symetrix**, **Q-SYS**), smart-home platforms
(**[Home Assistant](/dmx-core-100/integrations/home-assistant)**), networked
lighting (**Shelly**, **LIFX**, **WiZ**, **Govee**), show import
(**[Lightjams](/dmx-core-100/integrations/lightjams)**), and more. Plugins are installed per device
from the **plugin registry**, straight from the Plugins page, and updated
independently of the device software.

:::tip[Web UI]
Plugins are managed under **Control & Integrations > Plugins**.
:::

![Plugins page, Installed tab, with the Symetrix DSP settings open](/assets/web/plugins-settings.png)

## Installing a Plugin

Open the **Browse** tab. It lists every plugin available in the registry,
with a description, the publisher, and links to the plugin's website and
license. Plugins published by DMX Core carry a **DMX Core** mark. Use the
search box to filter the list.

![The Browse tab listing the plugins in the registry](/assets/web/plugins-browse.png)

Press **Install** next to a plugin — the device downloads the package,
verifies it, and starts it right away. When a plugin has several versions,
the version dropdown lets you pick one — including an older version of an
installed plugin, if a newer one misbehaves (the update check will offer the
newer version again). Newly installed plugins appear on the
**Installed** tab, where you enable/disable them and edit their settings.

Only versions that this device's software can run are offered. If a plugin
(or a newer version of it) needs a newer device software than you have, the
Browse tab says so instead of offering it — update the device software first.

:::caution[Plugins run with full access]
Plugins run inside the DMX Core process with full access to the device and
your network. Install plugins only from publishers you trust. The device
shows this notice once, the first time you install a plugin.
:::

The device needs internet access to reach the registry. Sites without it can
still install plugins by **uploading** a `.dmxplugin` package on the
Installed tab (see below).

## The Installed Tab

Each installed plugin is listed with its version, state, and — for plugins
that maintain a connection to external equipment — a live connection
indicator: a green link icon when the plugin is connected to its device (for
example a DSP core), a red broken-link icon when it isn't.

- **Enabled** — turn a plugin off without uninstalling it. Takes effect
  immediately: disabling stops a running plugin, enabling starts it.
- **Settings** — each plugin declares its own settings (server addresses,
  ports, options), edited right on the page. Settings changes apply
  **immediately**, no restart needed — for the DSP plugins, saving a new
  address reconnects on the spot. The same panel shows which registry
  package the plugin came from and its per-plugin auto-update choice.
- **Update** — shown (with an arrow badge next to the version) when the
  registry has a newer version this device can run. One click downloads and
  applies it; the plugin's settings are kept.
- **Reload** — restart just that plugin, without restarting the device.
  Useful if an integration is stuck or after changing something on the
  external system's side.
- **Delete** — remove the plugin, effective immediately, together with its
  settings.
- **Upload** — install or update a plugin from a `.dmxplugin` package file
  instead of the registry, for example on a device without internet access
  or for a plugin that is not published. The uploaded version starts running
  immediately.

## Updates

The device checks the registry for plugin updates about once an hour and
whenever you press **Check for updates** on the Browse tab. What happens
when an update is found is set by the **update policy** under **Browse >
Registry settings**:

- **Notify** (default) — the update is shown on the Plugins page (badge on
  the plugin, count on the Installed tab); you apply it with **Update**.
- **Auto** — the device downloads and applies updates as it finds them. The
  plugin restarts for a few seconds when the update is applied.
- **Off** — no update checks.

Individual plugins can override the device policy in their settings panel
(**Auto-update**: follow the device policy / always / never) — for example
to auto-update everything except a DSP integration you'd rather update
during a maintenance window.

Only versions this device's software can run are ever offered or applied.
Updating the device software may unlock newer plugin versions.

## Registry Settings

**Browse > Registry settings** holds the update policy above plus:

- **Pre-release versions** — also offer plugin versions marked as
  pre-release (for testing; off by default).
- **Feeds** — the plugin registry is a standard NuGet feed; the default is
  nuget.org, where all public DMX Core plugins are published. Additional
  feeds (one per line, as NuGet V3 service index URLs — Azure Artifacts,
  BaGet, and similar) let organizations distribute private plugins or run a
  local mirror; a feed that needs a login takes the credentials in the URL
  (`https://user:token@host/...`).

## The DSP Plugins

The Symetrix DSP and QSys DSP plugins implement the
[Q-SYS & Symetrix](/dmx-core-100/external-control) integrations. Their
settings are simply the DSP core's address (and port, if changed from the
platform default). Once connected, define
[Control Values](/dmx-core-100/integrations/control-values) to bridge the
DSP's controls into faders, menus, and triggers.

## The Shelly Plugin

The Shelly plugin drives **Shelly Gen1 color devices** (RGBW2 and similar)
from DMX data over MQTT. It adds a **SHELLY** output type on the
[Outputs page](/dmx-core-100/configuration/output-config) with RGB, RGBW, and
RGBW+intensity protocols, a **Discover** button that finds Shelly devices on
the network, and a **Shelly** fixture profile so the device can be patched
and controlled like any fixture. See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly-lifx-wiz-govee)
for setup.

The plugin's source is public at
[DMXCore/DMXCore100.Plugin.Shelly](https://github.com/DMXCore/DMXCore100.Plugin.Shelly) —
it doubles as the reference example for building output plugins.

## The LIFX Plugin

The LIFX plugin drives **LIFX WiFi bulbs and SuperColour / pixel fixtures**
(Tube, Beam, strips, tiles) over the LIFX LAN protocol — no cloud account
needed, the lights only have to be on the same network. It adds a **LIFX**
output type with single-zone color protocols (RGB, RGB+CT, RGBW, RGBW+CT,
each in 8- or 16-bit) and a **Pixel** protocol that drives every zone of a
multizone device individually, a **Discover** button that finds the lights
(and their zone counts), and a **LIFX — Color Bulb** fixture profile whose
personalities match the protocols. Updates stream at up to 20 per second per
light with a short device-side fade so effects look smooth. See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly-lifx-wiz-govee)
for setup.

The plugin's source is public at
[DMXCore/DMXCore100.Plugin.LIFX](https://github.com/DMXCore/DMXCore100.Plugin.LIFX).

## The WiZ Plugin

The WiZ plugin drives **WiZ (Signify) WiFi lights** — full-color, tunable-white
and dimmable bulbs, strips, and lamps, including the WiZ-based Philips
"Smart LED" range — over the WiZ local UDP protocol. No cloud account or hub
is needed; the light only has to have been joined to the WiFi with the WiZ
app once. It adds a **WiZ** output type with color protocols (RGB, RGBW+CT,
RGB + cool/warm white) and white protocols (Dimmer+CT in kelvin mode,
Dimmer), a **Discover** button that finds the lights and shows what each
module can do, and **WiZ — Color Bulb** / **WiZ — White Bulb** fixture
profiles. Updates are rate-limited to 10 per second per light. See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly-lifx-wiz-govee)
for setup.

WiZ firmware smooths every color change over a fraction of a second and
fades power on/off over about a second — fades and effects look smooth, but
hard snaps and blackouts land slightly late. That is the bulb, not the
plugin or the Core; the WiZ app behaves the same way.

The plugin's source is public at
[DMXCore/DMXCore100.Plugin.WiZ](https://github.com/DMXCore/DMXCore100.Plugin.WiZ).

## The Govee Plugin

The Govee plugin drives **Govee WiFi lights** — LED strips, neon ropes,
panels, and lamps that support Govee's local LAN API (the H618x/H619x strip
series and similar; the ordinary Govee A19 bulbs do not) — with no cloud
account needed at show time. Each light must have **LAN Control** switched
on once in its Govee Home app settings, and only then answers on the
network. The plugin adds a **GOVEE** output type with an RGB color protocol
and white protocols (Dimmer+CT in kelvin mode, Dimmer), a **Discover**
button that finds the lights and shows their model, and **Govee — Color
Light** / **Govee — White Light** fixture profiles. Updates are rate-limited
to 10 per second per light. See
[Output Config](/dmx-core-100/configuration/output-config#plugin-output-types-shelly-lifx-wiz-govee)
for setup.

Govee firmware smooths every change — color, brightness, and power — over a
fixed fade the protocol cannot shorten: fades and gentle effects look great,
but strobes, fast chases, and hard blackouts smear together. The LAN API
also drives the whole device as a single zone, so per-segment (RGBIC)
control is not available. Both are the device, not the plugin or the Core.

The plugin's source is public at
[DMXCore/DMXCore100.Plugin.Govee](https://github.com/DMXCore/DMXCore100.Plugin.Govee).

## The Lightjams Plugin

The Lightjams Recorder Import plugin imports
**[Lightjams](https://www.lightjams.com/) Art-Net recorder video files**
(`.mp4`/`.avi`) as [cues](/dmx-core-100/playback/cues): upload a recording in
the File Explorer and pick **Import Lightjams recording**. Values are
bit-exact, original frame timing and ArtSync synchronization are preserved,
and unused universes are dropped. No settings are required. See
[Lightjams Recorder Import](/dmx-core-100/integrations/lightjams).

## Building Your Own

Anyone can build a plugin and publish it to the registry — see
[Building & Publishing Plugins](/dmx-core-100/integrations/publishing-plugins).
