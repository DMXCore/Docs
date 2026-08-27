---
title: Settings
---

## Touchscreen Settings

On the touchscreen, navigate to **Main Menu > Settings** to access basic system settings, including the output protocol, timezone, and available software releases.

![Settings on the touchscreen](/assets/device/uno-settings.png)

Tap a setting (or select it with the rotary knob) to change it in a popup. The top option with the X leaves the selection unchanged; the current selection is marked with a checkmark. Long-hold also cancels.

## Web UI Settings

The Web UI exposes all settings, organized in the sidebar under **Lighting Setup**, **Control & Integrations**, and **Device**:

| Page | Description |
|------|-------------|
| **Lighting Setup > Outputs** | DMX output universes and protocols — see [Output Config](/dmx-core-100/configuration/output-config) |
| **Lighting Setup > Protocol** | Output frequency, [merge mode, priorities, and end-of-data behavior](/dmx-core-100/playback/layers-and-priority) |
| **Lighting Setup > Fixtures** | Fixture definitions — see [Fixture Setup](/dmx-core-100/lighting/fixture-setup) |
| **Lighting Setup > Cue Fade Masks** | Which DMX channels participate in cue fades — see [Cues](/dmx-core-100/playback/cues#fade-mask) |
| **Control & Integrations** | Triggers, events, [control surfaces](/dmx-core-100/control-surfaces), [control values](/dmx-core-100/integrations/control-values), OSC clients, MQTT, scripts, and [plugins](/dmx-core-100/integrations/plugins) |
| **Device > System** | Timezone, location, language, device nickname, lock-down options, ports, audio (see below) |
| **Device > Network** | Per-adapter IP configuration — DHCP or static address, netmask, gateway (see below) |
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
- **Enable MCP Server** — expose the [MCP](/dmx-core-100/integrations/mcp-server) endpoint for AI clients; use **Issue MCP API Key** on the same page (or **User Management > API Keys**)
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

![System settings with the device Location field](/assets/web/system-settings.png)

### Device > Network

**Device > Network** lists the network adapters the DMX Core 100 has, one card
per adapter. Each card shows the adapter name and its system interface name, a
**Connected** / **Not connected** badge, and — when connected — the current IP
address, whether it came from **DHCP** or is **Static**, and the gateway.

Under **IP settings** on each card:

- **Use DHCP** — on by default. The address is assigned by your network.
- Turn **Use DHCP** off to enter an **IP address**, **Netmask** and
  **Gateway** yourself, then press **Apply**.

IP settings can only be applied while the adapter is connected; on a
disconnected adapter the **Apply** button is unavailable and the page says so.

:::caution
Changing the IP settings of the adapter you are currently connected through
will drop your connection to the Web UI. You will need to reconnect using the
new address.
:::

If a bad static configuration makes a unit unreachable, see
[Force DHCP mode](/dmx-core-100/troubleshooting/#force-dhcp-mode).

**Override Host Name**, **Custom NTP Server**, and
**Enable Internet Passthrough** (shows the
[Internet Passthrough](/dmx-core-100/integrations/internet-passthrough) section
on the Utilities page) are not on this page — follow the **network settings**
link at the bottom of it to reach them.

On the touchscreen the same per-adapter configuration is under
**Main Menu > Settings > Network Adapters...**.

#### If no Wi-Fi adapter is present

A DMX Core 100 with no wireless adapter shows an extra card reading **No Wi-Fi
adapter detected**, below the wired adapter. This is informational — the card
appears whenever the device has no wireless hardware, which is the normal state
for a standard unit, and nothing on the page is broken or missing because of it.
Wired configuration is unaffected.

### NTP Time Synchronization

You can configure a custom NTP server for time synchronization, or sync the device time from your browser (useful when no NTP server is available on the network).
