---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: web
date: 2026-09-15
title: Change the default admin PIN and add a limited staff login
slug: staff-login-and-change-default-pin
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/users-and-roles
  - dmx-core-100/getting-started/connecting-to-the-web-ui
  - dmx-core-100/configuration/admin-mode
verified: docs be6f663, core v2026.914.3
---

# Change the default admin PIN and add a limited staff login

## Original ask

> Install at a bar. Half the staff already figured out the code is 1111 lol. I want my own admin code, and a separate login for the staff so they can run the scenes but can't mess with outputs or network settings. Is the Operator role the right one for that?

## Goal

The Administrator PIN is no longer `1111`. Staff have their own user with a role
limited to what they need, created in the Web UI under User Management.

## Walkthrough

```json
{
  "id": "staff-login-and-change-default-pin",
  "title": "Change the default admin PIN and add a limited staff login",
  "steps": [
    {
      "id": "open-users",
      "label": "Log in to the Web UI as Administrator and go to User Management → Users",
      "docsUrl": "/dmx-core-100/configuration/users-and-roles/#managing-users",
      "screenshotId": "users-list"
    },
    {
      "id": "change-admin-pin",
      "label": "Open the Administrator user, enter a new 4-digit Pin, and click Save",
      "docsUrl": "/dmx-core-100/configuration/users-and-roles/#default-account",
      "screenshotId": "users-list"
    },
    {
      "id": "create-role",
      "label": "Go to User Management → Roles, click Add New, name the role (e.g. Staff), leave Is Admin off, turn on only the permissions staff need, and click Save",
      "docsUrl": "/dmx-core-100/configuration/users-and-roles/#roles-and-permissions",
      "screenshotId": null
    },
    {
      "id": "create-user",
      "label": "Go back to User Management → Users, click Add New, set a Name and Pin, choose the Staff Role, and click Save",
      "docsUrl": "/dmx-core-100/configuration/users-and-roles/#managing-users",
      "screenshotId": "users-list"
    },
    {
      "id": "test-login",
      "label": "Log out and sign in as the staff user on the Web UI login page to check what they can see",
      "docsUrl": "/dmx-core-100/getting-started/connecting-to-the-web-ui/#logging-in",
      "screenshotId": "login"
    }
  ]
}
```

## Gotchas

- Don't assume **Operator** is a locked-down role. The docs only say the system ships
  Admin, Operator and Standard. At v2026.914.3 the built-in Operator role includes
  Change Network Settings, Change Output Settings, Edit Output, Record, File Explorer
  and backup/restore. That is exactly what this user wants to keep away from staff.
  Open the role to check, or create a custom role.
- PINs are 4 digits. The touchscreen always uses the PIN; the Web UI can use a
  password instead (**Web Login Method**).
- Write the new admin PIN down. Losing it means the Forgot Admin PIN procedures.
- Non-admin users can still rename and delete cues they created within 24 hours.
- **Auto log-off** and **Enabled** are per user on the same page. **Enabled** lets
  you lock out a staff account without deleting it.

## Eval checks

- Paths are `User Management > Users` and `User Management > Roles` (Web UI only)
- Tells them to change the Administrator PIN (not only add a user)
- Creating a user: Name, PIN, Role, Save (accept "Add" or "Add New")
- Recommends a custom role with only the needed permissions, or checking the role's permissions, instead of asserting Operator is limited
- Mentions PIN is 4 digits or that the touchscreen always uses the PIN (either)
- Does not claim user management is available on the touchscreen
- Does not invent a "Staff" or "Bartender" built-in role
- Does not tell them to use MCP or the Integration API

## Gaps

- `configuration/users-and-roles.md` › Managing Users says click **Add**. The Users
  list button is **Add New** (`src/AdminSite/ClientApp/src/views/operation/Users.vue`,
  nav `web/users` action "Add New"). The Roles list is the same (nav `web/roles`).
- `users-and-roles.md` doesn't describe the role editor fields **Name**, **Is Admin**
  and **Permissions** (Permissions hidden when Is Admin is on). Source:
  `src/AdminSite/ClientApp/src/views/operation/RoleDetails.vue`, nav
  `web/roles/details`.
- The docs don't list what the built-in Operator and Standard roles grant. Source:
  `src/DataAccess/DataManager.cs` initial role seed. Operator = EditSchedule,
  DeleteSchedule, DeviceOperations, Create/RestoreCloudBackup, ChangeNetworkSettings,
  ChangeOutputSettings, Record, FileExplorer, FileExplorerUploadTransfer,
  Create/RestoreLocalBackup, EditOutput. Standard = EditSchedule, DeleteSchedule,
  DeviceOperations, Create/RestoreCloudBackup.
- The permission table in `users-and-roles.md` › Roles and Permissions is incomplete
  compared with `src/BusinessObject/UserPermissions.cs`. Missing or not named as in
  the UI: Start/Stop output, Access Only-Admin items, Custom Menu Only, Manipulate
  Playback, Manage Ambient Presets, Edit Zones, View Audit Log, Upgrade Software,
  Download Logs, the File Explorer sub-permissions, and others.
- The docs don't say whether playing cues needs a permission. In the Web UI, cue play
  only requires a signed-in user (`src/Shared/Controllers/WebsiteController.Cues.cs`
  `PlayCue` is `[AnyAuthenticatedUser]`). So a role with every permission off can
  still run cues.
- No screenshot of the Roles list or role editor. The field label is **Pin** in the
  UI; the docs say **PIN**.

## Verification

- Step `open-users`: `configuration/users-and-roles.md` (tip "Web UI only", ›
  Managing Users). Source: nav `web/users` (`Users.vue`, permission USERMANAGEMENT).
- Step `change-admin-pin`: `users-and-roles.md` › Default Account ("recommended to
  change this PIN"). Source: nav `web/users/details` field **Pin** (number, maxLength 4
  in `UserDetails.vue`), actions Save / Save & Go Back.
- Step `create-role`: `users-and-roles.md` › Roles and Permissions ("create your own
  under User Management > Roles"). Source: nav `web/roles` (Add New),
  `web/roles/details` (Name, Is Admin, Permissions, Save).
- Step `create-user`: `users-and-roles.md` › Managing Users (Name, PIN, Role, Save).
  Source: `UserDetails.vue` labels Name, Enabled, Auto log-off, minutes (0=never),
  Pin, Web Login Method, Role.
- Step `test-login`: `getting-started/connecting-to-the-web-ui.md` › Logging In.
  Source: nav `web/login`, `Login.vue`.
- Operator contents gotcha: `src/DataAccess/DataManager.cs` (role seed).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
