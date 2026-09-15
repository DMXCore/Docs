---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: both
date: 2026-09-15
title: Stop the Web UI logging out and the touchscreen locking while programming
slug: web-ui-auto-log-off-and-screen-lock
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/users-and-roles
  - dmx-core-100/configuration/admin-mode
  - dmx-core-100/configuration/settings
  - dmx-core-100/getting-started/connecting-to-the-web-ui
verified: docs be6f663, core v2026.914.3
---

# Stop the Web UI logging out and the touchscreen locking while programming

## Original ask

> The web page keeps kicking me out every few minutes while I'm building presets, really annoying. The Admin Mode page says the auto log-off timeout is under Device > System but I don't see any log-off setting there. Also the touchscreen keeps locking itself. Where are these timeouts?

## Goal

The user's own **Auto log-off** is set to 0 (never) or longer in the Web UI under User
Management, and the touchscreen lock timeout is changed separately. The user
understands that these are two different settings.

## Walkthrough

```json
{
  "id": "web-ui-auto-log-off-and-screen-lock",
  "title": "Change the Web UI auto log-off and the touchscreen lock timeout",
  "steps": [
    {
      "id": "open-user",
      "label": "In the Web UI, go to User Management → Users and open your user (an admin with User Management permission has to do this)",
      "docsUrl": "/dmx-core-100/configuration/users-and-roles/#managing-users",
      "screenshotId": "users-list"
    },
    {
      "id": "set-auto-log-off",
      "label": "Set Auto log-off, minutes (0=never) to 0, or to a longer number of minutes, and click Save",
      "docsUrl": "/dmx-core-100/configuration/users-and-roles/#auto-log-off",
      "screenshotId": "users-list"
    },
    {
      "id": "web-screen-lock",
      "label": "For the touchscreen lock, go to Device → System, set Lock Screen after X seconds to a longer time (0 turns the lock off), and click Save",
      "docsUrl": "/dmx-core-100/configuration/settings/#device--system-highlights",
      "screenshotId": "system-settings"
    },
    {
      "id": "touchscreen-screen-lock",
      "label": "Or on the touchscreen, in Admin Mode, open Main Menu → Settings → System Settings and change Screen lock timeout",
      "docsUrl": "/dmx-core-100/configuration/settings/#touchscreen-settings",
      "screenshotId": "uno-settings"
    }
  ]
}
```

## Gotchas

- There is no auto log-off field under **Device > System** at v2026.914.3. Auto log-off
  is **per user** in `User Management > Users`. The Admin Mode page is out of date here.
- Auto log-off and the screen lock are different things. Auto log-off signs the user
  out (Web UI and touchscreen) after N minutes of inactivity. The screen lock
  (**Lock Screen after X seconds** / **Screen lock timeout**) locks the touchscreen
  after N seconds, unlocked with the **Screen Unlock PIN**.
- The per-user value applies to that user only. Other staff accounts keep their own
  timeout.
- Setting 0 (never) on an admin account used remotely is a security trade-off. A
  longer timeout is the safer suggestion.
- The Web UI shows an inactivity warning dialog before it logs you out. Answering it
  keeps the session (source).
- While a local recording or preview is running, neither surface auto-logs off
  (source).
- On the touchscreen, **Screen lock timeout** is listed only on the Appliance and for
  users allowed to change system settings.

## Eval checks

- Auto log-off path is `User Management > Users` (per user), field **Auto log-off** (0 = never)
- Does not tell them the auto log-off timeout is in `Device > System`
- Distinguishes Web/user auto log-off (minutes, per user) from the touchscreen lock (`Lock Screen after X seconds` in `Device > System`, or `Main Menu > Settings` on the touchscreen)
- Notes changing another user's timeout needs User Management (admin)
- Does not invent a global "session timeout" setting
- Does not tell them to use MCP or the Integration API

## Gaps

- **Docs wrong:** `configuration/admin-mode.md` › Logging In via the Web UI says "You can
  configure the auto log-off timeout in **Device > System**". At v2026.914.3 Device >
  System has no such field (nav `web/settings/system`, `Settings.vue`). The timeout
  is the per-user field **Auto log-off, minutes (0=never)**
  (`src/AdminSite/ClientApp/src/views/operation/UserDetails.vue`, nav
  `web/users/details`), which `users-and-roles.md` documents correctly.
- `configuration/settings.md` › Touchscreen Settings doesn't mention **System
  Settings**, **Screen lock timeout** (Appliance only), or the **Change current
  user's pin** action. Source: nav `uno/settings/system settings`,
  `src/UnoHost/Services/MenuManager.cs`.
- The screen lock label differs between surfaces. Web **Device > System** says "Lock
  Screen after X seconds"; the touchscreen says "Screen lock timeout" (help "Lock
  screen after X seconds (0 to disable)"). The docs name only the Web label.
- The docs don't mention the Web UI inactivity warning before log-off
  (`src/AdminSite/ClientApp/src/main.js` emits `show-inactivity-prompt`;
  `components/InactivityPrompt.vue`).
- The docs don't mention that auto log-off is suspended during a local recording or
  preview (`main.js` checks `ourRecorderActive`; `src/UnoHost/Services/SessionManager.cs`
  returns early while Recording/RecorderActive/Previewing is local).
- `users-and-roles.md` says **Add**, not the UI's **Add New** (covered in
  `staff-login-and-change-default-pin.md`). Not needed for this task.

## Verification

- Step `open-user`: `configuration/users-and-roles.md` › Managing Users (Web UI only).
  Source: nav `web/users` (permission USERMANAGEMENT), `web/users/details`.
- Step `set-auto-log-off`: `users-and-roles.md` › Managing Users ("Auto log-off — an
  inactivity timeout in minutes (0 = never), per user") and › Auto Log-off
  (touchscreen and Web UI). Source: `UserDetails.vue` label `Auto log-off, minutes
  (0=never)`. Web timer uses `autoLogOffMinutes` (`Login.vue`, `main.js`). Touchscreen
  uses `currentUser.AutoLogOffMinutes` in `SessionManager.cs` `LogOffTimerCallback`.
- Step `web-screen-lock`: `configuration/settings.md` › Device > System Highlights
  ("Screen Unlock PIN and Lock Screen after X seconds — the touchscreen lock"). Source:
  nav `web/settings/system` field `Lock Screen after X seconds`
  (`HostConfig.LockScreenSeconds`); `Settings.vue` **Save** button;
  `SessionManager.cs` locks only when `LockScreenSeconds > 0`.
- Step `touchscreen-screen-lock`: `configuration/settings.md` › Touchscreen Settings
  (**Main Menu > Settings**); `configuration/admin-mode.md` (Admin Mode). Source: nav
  `uno/settings` item **System Settings** → `uno/settings/system settings` field
  `Screen lock timeout` (visibleWhen ChangeSystemSettings and Appliance).
- Correction of admin-mode.md: nav `web/settings/system` field list (no log-off field).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
