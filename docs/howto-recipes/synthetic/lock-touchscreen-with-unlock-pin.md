---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: web
date: 2026-09-15
title: Lock the touchscreen with a PIN after it sits idle
slug: lock-touchscreen-with-unlock-pin
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/settings
verified: docs be6f663, core v2026.914.3
---

# Lock the touchscreen with a PIN after it sits idle

## Original ask

> Our wall unit is in a church lobby and kids keep pressing stuff on the screen. Can I make the screen lock itself after a couple minutes and need a code to unlock? I'm on the web page for the unit right now.

## Goal

The touchscreen locks after 120 seconds without use and needs a 4-digit PIN to unlock, set from the Web UI.

## Walkthrough

```json
{
  "id": "lock-touchscreen-with-unlock-pin",
  "title": "Lock the touchscreen with a PIN after 2 minutes idle",
  "steps": [
    {
      "id": "open-device-system",
      "label": "In the Web UI, go to Device → System",
      "docsUrl": "/dmx-core-100/configuration/settings/#device--system-highlights",
      "screenshotId": "system-settings"
    },
    {
      "id": "set-unlock-pin",
      "label": "Enter a 4-digit code in Screen Unlock Pin",
      "docsUrl": "/dmx-core-100/configuration/settings/#device--system-highlights",
      "screenshotId": "system-settings"
    },
    {
      "id": "set-lock-seconds",
      "label": "Set Lock Screen after X seconds to 120",
      "docsUrl": "/dmx-core-100/configuration/settings/#device--system-highlights",
      "screenshotId": "system-settings"
    },
    {
      "id": "save",
      "label": "Click Save, then leave the touchscreen untouched for 2 minutes and check that it asks for the PIN",
      "docsUrl": "/dmx-core-100/configuration/settings/#device--system-highlights",
      "screenshotId": "system-settings"
    }
  ]
}
```

## Gotchas

- The PIN must be exactly 4 characters (digits). Other values are cleared when the settings are saved, which leaves the screen with no PIN.
- **Lock Screen after X seconds** set to `0` means never lock automatically. The field accepts up to 600 seconds.
- Changing these settings needs the **Change System Settings** permission (the built-in Admin role has it).
- The screen lock is not the same as **Lock Down device**, which restricts what users can do on the device, or admin log-in PINs. The unlock PIN only unlocks the touchscreen.
- If they want visitors to see only a few buttons instead of a locked screen, **Only show custom menu** with a [custom menu](/dmx-core-100/scheduling-automation/custom-menus) is the alternative; mention it only as an option.

## Eval checks

- Menu path is `Device > System`
- Field names `Screen Unlock Pin` (docs write "Screen Unlock PIN") and `Lock Screen after X seconds`
- Uses value `120` seconds (or "2 minutes") from the question
- Says the PIN is 4 digits
- Mentions saving the page
- Does not confuse it with `Lock Down device` or the admin login PIN
- Does not tell them to change a user's PIN under `User Management`
- Does not tell them to use MCP or the Integration API

## Gaps

- Docs label: `configuration/settings.md` "Device > System Highlights" writes **Screen Unlock PIN**; the UI label at v2026.914.3 is **Screen Unlock Pin**. Source: `src/Shared/Controllers/WebsiteController.Settings.cs` (`SettingModel.Create("Screen Unlock Pin", …)`), navigation `web/settings/system`.
- Docs missing: the PIN must be 4 characters with digits, or it is cleared on save; **Lock Screen after X seconds** accepts 0–600 and 0 disables. Source: `src/BusinessObject/HostConfig.cs` (ScreenUnlockPin validation), `WebsiteController.Settings.cs` (`minValue: 0, maxValue: 600`), `src/UnoHost/Services/SessionManager.cs` (locks only when `LockScreenSeconds > 0`).
- Docs missing (touchscreen): the same settings exist on the device but are not documented. **Main Menu > Settings > Screen Unlock Pin** asks for the current PIN (if one is set), then a new PIN twice; **Settings > System Settings > Screen lock timeout** ("Lock screen after X seconds (0 to disable)") appears on the Appliance only; a lock button appears in the touchscreen footer once a PIN is set ("Lock screen? (Pin required to unlock)"). Source: navigation `uno/settings`, `uno/settings/system settings`; `MenuManager.cs` (`ChangeScreenUnlockPin`, "Screen lock timeout"); `src/UnoHost/Views/FooterControl.xaml` (LockButton); `src/UnoHost/ViewModels/BaseViewModel.cs` (`OnLock`).
- Related docs error found on the same touchscreen screen: `customizations/themes.md` says **Main Menu > Settings > Display Theme**. At v2026.914.3 it is **Settings > System Settings > System Theme** (Preferences header). The Web UI theme menu also has an Auto option besides light/dark. Source: `MenuManager.cs` ("System Theme"), navigation `uno/settings/system settings`; `src/AdminSite/ClientApp/src/components/AppHeader.vue` (`setColorMode('auto')`).
- Screenshot: `system-settings` is captured for the Location field; it may not show the lock fields in view.

## Verification

- Device → System: `configuration/settings.md` "Web UI Settings" table row **Device > System**; navigation `web/settings/system` (route /op/settings/SYSTEM, permission CHANGESYSTEMSETTINGS).
- Screen Unlock Pin and Lock Screen after X seconds: `settings.md` "Device > System Highlights" ("Screen Unlock PIN and Lock Screen after X seconds — the touchscreen lock"); navigation `web/settings/system` fields "Screen Unlock Pin", "Lock Screen after X seconds"; `WebsiteController.Settings.cs`.
- Save: `src/AdminSite/ClientApp/src/views/operation/Settings.vue` primary button "Save" ("Saved successfully!").
- Lock behavior: `SessionManager.cs` locks when idle time exceeds `LockScreenSeconds` and it is above 0; `LockViewModel.cs` requires the 4-digit PIN.
- Lock Down device and Only show custom menu are separate fields: `settings.md` "Lock-down options"; navigation `web/settings/system`.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
