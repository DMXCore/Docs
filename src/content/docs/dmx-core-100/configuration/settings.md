---
title: Settings
---

## Touchscreen Settings

On the touchscreen, navigate to **Main Menu > Settings** to access basic system settings.

![Settings screen](https://github.com/DMXCore/DmxCore100/assets/407941/ebe9a874-3ad8-4b6d-86c9-cdd772e437b2)

This is where you can see some of the system settings, including output protocol (sACN or ArtNet) and timezone settings. You can also see the list of available releases and select to upgrade as needed.

Tap on a setting (or select with the rotary knob) to change it in a popup:

![Settings popup](https://github.com/DMXCore/DmxCore100/assets/407941/fd559a1b-8910-4e44-adcf-cd98725b7cab)

If you select the top option with the X then the selection is not changed. The current selection is marked with the checkmark. You can also long-hold to cancel the selection.

## Web UI Settings

The Web UI provides access to all settings, organized into categories under the **Settings** group in the sidebar:

<!-- SCREENSHOT: Web UI settings sidebar expanded -->

| Category | Description |
|----------|-------------|
| **System** | Device nickname, show name, timezone, display theme, NTP server |
| **Network** | DHCP/static IP, netmask, gateway, hostname override |
| **Protocol** | Output protocol (ArtNet/sACN), sync settings |
| **Preferences** | Fade speed, auto log-off timeout, theme (light/dark) |
| **Installer** | Installation-specific settings |
| **Remote Control** | External control device configuration |
| **White Label** | Custom branding (when enabled) |

### NTP Time Synchronization

You can configure a custom NTP server for time synchronization, or sync the device time from your browser (useful when no NTP server is available on the network).
