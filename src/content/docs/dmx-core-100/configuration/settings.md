---
title: Settings
---

## Touchscreen Settings

On the touchscreen, navigate to **Main Menu > Settings** to access basic system settings, including the output protocol, timezone, and available software releases.

![Settings screen](https://github.com/DMXCore/DmxCore100/assets/407941/ebe9a874-3ad8-4b6d-86c9-cdd772e437b2)

Tap a setting (or select it with the rotary knob) to change it in a popup. The top option with the X leaves the selection unchanged; the current selection is marked with a checkmark. Long-hold also cancels.

## Web UI Settings

The Web UI exposes all settings, organized in the sidebar under **Lighting Setup**, **Control & Integrations**, and **Device**:

<!-- SCREENSHOT: Web UI sidebar with the System groups expanded (dark mode) -->

| Page | Description |
|------|-------------|
| **Lighting Setup > Outputs** | DMX output universes and protocols — see [Output Config](/dmx-core-100/configuration/output-config) |
| **Lighting Setup > Protocol** | Output frequency, [merge mode, priorities, and end-of-data behavior](/dmx-core-100/playback/layers-and-priority) |
| **Lighting Setup > Fixtures** | Fixture definitions — see [Fixture Setup](/dmx-core-100/lighting/fixture-setup) |
| **Lighting Setup > Cue Fade Masks** | Which DMX channels participate in cue fades — see [Cues](/dmx-core-100/playback/cues#fade-mask) |
| **Control & Integrations** | Triggers, events, [control surfaces](/dmx-core-100/control-surfaces), [control values](/dmx-core-100/integrations/control-values), OSC clients, MQTT, scripts, and DSP plugins |
| **Device > System** | Timezone, location, language, device nickname, lock-down options, ports, audio (see below) |
| **Device > Network** | DHCP/static IP, netmask, gateway, hostname override |
| **Device > Touchscreen** | Backlight and front LED brightness, display dim/off timeouts, navigation behavior, on-screen display options |
| **Device > Custom Menus** | End-user menus — see [Custom Menus](/dmx-core-100/scheduling-automation/custom-menus) |
| **Device > Installer** | Installation-specific settings and white-label branding |

### Device > System Highlights

- **Timezone**, **Language and Region**, and **Location** (below)
- **Device Nickname** and **Show Name** — displayed on-screen and in the portal
- **Screen Unlock PIN** and **Lock Screen after X seconds** — the touchscreen lock
- **Lock-down options** — lock down the device, show only the custom menu, only allow admins to record, allow stop output when locked down, hide fixture or remote control functionality
- **Multi-Zone Playback** — enables [zones](/dmx-core-100/lighting/zones)
- **Enable Remote Access** — the [cloud tunnel](/dmx-core-100/integrations/cloud-tunnel)
- **OSC Port**, **Local HTTP/HTTPS Ports** — network ports (changes require a restart)
- **Audio Device** and **Sample Rate** — output device for [sound playback](/dmx-core-100/playback/sounds)
- **Fixed VNC Password** — for VNC access to the touchscreen

### Device Location

The **Location (latitude, longitude)** setting under **Device > System**
tells the device where it is installed. It is used to calculate the local
sunrise and sunset times for
[schedules](/dmx-core-100/scheduling-automation/schedules#sunrise-and-sunset-times).
The calculation runs entirely on the device — no internet connection is
needed.

Enter the coordinates as latitude and longitude separated by a comma, for
example:

```
30.2672, -97.7431
```

Two easy ways to find your coordinates:

- Use the **Find your coordinates** link below the setting (latlong.net):
  search for your address and copy the values.
- In Google Maps, right-click your location on the map and click the
  coordinates at the top of the menu to copy them.

Coordinates only need to be approximate — being off by a few miles changes
sunrise/sunset by well under a minute. Make sure the **Timezone** setting is
also correct, since sun times are shown and evaluated in the device's local
time.

<!-- SCREENSHOT: Web UI System settings showing the Location setting with the latlong.net link (dark mode) -->

### NTP Time Synchronization

You can configure a custom NTP server for time synchronization, or sync the device time from your browser (useful when no NTP server is available on the network).
