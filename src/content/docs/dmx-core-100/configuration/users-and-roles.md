---
title: Users & Roles
description: Manage user accounts and role-based permissions
---

The DMX Core 100 supports multiple user accounts, each with a role that determines what features they can access. This lets you give different people different levels of control - for example, a full admin for the installer and a limited operator account for daily use.

:::tip[Web UI only]
User and role management is available in the Web UI under **User Management > Users** and **User Management > Roles**.
:::

## Default Account

The system comes with a default admin account with PIN `1111`. It is recommended to change this PIN after initial setup.

## Managing Users

![User management list](/assets/web/users-list.png)

To create a new user:

1. Go to **User Management > Users** in the Web UI
2. Click **Add New**
3. Set a **Name** and **PIN** for the user
4. Assign a **Role** that defines their permissions
5. Click **Save**

Per-user options include:

- **Web Login Method** - how the user signs in to the Web UI: their **PIN code** or a **password**. A password is the better choice for accounts used remotely; the touchscreen always uses the PIN.
- **Auto log-off** - an inactivity timeout in minutes (0 = never), per user.
- **Enabled** - disable an account without deleting it.

### User Tokens

Users can be given access tokens for programmatic access to the API. This is useful for integration with external systems that need to authenticate without a PIN.

### API Keys

Long-lived API keys are managed under **User Management > API Keys**. Each key has a **type** that decides what it can reach:

| Type | Used by | Authenticates on |
|------|---------|------------------|
| **MCP** | [MCP Server](/dmx-core-100/integrations/mcp-server) - AI clients such as Claude Desktop and Cursor | `/mcp` |
| **Integration** | [Integration API](/dmx-core-100/integrations/integration-api) - Bitfocus Companion, Crestron, Node-RED and similar control systems | `/api/integration` |

- Pick the type when creating the key on that page, or issue a key of the right type straight from **Device > System** with **Issue MCP API Key** / **Issue Integration API Key** when that feature is enabled
- The secret is shown once at creation - store it securely
- A key works only on its own surface; neither type can be exchanged for a Web UI JWT or used on the admin REST API
- Revoke a key anytime; the list shows first-used and last-used times, and a revoked key is refused immediately

Creating API keys requires **User Management** or **Change System Settings**.

## Roles and Permissions

Roles define what a user can do. The system ships with **Admin**, **Operator**, and **Standard** roles, and you can create your own under **User Management > Roles** (**Add New**). The role editor has **Name**, **Is Admin**, and a **Permissions** list.

![Roles list](/assets/web/roles-list.png)

![Role editor - Operator permissions](/assets/web/role-editor.png)

The built-in **Operator** role includes Edit/Delete Schedule, Device Operations, Change Network Settings, Change Output Settings, Edit Output, Record, File Explorer (including upload/transfer), and local/cloud backup restore - enough for day-to-day show work without User Management or factory reset. **Standard** has Edit/Delete Schedule, Device Operations, and cloud backup only. Neither Operator nor Standard includes **Start/Stop output**, which is what the touchscreen [Stop/Blackout](/dmx-core-100/basics/blackout-and-stop) tile requires.

Playing a cue in the Web UI only needs a signed-in user - it does not require a separate Play Cue permission.

Each role is a set of individually toggleable permissions covering:

| Area | Permissions |
|------|------------|
| Content | Edit/Delete Cue, Preset, Effect, Timeline, Schedule, Sound |
| Playback | Start/Stop output, Manipulate Playback |
| Automation | Edit/Delete Input Trigger, Output Event; Snooze Schedules |
| Control | Edit Remote Control (control surfaces and DSP remotes), Change Custom Menu |
| Outputs | Edit/Delete Output, Record, Change Output Settings |
| System | Device Operations (restart/reboot), Change Network Settings, Change System Settings (including [factory reset](/dmx-core-100/configuration/utilities#factory-reset)), Change Plugin Settings, Upgrade Software, Remote Screen ([view and operate the touchscreen](/dmx-core-100/configuration/utilities#remote-screen) and see the VNC login) |
| Data | Create Local Backup, Create Cloud Backup, File Explorer (and its sub-permissions), View Audit Log |
| Admin | User Management |

:::note
Non-admin users can rename and delete cues they created within 24 hours of creation, even without the full Edit/Delete Cue permissions.
:::

## Guests

[Custom menus](/dmx-core-100/scheduling-automation/custom-menus#guest-access) marked **Available to Guests** can be used from the Web UI without any login - guests see only those menus and nothing else.

## Auto Log-off

Both the touchscreen and Web UI support automatic log-off after a period of inactivity, configurable per user.
