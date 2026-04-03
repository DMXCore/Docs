---
title: Schedules
description: Automate playback on a timed schedule
---

Schedules let you automatically trigger cues, presets, sounds, or timelines at specific times. Use schedules for recurring lighting scenes — for example, turning on lobby lights at sunset or running a show every evening.

## Viewing Schedules

On the **touchscreen**, navigate to **Main Menu > Schedules** to see the list. Select one to modify its settings, or choose **Add** to create a new schedule.

![Schedules list](https://github.com/DMXCore/DmxCore100/assets/407941/bb842a30-a66a-4956-a8a4-72e2704865e0)

In the **Web UI**, go to **Lighting > Schedules**. The list shows all schedules with their enabled/disabled status. Click a schedule name to edit it.

<!-- SCREENSHOT: Web UI schedules list (dark mode) -->

## Schedule Settings

![Schedule settings](https://github.com/DMXCore/DmxCore100/assets/407941/d3873c31-d141-4a1a-b11f-e4b8eaa17858)

| Setting | Description |
|---------|-------------|
| **Name** | Display name of the schedule |
| **Enabled** | Turn the schedule on or off |
| **Override** | When on, this schedule overrides other schedules for the same period |
| **Start Date** | When the schedule starts |
| **End Date** | Optional end date (inclusive) |
| **Days** | Days of the week the schedule runs on |
| **Start Time** | Time of day when the schedule triggers |
| **End Time** | Optional end time (cue playback may end earlier) |
| **Output** | Which output to use (if multiple are configured) |
| **Type** | Type of event: cue, preset, sound, timeline, or ambient preset |
| **Play** | Which item to play at the scheduled time |
| **Dimmer** | Brightness level for the scheduled playback |
| **Stop at Completion** | When enabled, playback stops when the cue/sound finishes rather than looping |

Schedules are triggered on whole minutes (e.g., 8:00:00, 8:01:00).

**Delete Schedule** will remove the schedule from the system. Note that changes don't take effect until you exit the settings screen.

## Snoozing Schedules

You can temporarily disable all schedules using the **Snooze** feature:

- On the **touchscreen**, go to **Main Menu > Utilities > Snooze Schedules** for quick snooze shortcuts
- In the **Web UI**, schedules can also be toggled via [custom menus](/dmx-core-100/scheduling-automation/custom-menus)

Snoozing temporarily disables schedules with an auto-resume timer. The current snooze status is displayed on screen.

## Duplicating Schedules

In the **Web UI**, you can duplicate a schedule to create a copy. This is useful for setting up similar schedules for different times or days.
