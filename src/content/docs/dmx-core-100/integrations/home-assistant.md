---
title: Home Assistant
description: The DMX Core 100 appears in Home Assistant automatically — scenes, sliders, switches, and sensors via MQTT Discovery
---

The DMX Core 100 integrates natively with [Home Assistant](https://www.home-assistant.io/):
point both at the same MQTT broker and the device appears in Home Assistant
automatically, with all of its presets, cues, dimmers, and switches as
ready-to-use entities. No custom component, no YAML — the built-in **Home
Assistant plugin** publishes everything via MQTT Discovery.

The same discovery format is understood by openHAB, ioBroker, and Domoticz,
so those platforms work the same way.

![The DMX Core 100 device in Home Assistant](/assets/web/home-assistant-device.png)

## What You Get

Home Assistant shows one **DMX Core 100 device** containing:

| In Home Assistant | From the DMX Core 100 |
|---|---|
| Scenes | Presets, cues, and timelines — activate from dashboards, automations, scripts, or voice assistants |
| Number sliders (%) | Master dimmer, zone intensities, level [Control Values](/dmx-core-100/integrations/control-values), and audio volume |
| Switches | Audio mute, output mute, schedules (enable/disable), and toggle Control Values |
| Selects | Selector Control Values, e.g. an audio source picker |
| Buttons | Stop playback |
| Sensors | Now Playing — the running cue or timeline |

Everything is live in both directions: move a fader on the device and the
Home Assistant slider follows; change it in Home Assistant and the device
follows. If the device goes offline, its entities show as *unavailable*
until it returns.

## Setup

You need an MQTT broker that both systems can reach. Most Home Assistant
installations use the [Mosquitto add-on](https://www.home-assistant.io/addons/mosquitto/);
any standard broker works.

1. **Home Assistant**: add the MQTT integration (**Settings > Devices &
   Services > Add Integration > MQTT**) and connect it to your broker, if
   you haven't already.
2. **DMX Core 100**: under **Control & Integrations > MQTT**, enable the
   external MQTT server and enter the same broker's address, port, and
   credentials. See [MQTT](/dmx-core-100/integrations/mqtt).
3. That's it. Within a few seconds the device appears under **Settings >
   Devices & Services > MQTT** in Home Assistant.

:::tip[Plugin settings]
The integration ships as a built-in plugin, enabled by default. Under
**Control & Integrations > Plugins** you can adjust its settings: the
discovery prefix (leave at `homeassistant` unless you changed it in Home
Assistant) and per-category expose toggles — for example, hide individual
cues from Home Assistant while keeping the dimmers and schedules.
See [Plugins](/dmx-core-100/integrations/plugins).
:::

## Ideas

- **Sunset ambiance** — a Home Assistant automation at sunset activates your
  Evening preset. (Or use the DMX Core 100's own
  [sunrise/sunset schedules](/dmx-core-100/scheduling-automation/schedules)
  and just flip the schedule's switch from Home Assistant when you're away.)
- **Movie night** — one script dims your other smart lights *and* pulls the
  DMX Core 100 master dimmer to 20%.
- **Party button** — a dashboard button that fires a cue, sets the bar zone
  to full, and switches the audio source Control Value to the streaming
  input.
- **Presence** — when the alarm arms, stop playback and disable the
  schedules.
- **Status** — use the Now Playing sensor as an automation trigger, or show
  it on a wall tablet dashboard.

## Troubleshooting

- **No device appears in Home Assistant** — confirm both systems talk to the
  *same* broker, and that the plugin shows as connected under **Control &
  Integrations > Plugins**.
- **Entities show unavailable** — the broker lost the device; check the
  network and the MQTT settings. The DMX Core 100 reconnects automatically.
- **A deleted preset lingers in Home Assistant** — it is removed on the next
  catalog change; if Home Assistant cached it, reload the MQTT integration.
