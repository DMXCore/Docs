---
status: candidate
source: synthetic
invented: true
level: newbie
surface: touchscreen
date: 2026-09-15
title: Black out or stop everything from the touchscreen
slug: touchscreen-blackout-and-stop
anonymized: true
docs_slugs:
  - dmx-core-100/basics/blackout-and-stop
  - dmx-core-100/configuration/admin-mode
  - dmx-core-100/getting-started/main-menu
verified: docs be6f663, core v2026.914.3
---

# Black out or stop everything from the touchscreen

## Original ask

> at closing the bartender needs to kill all the lights from the little screen on the wall, no laptop. is there a blackout button?? i dont see one on the main page

After the first answer, the user follows up:

> ok and what if i want the show to actually stop, not just go dark

## Goal

On the touchscreen, a signed-in admin taps **Stop/Blackout** under Utilities to
switch Blackout on and taps it again to release it. Holding it runs Stop instead.

## Walkthrough

```json
{
  "id": "touchscreen-blackout-and-stop",
  "title": "Black out or stop everything from the touchscreen",
  "steps": [
    {
      "id": "admin-login",
      "label": "Tap the user icon in the bottom bar and log in with the admin PIN (the bottom bar turns red in Admin Mode)",
      "docsUrl": "/dmx-core-100/configuration/admin-mode/",
      "screenshotId": "admin-login-keypad"
    },
    {
      "id": "open-utilities",
      "label": "Open Main Menu → Utilities",
      "docsUrl": "/dmx-core-100/getting-started/main-menu/",
      "screenshotId": "uno-utilities"
    },
    {
      "id": "tap-blackout",
      "label": "Tap Stop/Blackout to switch Blackout on; tap it again to release it",
      "docsUrl": "/dmx-core-100/basics/blackout-and-stop/#blackout",
      "screenshotId": "uno-utilities"
    },
    {
      "id": "hold-stop",
      "label": "To end playback instead of hiding it, press and hold Stop/Blackout (Stop); the room returns to the ambient preset, or to what End of Data does",
      "docsUrl": "/dmx-core-100/basics/blackout-and-stop/#stop",
      "screenshotId": "uno-utilities"
    }
  ]
}
```

## Gotchas

- Blackout is a mask, not a stop: cues, timelines, schedules and sounds keep running
  underneath, and releasing Blackout shows whatever is current at once.
- Nothing else releases Blackout (not a preset, a schedule or a cue starting). It is
  not saved across a restart.
- Stop keeps the ambient preset. If they want dark *and* stopped: Stop, then Blackout.
- The **Stop/Blackout** tile only appears for a signed-in user whose role allows
  starting/stopping output. Admin has it. The built-in Operator and Standard roles do
  not (source), and it is not shown while nobody is logged in.
- **Start output** is a separate tile next to it. It restarts output and does not
  release Blackout.
- **Output Off** / Toggle Output is a different thing (no signal, saved across restart),
  not the blackout they asked for.
- If staff should not have the admin PIN, a custom menu button with the Blackout
  action is the documented way to give them a one-tap control. Only mention this as
  an option.

## Eval checks

- Menu path is `Main Menu > Utilities` and the item is **Stop/Blackout**
- Says tap = Blackout on/off (latched), hold = Stop
- Says admin login first (user icon in the bottom bar, PIN)
- Explains Blackout keeps playback running underneath; Stop ends playback and leaves the ambient preset
- Does not claim a blackout button on the home screen
- Does not send them to the Web UI Faders page as the only answer (they asked for no laptop)
- Does not describe Toggle Output / Output Off as the blackout
- Does not tell them to use MCP or the Integration API

## Gaps

- `basics/blackout-and-stop.md` › Blackout says "On the touchscreen, the
  **Stop/Blackout** button…" but not where it is. At v2026.914.3 it is a tile in
  **Utilities** (`src/UnoHost/Services/MenuManager.cs`, Utilities list, `Name =
  "Stop/Blackout"`, nav `uno/utilities`).
- The docs don't say the tile is permission-gated. It is shown only when
  `sessionManager.HasPermission(UserPermissions.StartStopOutput)` is true
  (`MenuManager.cs`). That is false with nobody signed in
  (`src/UnoHost/Services/SessionManager.cs` `HasPermission` returns false for no user).
- `configuration/users-and-roles.md` › Roles and Permissions leaves "Allow to
  Start/Stop output" (`StartStopOutput`, `src/BusinessObject/UserPermissions.cs`) out
  of its table.
- The docs don't list what the built-in Operator and Standard roles contain. Neither
  includes `StartStopOutput` (`src/DataAccess/DataManager.cs`, initial role seed).
- No screenshot shows the Stop/Blackout tile itself. I have not checked whether
  `uno-utilities` includes it.
- Docs page `getting-started/main-menu.md` › Utilities doesn't mention Stop/Blackout.

## Verification

- Step `admin-login`: `configuration/admin-mode.md` (PIN login, red bottom bar, user
  icon in the bottom bar). Source: `src/UnoHost/Views/FooterControl.xaml`
  `AdminLogonButton` → `AdminCommand` → `BaseViewModel.OnAdmin()` (user select, PIN
  dialog, "Log off" confirm when signed in).
- Step `open-utilities`: `getting-started/main-menu.md` › Utilities. Source: nav
  `uno/mainmenu` item **Utilities** → `uno/utilities`.
- Step `tap-blackout`: `basics/blackout-and-stop.md` › Blackout ("switches Blackout on
  with a tap (tap again to release)"). Source: nav `uno/utilities` item
  **Stop/Blackout** ("Tap toggles a latched blackout (tap again to release)").
  `MenuManager.cs` `TappedAction` flips `CurrentServerState.Blackout`.
- Step `hold-stop`: `basics/blackout-and-stop.md` › Blackout ("stops on a hold") and
  › Stop (ambient preset / End of Data). Source: `MenuManager.cs` `HeldAction` →
  `storageManager.StopAll()`.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
