---
title: Utilities
description: Touchscreen and Web UI utilities, including factory reset
---

Utilities are available on both the **touchscreen** and the **Web UI**. The touchscreen menu covers day-to-day tools such as recording and snooze. The Web UI **Utilities > System** page adds device status, maintenance actions, and factory reset.

## Touchscreen

![Utilities on the touchscreen](/assets/device/uno-utilities.png)

#### Record

This is where you can record new cues and presets using settings from the configured output.

#### Schedules

Create and edit [schedules](/dmx-core-100/scheduling-automation/schedules) directly on the device (admin mode).

#### Snooze Schedules

![Snooze schedules screen](/assets/device/uno-snooze.png)

Here you have quick shortcuts to snooze the schedule for a period of time. For example, you can use this to temporarily turn off the evening's schedule to run a custom preset. The schedule will automatically resume so you won't forget to turn it back on. The top text shows the current snooze status.

## Web UI

The **Utilities** sidebar group includes [Audit Log](/dmx-core-100/configuration/audit-log), [Device Monitor](/dmx-core-100/configuration/device-monitor), [Output Monitor](/dmx-core-100/configuration/output-monitor), [Record](/dmx-core-100/playback/recording), Releases, and **System**.

### System

**Utilities > System** shows device identity (hardware ID, software version, license) and live resource usage. Maintenance actions include taking a screenshot of the touchscreen, downloading logs, setting the clock, regenerating the VNC password, re-initializing ports, and cleaning up leftover files.

On wall-mounted appliances, **Restart** and **Reboot** are also available to users with **Device Operations** permission.

[Internet Passthrough](/dmx-core-100/integrations/internet-passthrough), when enabled, appears on this page as well.

### Factory Reset

:::caution
Factory reset permanently deletes show content, users, and application settings. It cannot be undone except by restoring a backup you already have. Local backup files on the device are kept.
:::

Factory reset returns the device to empty first-start defaults while keeping the operating system, network configuration, and device license. Use it when you want a clean show setup without re-flashing the unit.

:::tip[Web UI only]
Factory reset is available under **Utilities > System**, in the **Danger zone** card. It requires the **Change System Settings** permission — the built-in Admin role has this; Operator does not.
:::

#### How to run it

1. In the Web UI, go to **Utilities > System**
2. Scroll to **Danger zone** and click **Factory Reset**
3. Type **RESET** (the confirm button stays disabled until the word matches)
4. Click **Factory Reset** in the dialog

On a wall-mounted appliance the service restarts automatically. On the Windows, macOS, or Linux desktop app, the application closes after a few seconds — start it again from the usual shortcut.

After the reset:

- Sign in as **Administrator** with PIN **1111**, then change that PIN
- All other user accounts, roles, and API keys are gone
- Existing Web UI sessions stop working — you will need to log in again
- Show name, output configuration, and other application settings return to defaults
- [Local backups](/dmx-core-100/configuration/backup-and-restore) remain and can be restored from **Backup & Restore**

:::caution
`1111` is the factory default PIN. Change it as soon as you log in.
:::

#### What is deleted

- Cues, sounds, images, and user-installed plugins
- Presets, timelines, schedules, effects, custom menus, input triggers, and output events
- Users, roles, and API keys
- Fixture layout (replaced with the empty template)
- Application settings except the network fields listed below

#### What is kept

- Network settings (IP address, Wi-Fi, hostname override, NTP server, internet passthrough)
- Device license
- Local backup files, so you can restore a previous show afterward
- Extra folders you added in the data directory that are not show data

Factory reset does not rewrite the operating system image. If the device will not boot or you need a full OS recovery, see [Re-flash Instructions](/dmx-core-100/troubleshooting/re-flash-instructions).
