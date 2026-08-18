---
title: Output Config
description: Configure DMX output universes and protocols
---

Output configuration defines how the DMX Core 100 sends DMX data to your lighting fixtures — which protocols, universes, and physical ports to use.

:::note[Default output]
A new install already includes a default **sACN** output on **universe 1**, so basic single-universe setups work out of the box. You can edit or remove it, or add more outputs as needed.
:::

## Touchscreen

On the touchscreen, navigate to **Main Menu > Output Config** to see the list of outputs. Click **Add** to create a new output, or select an existing output to edit its settings.

## Web UI

In the Web UI, go to **Lighting Setup > Outputs** for the same configuration with additional detail.

![Outputs list in the Web UI](/assets/web/outputs-list.png)

## Output Settings

Each output can be configured with:

- **Code / Name** — identifier and display name
- **Output Type** — sACN (E1.31), ArtNet, KiNet (v1/v2), TPM2.net, USB DMX, or a plugin-provided type such as SHELLY, LIFX, or WIZ
- **Start Slot Id / Start Universe Id** — which internal slot maps to which on-the-wire universe
- **Universe Count** — how many consecutive universes this output spans
- **Destination IP** — unicast target (protocol dependent; leave empty for multicast/broadcast)
- **Send Sync** — emit sync packets for multi-universe synchronization
- **sACN Send Priority** — the per-output sACN priority used by downstream receivers when merging against other sources (see [Layers & Priority](/dmx-core-100/playback/layers-and-priority))

The DMX Core 100 supports up to 800 universes at 40 Hz (or 600 universes at 60 Hz) for network streams, and up to 4 universes via USB DMX devices (Enttec Pro, DMXking).

:::tip[Driving an Advatek controller?]
The [Device Monitor](/dmx-core-100/configuration/device-monitor) can create an output directly from a discovered Advatek controller's port, pre-filled with the right protocol and universes. See [Advatek Lighting](/dmx-core-100/integrations/advatek-lighting).
:::

## Toggling All Output

The **Toggle Output** action switches all DMX output off and back on with a single button press. It is available wherever actions can be assigned: [custom menus](/dmx-core-100/scheduling-automation/custom-menus), [input triggers](/dmx-core-100/scheduling-automation/input-triggers), [control surfaces](/dmx-core-100/control-surfaces/configuring), and [schedules](/dmx-core-100/scheduling-automation/schedules).

While output is toggled off, the device stops transmitting entirely — exactly as if every output had been disabled in the configuration. No blackout is sent, so receivers keep running on their own hold/fade behavior or seamlessly fall back to another sACN source.

This is designed for redundant installations with a backup unit: keep the second DMX Core 100 running with its output toggled off, and switch over by toggling output off on the primary and on on the backup. The state is stored in the output configuration, so a unit that is parked as standby stays silent even after a power cycle.

A button assigned to Toggle Output shows an active state while output is suppressed — glow in the Web UI, highlight on the touchscreen, and a lit key on a Stream Deck.

### TPM2.net

TPM2.net is a UDP-based protocol for pixel LED controllers. Select **TPM2.net** as the output type and set the target IP address to send pixel data to compatible controllers, with a configurable pixel type (used for TPM2.net and built-in test patterns; it has no effect on cues and presets).

### Plugin Output Types (Shelly, LIFX, WiZ)

[Plugins](/dmx-core-100/integrations/plugins) can add their own output types
that drive networked lighting devices — WiFi bulbs and similar — from a slice
of DMX channels. Installed from **Plugins > Browse**, the **Shelly** plugin
adds a SHELLY output type for Shelly Gen1 color devices (RGBW2 and similar)
over MQTT, the **LIFX** plugin a LIFX type for LIFX bulbs and multizone
fixtures over the LIFX LAN protocol, and the **WiZ** plugin a WIZ type for
WiZ (Signify) bulbs over the WiZ local UDP protocol.

A plugin output maps one device per output:

- **Protocol** — the device's channel layout, e.g. RGB, RGBW, or
  RGBW+intensity for Shelly; RGB / RGB+CT / RGBW / RGBW+CT (8- or 16-bit) or
  Pixel for LIFX; RGB / RGBW+CT / RGB+CW+WW, Dimmer+CT, or Dimmer for WiZ
- **Destination Address** — which device to drive: the device id for Shelly
  (e.g. `shellyrgbw2-A4CF12F45478`), the light's IP address for LIFX and WiZ
  (give those lights a static DHCP lease). Use the **Discover** button to pick
  from devices found on the network; for LIFX pixel devices it also fills the
  mapping's **Pixels** field.
- **Start Channel** — the DMX start address of the device's channels within the slot (matching the fixture's start channel)

The device's channels live in a normal slot/universe, so anything that writes
DMX can drive it — cues, presets, effects, or externally received sACN. For
native control, patch a fixture at the same slot and channels: the plugin
provides a matching fixture profile (e.g. **Shelly — Gen1 Color**, **LIFX —
Color Bulb**, **WiZ — Color Bulb**), and the fixture editor's **Mapped
Device** selector prefills the slot, start channel, and personality straight
from the output mapping.

Updates are rate-limited per device to what the hardware handles (about 10
commands per second for Shelly Gen1 and WiZ, 20 for LIFX), with unchanged
values deduplicated automatically.
