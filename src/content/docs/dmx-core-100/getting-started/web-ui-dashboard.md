---
title: Web UI Dashboard
description: Overview of the Web UI layout and navigation
---

After logging in, the Web UI displays the Dashboard — your central hub for monitoring and controlling the DMX Core 100.

![The Web UI dashboard and sidebar](/assets/web/dashboard.png)

## Layout

The Web UI has two main areas:

- **Sidebar** (left) — Navigation organized into sections. Groups under System expand and collapse.
- **Main content** (right) — The active page, with a breadcrumb trail at the top showing your current location.

## Sidebar Navigation

| Group | Contains |
|-------|----------|
| **Dashboard** | System status, currently playing items, playback controls |
| **Lighting** | [Presets](/dmx-core-100/playback/presets), [Effects](/dmx-core-100/lighting/effects), [Cues](/dmx-core-100/playback/cues), [Sounds](/dmx-core-100/playback/sounds), [Timelines](/dmx-core-100/playback/timelines), [Schedules](/dmx-core-100/scheduling-automation/schedules), [Fixture Control](/dmx-core-100/lighting/fixture-control) |
| **Operation** | [Surface Operator](/dmx-core-100/control-surfaces/surface-operator), [Tempo](/dmx-core-100/lighting/tempo), [Custom Menu](/dmx-core-100/scheduling-automation/custom-menus), [Ambient Presets](/dmx-core-100/playback/presets#ambient-presets) |
| **Lighting Setup** | [Outputs](/dmx-core-100/configuration/output-config), Protocol ([merge & priority](/dmx-core-100/playback/layers-and-priority)), [Fixtures](/dmx-core-100/lighting/fixture-setup), Cue Fade Masks, [Zones](/dmx-core-100/lighting/zones) *(with Multi-Zone Playback enabled)* |
| **Control & Integrations** | [Input Triggers](/dmx-core-100/scheduling-automation/input-triggers), [Output Events](/dmx-core-100/scheduling-automation/output-events), [Control Surfaces](/dmx-core-100/control-surfaces), [Control Values](/dmx-core-100/integrations/control-values), [OSC Clients](/dmx-core-100/integrations/osc-open-sound-control), Remote Control, [MQTT](/dmx-core-100/integrations/mqtt), [Scripts](/dmx-core-100/scheduling-automation/scripting), Plugins ([Q-SYS & Symetrix](/dmx-core-100/external-control)) |
| **Device** | System, Network, Touchscreen, [Custom Menus](/dmx-core-100/scheduling-automation/custom-menus), Installer — see [Settings](/dmx-core-100/configuration/settings) |
| **Utilities** | [Audit Log](/dmx-core-100/configuration/audit-log), [Device Monitor](/dmx-core-100/configuration/device-monitor), [Output Monitor](/dmx-core-100/configuration/output-monitor), [Record](/dmx-core-100/playback/recording), Releases, System |
| **Backup & Restore** | [Local and cloud backups](/dmx-core-100/configuration/backup-and-restore) |
| **File Explorer** | Browse and manage files on the device |
| **User Management** | [Users & Roles](/dmx-core-100/configuration/users-and-roles) |

:::note
Some sidebar items are only visible to users with the appropriate permissions. If you don't see a menu item, check with your administrator about your role permissions.
:::

## Dashboard Content

The Dashboard shows:

- **Currently playing** items (cues, sounds, timelines) with playback controls (pause, stop, seek)
- **System status** including device temperatures, CPU/memory usage, storage, and network speed
- **Quick actions** for common operations, plus [favorites](/dmx-core-100/scheduling-automation/favorites) when configured

## Theme

The Web UI supports both light and dark themes — use the theme toggle in the top bar.
