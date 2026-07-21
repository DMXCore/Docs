---
title: Output Config
description: Configure DMX output universes and protocols
---

Output configuration defines how the DMX Core 100 sends DMX data to your lighting fixtures — which protocols, universes, and physical ports to use.

:::note[Default output]
A new install already includes a default **sACN** output on **universe 1**, so basic single-universe setups work out of the box. You can edit or remove it, or add more outputs as needed.
:::

## Touchscreen

On the touchscreen, navigate to **Main Menu > Output Config** to see the list of outputs.

![Output Config screen](https://github.com/DMXCore/DmxCore100/assets/407941/b38029cf-e53f-4915-a4d6-88ee4d025df3)

Click **Add** to create a new output. Select an existing output to edit its settings.

![Output configuration detail](https://github.com/DMXCore/DmxCore100/assets/407941/31494897-eb63-4102-9b56-2aa5ecbf5c27)

## Web UI

In the Web UI, go to **Lighting Setup > Outputs** for the same configuration with additional detail.

![Outputs list in the Web UI](/assets/web/outputs-list.png)

## Output Settings

Each output can be configured with:

- **Code / Name** — identifier and display name
- **Output Type** — sACN (E1.31), ArtNet, KiNet (v1/v2), TPM2.net, MQTT, or USB DMX
- **Start Slot Id / Start Universe Id** — which internal slot maps to which on-the-wire universe
- **Universe Count** — how many consecutive universes this output spans
- **Destination IP** — unicast target (protocol dependent; leave empty for multicast/broadcast)
- **Send Sync** — emit sync packets for multi-universe synchronization
- **sACN Send Priority** — the per-output sACN priority used by downstream receivers when merging against other sources (see [Layers & Priority](/dmx-core-100/playback/layers-and-priority))

The DMX Core 100 supports up to 800 universes at 40 Hz (or 600 universes at 60 Hz) for network streams, and up to 4 universes via USB DMX devices (Enttec Pro, DMXking).

:::tip[Driving an Advatek controller?]
The [Device Monitor](/dmx-core-100/configuration/device-monitor) can create an output directly from a discovered Advatek controller's port, pre-filled with the right protocol and universes. See [Advatek Lighting](/dmx-core-100/integrations/advatek-lighting).
:::

### TPM2.net

TPM2.net is a UDP-based protocol for pixel LED controllers. Select **TPM2.net** as the output type and set the target IP address to send pixel data to compatible controllers, with a configurable pixel type (used for TPM2.net and built-in test patterns; it has no effect on cues and presets).

### MQTT

An MQTT output publishes level data to the configured [MQTT broker](/dmx-core-100/integrations/mqtt) — including experimental support for Shelly RGBW devices.
