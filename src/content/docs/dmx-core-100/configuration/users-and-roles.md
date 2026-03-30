---
title: Users & Roles
description: Manage user accounts and role-based permissions
---

The DMX Core 100 supports multiple user accounts, each with a role that determines what features they can access. This lets you give different people different levels of control — for example, a full admin for the installer and a limited operator account for daily use.

:::tip[Web UI only]
User and role management is available in the Web UI under **User Management > Users** and **User Management > Roles**.
:::

## Default Account

The system comes with a default admin account with PIN `1111`. It is recommended to change this PIN after initial setup.

## Managing Users

<!-- SCREENSHOT: Web UI user management list (dark mode) -->

To create a new user:

1. Go to **User Management > Users** in the Web UI
2. Click **Add**
3. Set a **Name** and **PIN** for the user
4. Assign a **Role** that defines their permissions
5. Click **Save**

Each user logs in with their own PIN on both the touchscreen and the Web UI.

### User Tokens

Users can be given access tokens for programmatic access to the API. This is useful for integration with external systems that need to authenticate without a PIN.

## Roles and Permissions

Roles define what a user can do. Go to **User Management > Roles** to create and manage roles.

Each role is a set of permissions that can be individually toggled:

| Permission | Description |
|------------|-------------|
| Edit Cue / Delete Cue | Create, modify, and remove cues |
| Edit Preset / Delete Preset | Create, modify, and remove presets |
| Edit Effect | Create and modify effects |
| Edit Timeline / Delete Timeline | Create, modify, and remove timelines |
| Edit Schedule / Delete Schedule | Create, modify, and remove schedules |
| Edit Sound / Delete Sound | Create, modify, and remove sounds |
| Edit Input Trigger / Delete Input Trigger | Manage input triggers |
| Edit Output Event / Delete Output Event | Manage output events |
| Edit Output / Delete Output | Manage output configuration |
| Edit Remote Control | Configure satellite devices |
| Record | Access the recording feature |
| Snooze Schedules | Temporarily disable schedules |
| Device Operations | Restart services, reboot device |
| Change Network Settings | Modify network configuration |
| Change System Settings | Modify system-level settings |
| Change Plugin Settings | Configure integration plugins |
| Create Local Backup | Create backups to local storage |
| Create Cloud Backup | Create backups to cloud storage |
| User Management | Manage users and roles |
| Change Custom Menu | Edit custom menu configuration |
| File Explorer | Access the file browser |

:::note
Non-admin users can rename and delete cues they created within 24 hours of creation, even without the full Edit/Delete Cue permissions.
:::

## Auto Log-off

Both the touchscreen and Web UI support automatic log-off after a period of inactivity. Configure the timeout in **Settings > System**.
