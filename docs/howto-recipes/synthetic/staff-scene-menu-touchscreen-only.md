---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: both
date: 2026-09-15
title: Show staff only a scene menu on the touchscreen
slug: staff-scene-menu-touchscreen-only
anonymized: true
docs_slugs:
  - dmx-core-100/scheduling-automation/custom-menus
  - dmx-core-100/configuration/settings
  - dmx-core-100/configuration/admin-mode
verified: docs be6f663, core v2026.914.3
---

# Show staff only a scene menu on the touchscreen

## Original ask

> Restaurant install. Staff keep poking around in the settings on the wall touchscreen. I want the screen to show three big buttons only: Lunch, Dinner, Lights Off. The Lunch and Dinner presets already exist. Can I build that on the touchscreen itself, or do I need the web page?

## Goal

A custom menu with three Action items is built in the Web UI. **Only show custom menu** is turned on so non-admin users see just that menu on the touchscreen. Admins can still reach the full menus.

## Walkthrough

```json
{
  "id": "staff-scene-menu-touchscreen-only",
  "title": "Show staff only a scene menu on the touchscreen",
  "steps": [
    {
      "id": "new-menu",
      "label": "In the Web UI, go to Control & Integrations → Custom Menus and click Add New; set Name (e.g. Staff), Type Items (default), and turn Enabled on",
      "docsUrl": "/dmx-core-100/scheduling-automation/custom-menus/#managing-menus",
      "screenshotId": "custom-menu-editor"
    },
    {
      "id": "add-scene-items",
      "label": "Click Add item, set Type to Action, Name Lunch, and under Trigger Action pick Apply Preset with the Lunch preset; repeat for Dinner",
      "docsUrl": "/dmx-core-100/scheduling-automation/custom-menus/#menu-items",
      "screenshotId": "custom-menu-editor"
    },
    {
      "id": "add-off-item",
      "label": "Add a third Action item named Lights Off with Fade Out (optionally turn on Require confirmation), then Save",
      "docsUrl": "/dmx-core-100/scheduling-automation/custom-menus/#actions",
      "screenshotId": "custom-menu-editor"
    },
    {
      "id": "only-custom-menu",
      "label": "Go to Device → System and turn on Only show custom menu, then save",
      "docsUrl": "/dmx-core-100/configuration/settings/#device--system-highlights",
      "screenshotId": "system-settings"
    },
    {
      "id": "check-touchscreen",
      "label": "On the touchscreen, leave Admin Mode and confirm the start screen is the Staff menu; an admin can still log in and open it under Main Menu → Utilities → Custom Menu",
      "docsUrl": "/dmx-core-100/scheduling-automation/custom-menus/",
      "screenshotId": "uno-utilities"
    }
  ]
}
```

## Gotchas

- Menus are designed only in the Web UI. The touchscreen shows and runs them, but has no menu editor.
- **Only show custom menu** only takes effect when at least one enabled custom menu exists. It never applies to admins, so test it as a non-admin.
- A menu marked **Only Admin** is hidden from staff. Leave it off for this menu.
- With a single visible menu the touchscreen opens its items directly. With several, it lists the menus first.
- **Presets / Cues list** items are touchscreen-only. **Available to Guests** only affects the browser, not the touchscreen.
- **Lock Down device** is a separate setting. This task only needs **Only show custom menu**.

## Eval checks

- Answers the "touchscreen or web?" part: the menu is built in the Web UI and shown on the touchscreen
- Menu editor path is `Control & Integrations > Custom Menus` (the released location), action **Add New**
- Item **Type** is **Action**, with **Apply Preset** for Lunch/Dinner and an off action such as **Fade Out**
- Uses `Device > System` → **Only show custom menu**
- Mentions admins still see the full menus, or that testing must be done logged out of Admin Mode
- Touchscreen access path for admins is `Main Menu > Utilities > Custom Menu`
- Does not claim menus can be created on the touchscreen
- Does not invent a "Kiosk mode" switch or a per-user home screen setting
- Does not tell them to use MCP or the Integration API

## Gaps

- custom-menus.md "Managing Menus" and settings.md "Web UI Settings" table put custom menus under **Device > Custom Menus**. At v2026.914.3 the sidebar item is under **Control & Integrations > Custom Menus** (`src/AdminSite/ClientApp/src/_nav.js`, `ControlIntegrations/CustomMenus`; navigation `web/custommenus`).
- custom-menus.md does not describe how the touchscreen reaches menus. It is **Main Menu > Utilities > Custom Menu**, which opens a single menu directly or lists several. With **Only show custom menu** on, a non-admin user starts on the menu. Source: `MenuManager.NavigateToStart` and the Utilities "Custom Menu" item (`src/UnoHost/Services/MenuManager.cs`), `SessionManager.UpdateCustomMenuOnly` (`src/UnoHost/Services/SessionManager.cs`); navigation `uno/utilities/custom menu`.
- custom-menus.md "Menu Items" calls the button **Action**. The editor's **Add item** button and its Type labels (e.g. "Action (play cue / preset / sound / etc.)", "Presets (list browser, Uno only)") are not named. Source: `src/AdminSite/ClientApp/src/components/CustomMenuItemsEditor.vue`.
- favorites.md says favorites appear on the touchscreen home screen/dashboard when the custom menu is configured. The released touchscreen code has no favorites support: no "favorite" references in `src/UnoHost` at v2026.914.3, and navigation `uno/home` has no favorites.
- No touchscreen screenshot of a custom menu (catalog has only the Web `custom-menu-editor`).

## Verification

- new-menu: custom-menus.md "Managing Menus" (Enabled, Only Admin, Type **Items**). `_nav.js` Control & Integrations → Custom Menus. Navigation `web/custommenus` (**Add New**) and `web/custommenus/details` (**Name**, **Type** "Items (default)", **Enabled**).
- add-scene-items: custom-menus.md "Menu Items" (Action type) and "Actions" (Apply Preset). `CustomMenuItemsEditor.vue` (**Add item**, `ITEM_TYPE_OPTIONS` ACTION, "Trigger Action" subtitle using `TriggerActionEditor`).
- add-off-item: custom-menus.md "Actions" (Fade Out) and per-item **Require confirmation**. `TriggerActionEditor.vue` option `FADEOUT` "Fade Out". `CustomMenuItemsEditor.vue` `confirm: 'Require confirmation'`.
- only-custom-menu: settings.md "Device > System Highlights" (lock-down options: show only the custom menu). Navigation `web/settings/system` field **Only show custom menu** (`HostConfig.CustomMenuOnly`).
- check-touchscreen: admin-mode.md (Admin Mode). `MenuManager.NavigateToStart` (custom menu start when CustomMenuOnly and no OverrideCustomMenuOnly permission). `SessionManager.UpdateCustomMenuOnly` (not for admin role). Navigation `uno/utilities` item **Custom Menu**.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
