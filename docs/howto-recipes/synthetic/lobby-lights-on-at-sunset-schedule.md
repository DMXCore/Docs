---
status: candidate
source: synthetic
invented: true
level: newbie
surface: web
date: 2026-09-15
title: Turn the lobby lights on at sunset and off at 11 pm
slug: lobby-lights-on-at-sunset-schedule
anonymized: true
docs_slugs:
  - dmx-core-100/scheduling-automation/schedules
  - dmx-core-100/configuration/settings
verified: docs be6f663, core v2026.914.3
---

# Turn the lobby lights on at sunset and off at 11 pm

## Original ask

> can the box just turn the lobby lights on when it gets dark and off at 11 every night? i made a preset called lobby warm. the sunset time keeps changing so i dont want to type a time

## Goal

A Web UI schedule starts at the calculated sunset every day, applies the preset, and ends at 23:00. The device location is set so the sunset time can be calculated.

## Walkthrough

```json
{
  "id": "lobby-lights-on-at-sunset-schedule",
  "title": "Turn lights on at sunset and off at 11 pm",
  "steps": [
    {
      "id": "set-location",
      "label": "In the Web UI, go to Device → System, enter the site's coordinates in Location (latitude, longitude), check that Timezone is correct, and save",
      "docsUrl": "/dmx-core-100/configuration/settings/#device-location",
      "screenshotId": "system-settings"
    },
    {
      "id": "add-schedule",
      "label": "Go to Lighting → Schedules and click Add New",
      "docsUrl": "/dmx-core-100/scheduling-automation/schedules/#viewing-schedules",
      "screenshotId": "schedules-list"
    },
    {
      "id": "set-sunset-start",
      "label": "Give it a Code / Short Name and Name, turn Enabled on, set Start to Sunset (Start Offset (minutes) 0, or e.g. -15 for earlier), and tick every day under Days",
      "docsUrl": "/dmx-core-100/scheduling-automation/schedules/#sunrise-and-sunset-times",
      "screenshotId": "schedule-editor"
    },
    {
      "id": "set-fixed-end",
      "label": "Set End to Fixed time and End Time to 11:00 PM",
      "docsUrl": "/dmx-core-100/scheduling-automation/schedules/#schedule-settings",
      "screenshotId": "schedule-editor"
    },
    {
      "id": "choose-preset",
      "label": "Under Action, set Action Type to Apply Preset and Target to the lobby warm preset, then Save",
      "docsUrl": "/dmx-core-100/scheduling-automation/schedules/#schedule-settings",
      "screenshotId": "schedule-editor"
    },
    {
      "id": "check-status",
      "label": "Back on Lighting → Schedules, check that the Status column shows today's resolved time (e.g. Start at 7:48 PM), not Set device location for sunrise/sunset",
      "docsUrl": "/dmx-core-100/scheduling-automation/schedules/#sunrise-and-sunset-times",
      "screenshotId": "schedules-list"
    }
  ]
}
```

## Gotchas

- Sunrise and sunset start and end times can only be set in the Web UI editor. The touchscreen schedule editor only has fixed Start Time and End Time.
- If Location is empty, sun-based schedules do not run. The list then shows **Set device location for sunrise/sunset**.
- Sun times are calculated on the device, so no internet is needed. They use the device's local time, so a wrong **Timezone** shifts everything.
- Schedules fire on whole minutes.
- At the end time, a preset schedule stops that preset. With End set to **None**, the preset stays on until something else changes it.
- Offsets are in minutes. Negative means before sunset. The limit is ±720, and the result is clamped to the same day.

## Eval checks

- Location path is `Device > System`, field **Location (latitude, longitude)**
- Schedule path is `Lighting > Schedules` (Web UI)
- Uses **Start** = **Sunset** (not a fixed Start Time that has to be changed by hand)
- Uses **End** = **Fixed time** with 11:00 PM (23:00)
- Action is **Apply Preset** with the user's preset
- Mentions that sunrise/sunset needs the device location set
- Does not say sunset schedules can be set on the touchscreen
- Does not tell them to write a script with `dmx.sunset()` for this
- Does not invent an "astronomical clock" or "dusk" option
- Does not tell them to use MCP or the Integration API

## Gaps

- schedules.md "Schedule Settings" table lists **Override**, **Output**, **Type**, **Play** and **Stop at Completion**. The released Web UI editor has none of those labels. It has a **Schedule Details** section and an **Action** section with **Action Type**, **Target**, **Priority**, **Loop (0 = forever)**, **Run to completion**, **Fade-In Time (ms)**, **Fade-Out Time (ms)**, **Dimmer** and **Volume**. Source: `src/AdminSite/ClientApp/src/views/operation/ScheduleDetails.vue`; navigation `web/schedules/details`. The touchscreen editor uses **Priority**, **Type**, **Play**, **Loop (0=forever)** and **Run to completion**, and has no Override or Output field (`src/UnoHost/Services/MenuManager.cs`, navigation `uno/utilities/schedules/{schedule}`).
- schedules.md "Sunrise and Sunset Times" step 3 calls the field **Offset**. The editor labels are **Start Offset (minutes)** and **End Offset (minutes)** (navigation `web/schedules/details`).
- schedules.md "Viewing Schedules" does not name the Web UI **Add New** action or the **Details** column (navigation `web/schedules`).
- The docs do not say what happens to a preset at the schedule end. At the end the preset is stopped (`StorageManager.RunSchedule` end action calls `fixtureManager.StopPreset`, `src/Shared/Services/StorageManager.cs`). With End = None the schedule never ends (`Schedule.HasEndDefined`, `src/BusinessObject/Schedule.cs`).

## Verification

- set-location: settings.md "Device Location" (**Location (latitude, longitude)** under **Device > System**, Timezone note). Navigation `web/settings/system` field `Location (latitude, longitude)`. `_nav.js` Device → System at v2026.914.3.
- add-schedule: schedules.md "Viewing Schedules" (**Lighting > Schedules**). `_nav.js` item Schedules under the Lighting title. Navigation `web/schedules` action **Add New**.
- set-sunset-start: schedules.md "Sunrise and Sunset Times" (Start from Fixed time to Sunset, offset in minutes). Navigation `web/schedules/details` fields **Start** (Fixed time/Sunrise/Sunset), **Start Offset (minutes)**, **Days**, **Enabled**, **Code / Short Name**.
- set-fixed-end: schedules.md "Schedule Settings" (**End**, **End Time**). Navigation `web/schedules/details` **End** options None/Fixed time/Sunrise/Sunset and **End Time**.
- choose-preset: schedules.md "Schedule Settings" (Type preset). Navigation `web/schedules/details` **Action Type** option **Apply Preset**, **Target**, actions **Save**.
- check-status: schedules.md "Sunrise and Sunset Times" notes (missing location status text, resolved time in list). `src/BusinessLogic/ScheduleManager.cs` `StatusTextOverride = "Set device location for sunrise/sunset"` and `Start at {time}` status text. Navigation `web/schedules` column **Status**.
- Touchscreen has fixed times only: navigation `uno/utilities/schedules/{schedule}` (Start Time/End Time, no Start mode).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
