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

![User management list](/assets/web/users-list.png)

To create a new user:

1. Go to **User Management > Users** in the Web UI
2. Click **Add**
3. Set a **Name** and **PIN** for the user
4. Assign a **Role** that defines their permissions
5. Click **Save**

Per-user options include:

- **Web Login Method** — how the user signs in to the Web UI: their **PIN code** or a **password**. A password is the better choice for accounts used remotely; the touchscreen always uses the PIN.
- **Auto log-off** — an inactivity timeout in minutes (0 = never), per user.
- **Enabled** — disable an account without deleting it.

### User Tokens

Users can be given access tokens for programmatic access to the API. This is useful for integration with external systems that need to authenticate without a PIN.

## Roles and Permissions

Roles define what a user can do. The system ships with **Admin**, **Operator**, and **Standard** roles, and you can create your own under **User Management > Roles**.

Each role is a set of individually toggleable permissions covering:

| Area | Permissions |
|------|------------|
| Content | Edit/Delete Cue, Preset, Effect, Timeline, Schedule, Sound |
| Automation | Edit/Delete Input Trigger, Output Event; Snooze Schedules |
| Control | Edit Remote Control (control surfaces and DSP remotes), Change Custom Menu |
| Outputs | Edit/Delete Output, Record |
| System | Device Operations (restart/reboot), Change Network Settings, Change System Settings, Change Plugin Settings |
| Data | Create Local Backup, Create Cloud Backup, File Explorer |
| Admin | User Management |

:::note
Non-admin users can rename and delete cues they created within 24 hours of creation, even without the full Edit/Delete Cue permissions.
:::

## Guests

[Custom menus](/dmx-core-100/scheduling-automation/custom-menus#guest-access) marked **Available to Guests** can be used from the Web UI without any login — guests see only those menus and nothing else.

## Auto Log-off

Both the touchscreen and Web UI support automatic log-off after a period of inactivity, configurable per user.
