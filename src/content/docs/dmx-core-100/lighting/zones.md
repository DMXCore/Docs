---
title: Zones
description: Organize fixtures into groups for zone-based control
---

Zones let you group fixtures together for easier management. For example, you might create zones for different rooms, areas of a stage, or types of fixtures. Zones are used throughout the system — you can apply presets and effects to specific zones rather than individual fixtures or the entire system.

## Managing Zones

Zones are managed under **Lighting Setup > Zones** in the Web UI, or **Main Menu > Settings > Zones** on the touchscreen. Enable **Multi-Zone Playback** under **Device > System** to turn on zone support.

### Creating a Zone

1. In the Web UI, go to **Lighting Setup > Zones** (touchscreen: **Settings > Zones**)
2. Click **Add New** (touchscreen: **Add**)
3. Set **Internal Id**, **Code / Short Name**, and **Name**
4. Click **Save**

The zone editor does not assign fixtures. Open each fixture and set its **Zone** field instead — see [Fixture Setup](/dmx-core-100/lighting/fixture-setup).

![Zones list in the Web UI](/assets/web/zones-list.png)

### Editing a Zone

Click a zone name in the list to open its settings. You can change the code and name, or delete the zone. To add or remove fixtures, edit the fixture's **Zone** field.

## Using Zones

Once zones are configured, they appear throughout the system:

- **[Presets](/dmx-core-100/playback/presets)** — Create zone-specific presets that only affect fixtures in a particular zone
- **[Effects](/dmx-core-100/lighting/effects)** — Apply effects to an entire zone
- **[Fixture Control](/dmx-core-100/lighting/fixture-control)** — Filter and control fixtures by zone
- **[Input Triggers](/dmx-core-100/scheduling-automation/input-triggers)** and **[Control Surfaces](/dmx-core-100/control-surfaces)** — Bind a fader or knob to a zone's intensity
- **[Q-SYS & Symetrix](/dmx-core-100/external-control)** — Switch between zone levels on a single fader
