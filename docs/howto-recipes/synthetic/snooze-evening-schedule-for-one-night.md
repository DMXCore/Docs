---
status: candidate
source: synthetic
invented: true
level: newbie
surface: both
date: 2026-09-15
title: Skip the evening schedule for one night
slug: snooze-evening-schedule-for-one-night
anonymized: true
docs_slugs:
  - dmx-core-100/scheduling-automation/schedules
  - dmx-core-100/configuration/utilities
  - dmx-core-100/scheduling-automation/favorites
verified: docs be6f663, core v2026.914.3
---

# Skip the evening schedule for one night

## Original ask

> we have a private event tonight and the lights always switch to the dinner look at 6 on their own. how do i stop that just for tonight without breaking the timer? im at the little screen by the bar

The user follows up after the first answer:

> can i also do that from my phone in the web page?

## Goal

Schedules are snoozed from the touchscreen and resume on their own the next morning. The user also learns that the Web UI has no timed snooze, only a switch that disables a schedule until someone turns it back on.

## Walkthrough

```json
{
  "id": "snooze-evening-schedule-for-one-night",
  "title": "Skip the evening schedule for one night",
  "steps": [
    {
      "id": "open-snooze",
      "label": "On the touchscreen, go to Main Menu → Utilities → Snooze Schedules",
      "docsUrl": "/dmx-core-100/configuration/utilities/#touchscreen",
      "screenshotId": "uno-utilities"
    },
    {
      "id": "pick-snooze",
      "label": "Before the schedule starts, tap Snooze until 9am (tomorrow) so the rest of tonight is skipped",
      "docsUrl": "/dmx-core-100/scheduling-automation/schedules/#snoozing-schedules",
      "screenshotId": "uno-snooze"
    },
    {
      "id": "check-status",
      "label": "Check the text at the top of Snooze Schedules: it shows until when schedules are snoozed",
      "docsUrl": "/dmx-core-100/configuration/utilities/#touchscreen",
      "screenshotId": "uno-snooze"
    },
    {
      "id": "resume-early",
      "label": "To bring the schedules back early, open Snooze Schedules again and tap Resume",
      "docsUrl": "/dmx-core-100/configuration/utilities/#touchscreen",
      "screenshotId": "uno-snooze"
    },
    {
      "id": "web-alternative",
      "label": "From a phone (Web UI) there is no timed snooze: the Toggle Schedule action in a custom menu, or the schedule switch on Operation → Favorites, disables that schedule until someone turns it back on",
      "docsUrl": "/dmx-core-100/scheduling-automation/schedules/#snoozing-schedules",
      "screenshotId": "favorites"
    }
  ]
}
```

## Gotchas

- Snooze pauses **all** schedules, not only the dinner one. It resumes on its own at the chosen time.
- Snooze does not change the schedule settings, so nothing needs to be fixed tomorrow.
- Snooze before the start time. In the released software a snooze stops schedules from starting, but it does not stop a schedule that is already running. If the dinner look is already on, stop it or apply another look as well.
- Toggle Schedule, and the switch in the Favorites schedule table, change the schedule's **Enabled** setting. That change is saved and does not come back by itself. Tell the user to switch it back on after the event.
- The Favorites schedule table only appears if that schedule is marked **Favorite** in its editor.
- Snooze Schedules only appears for users with the snooze permission.

## Eval checks

- Touchscreen path is `Main Menu > Utilities > Snooze Schedules`
- Names a real snooze option (**Snooze 1h**, **Snooze until midnight**, **Snooze until 9am**) and **Resume**
- Says the schedules resume automatically
- Follow-up: says the Web UI has no timed snooze. Offers Toggle Schedule (custom menu) or the Favorites schedule switch, and warns that the schedule must be re-enabled by hand
- Does not tell them to delete the schedule or change its days or times
- Does not invent a "Skip tonight" or per-date exception field
- Does not claim a snooze button exists on the Web UI Schedules page
- Does not tell them to use MCP or the Integration API

## Gaps

- schedules.md "Snoozing Schedules" and utilities.md "Snooze Schedules" do not list the options. The released items are **Resume**, **Snooze 1h**, **Snooze until midnight** and **Snooze until 9am** (subtitle "Tomorrow" once 9 am has passed). Source: `GetSnoozeSchedules` in `src/UnoHost/Services/MenuManager.cs`; navigation `uno/utilities/snooze schedules`.
- schedules.md says "In the Web UI, schedules can also be toggled via custom menus", next to snooze. That reads as if it were a Web UI snooze. Toggle Schedule flips and saves `Schedule.Enabled` with no auto-resume (`ProcessTriggerAction` case `ScheduleToggle`, `src/Shared/Services/StorageManager.cs`). The Web UI has no snooze screen (no snooze in `src/AdminSite/ClientApp/src` at v2026.914.3).
- The docs do not say that snooze leaves an already-running schedule running. `ScheduleManager.CheckSchedules` (`src/BusinessLogic/ScheduleManager.cs`) only blocks the start while snoozed. The end check compares against `scheduleToRun`, which is still picked during a snooze, so a running instance is not ended.
- favorites.md does not mention the Schedules table on **Operation > Favorites**, its enable/disable switch, or the **Favorite** field on schedules. Source: `Favorites.vue` `toggleScheduleEnabled` → `PUT /api/website/schedule/toggle/{id}`; navigation `web/favorites` and `web/schedules/details` field **Favorite**.

## Verification

- open-snooze: schedules.md "Snoozing Schedules" and utilities.md "Snooze Schedules" (**Main Menu > Utilities > Snooze Schedules**). Navigation `uno/mainmenu` → Utilities → `uno/utilities` item **Snooze Schedules**.
- pick-snooze: navigation `uno/utilities/snooze schedules` items. `MenuManager.cs` names "Snooze 1h", "Snooze until midnight", "Snooze until 9am" (next 9:00 local).
- check-status: utilities.md "The top text shows the current snooze status". `MenuManager.cs` SubTitle "Snooze until …" / "Not snoozed".
- resume-early: navigation item **Resume** ("Resume all snoozed schedules").
- web-alternative: schedules.md "Snoozing Schedules" (toggle via custom menus). custom-menus.md "Actions" (**Toggle Schedule**). Navigation `web/favorites` summary (Schedules table with enable/disable). `StorageManager.cs` ScheduleToggle saves Enabled.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
