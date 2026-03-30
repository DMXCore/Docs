---
title: Output Config
description: Configure DMX output universes and protocols
---

Output configuration defines how the DMX Core 100 sends DMX data to your lighting fixtures — which protocols, universes, and physical ports to use.

## Touchscreen

On the touchscreen, navigate to **Main Menu > Output Config** to see the list of outputs.

![Output Config screen](https://github.com/DMXCore/DmxCore100/assets/407941/b38029cf-e53f-4915-a4d6-88ee4d025df3)

Click **Add** to create a new output. Select an existing output to edit its settings.

![Output configuration detail](https://github.com/DMXCore/DmxCore100/assets/407941/31494897-eb63-4102-9b56-2aa5ecbf5c27)

## Web UI

In the Web UI, go to **Settings > Outputs** for the same configuration with additional detail.

<!-- SCREENSHOT: Web UI output configuration list (dark mode) -->

## Output Settings

Each output can be configured with:

- **Protocol** — ArtNet, sACN (E1.31), KiNet (v1/v2), or USB DMX
- **Universe** — The DMX universe number
- **Start Channel** — Starting DMX channel within the universe
- **Pixel Type** — Used for built-in patterns only (has no effect on cues and presets)

The DMX Core 100 supports up to 100 universes at 40 Hz for network streams, and up to 4 universes via USB DMX devices (Enttec Pro, DMXking).
